import { Controller, Post, Body, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { signJwt } from '../../infrastructure/config/jwt.util';

@Controller('auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(
        @Body()
        body: {
            firstname: string;
            lastname: string;
            email: string;
            username: string;
            password: string;
        },
    ) {
        const userExists = await this.usersService.findByUsername(body.username);
        if (userExists) {
            throw new ConflictException('User already exists');
        }
        const emailExists = await this.usersService.findByEmail(body.email);
        if (emailExists) {
            throw new ConflictException('Email already used');
        }
        const user = await this.usersService.create(
            body.username,
            body.password,
            body.firstname,
            body.lastname,
            body.email,
        );
        return { id: user.id, username: user.username };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.usersService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = signJwt({
            id: user.id,
            username: user.username,
            email: user.email,
        });
        return {
            id: user.id,
            username: user.username,
            token,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            options: {
                color: user.options?.color || '#2f3136',
                theme: user.options?.theme || 'dark',
            },
        };
    }
}

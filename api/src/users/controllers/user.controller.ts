import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/decorators/current-user.decorator';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
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
        return this.usersService.create(
            body.username,
            body.password,
            body.firstname,
            body.lastname,
            body.email,
        );
    }

    @Patch('me')
    async updateProfile(
        @Body() body: { username?: string; options?: { color?: string } },
        @CurrentUser() user: { id: string },
    ) {
        return this.usersService.updateProfile(user.id, body);
    }
}

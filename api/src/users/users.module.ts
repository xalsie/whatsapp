import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [InfrastructureModule],
    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}

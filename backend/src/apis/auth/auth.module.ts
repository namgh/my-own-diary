import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { jwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [AuthService, UserService, JwtRefreshStrategy, jwtAccessStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

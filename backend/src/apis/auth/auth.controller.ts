import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { AuthAccessGuard, AuthRefreshGuard } from 'src/common/auth/auth.guard';
import { LoginInput } from './dto/login.input';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @ApiOkResponse({ type: String })
  async login(@Body() Input: LoginInput, @Res() res: Response) {
    const user = await this.userService.findemail({ email: Input.email });
    if (!user)
      throw new UnprocessableEntityException('email이 존재하지 않습니다.');

    const isAuthenticated = await bcrypt.compare(Input.password, user.password); //user.password - 해쉬된 비밀번호
    if (!isAuthenticated)
      throw new UnauthorizedException('비밀번호가 틀렸습니다!!!');
    await this.authService.setRefreshToken({ user, res: res });

    const accesstoken = this.authService.getAccessToken({ user });
    res.send(accesstoken);
  }

  @UseGuards(AuthRefreshGuard)
  @Post('/restore')
  async restoreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }

  @UseGuards(AuthAccessGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @CurrentUser() currentUser: ICurrentUser) {
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const accesstoken = req.headers.authorization.replace('Bearer ', '');

    try {
      jwt.verify(refreshToken, 'myRefreshkey');
      jwt.verify(accesstoken, 'myAccessKey');
    } catch {
      throw new UnauthorizedException('토큰검증 실패');
    }
    await this.authService.logout({ refreshToken, currentUser, accesstoken });

    return '성공';
  }
}

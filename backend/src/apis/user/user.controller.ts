import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthAccessGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { CreateUserInput } from './dto/createuser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthAccessGuard)
  @ApiOkResponse({ type: User })
  async findme(@CurrentUser() currentUser: ICurrentUser) {
    return await this.userService.findme(currentUser);
  }

  @Post()
  @ApiCreatedResponse({ type: User })
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  create(@Body() input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Delete(':id')
  @UseGuards(AuthAccessGuard)
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}

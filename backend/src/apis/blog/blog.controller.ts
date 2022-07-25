import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthAccessGuard } from 'src/common/auth/auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/user.param';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { BlogService } from './blog.service';
import { BlogCreateInput } from './dto/blog.create';
import { BlogUpdateInput } from './dto/blog.update';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  @Post()
  @UseGuards(AuthAccessGuard)
  @ApiCreatedResponse({ type: User })
  create(
    @Body() input: BlogCreateInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.blogService.create({ input, currentUser });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogService.delete({ id });
  }

  @Put(':id')
  @UseGuards(AuthAccessGuard)
  async update(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('id') id: string,
    @Body() input: BlogUpdateInput,
  ) {
    return await this.blogService.update({ input, id, currentUser });
  }

  @Get('search/:page/:search')
  @UseGuards(AuthAccessGuard)
  myblogsearch(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('page') page: number,
    @Param('search') search: string,
  ) {
    return this.blogService.myblogsearch({ currentUser, page, search });
  }

  @Get('myblog/:page')
  @UseGuards(AuthAccessGuard)
  myblog(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('page') page: number,
  ) {
    return this.blogService.myblog({ currentUser, page });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne({ id });
  }

  @Post('/upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadUserFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.blogService.upload({ files });
  }
}

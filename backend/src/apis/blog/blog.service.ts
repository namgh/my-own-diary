import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getRepository, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { BlogCreateInput } from './dto/blog.create';
import { Blog } from './entities/blog.entity';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogrepository: Repository<Blog>,

    @InjectRepository(User)
    private readonly userrepository: Repository<User>,
  ) {}

  async create({ input, currentUser }) {
    const user = await this.userrepository.findOne({ id: currentUser.id });

    return await this.blogrepository.save({
      ...input,
      user,
    });
  }

  async update({ input, id, currentUser }) {
    const blog = await this.blogrepository.findOne({ id });
    return await this.blogrepository.save({
      ...blog,
      ...input,
    });
  }
  async delete({ id }) {
    const result = await this.blogrepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async findOne({ id }) {
    return await this.blogrepository.findOne({ id: id });
  }

  async myblog({ currentUser, page }) {
    return getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('user.id = :id', { id: currentUser.id })
      .skip((page - 1) * 10)
      .take(10)
      .orderBy('blog.createdAt')
      .getMany();
  }

  async myblogsearch({ currentUser, page, search }) {
    return await getRepository(Blog)
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('user.id = :id', { id: currentUser.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('blog.title like :search', {
            search: '%' + search + '%',
          }).orWhere('blog.tag like :search', { search: '%' + search + '%' });
        }),
      )
      .orderBy('blog.createdAt')
      .skip((page - 1) * 10)
      .take(10)
      .getMany();
  }

  async upload({ files }) {
    const storage = new Storage({
      keyFilename: 'plenary-hangout-356306-91f0e00c2c37.json',
      projectId: 'plenary-hangout-356306',
    }).bucket('my-own-diary');
    const waitedfile = await Promise.all(files);

    return await Promise.all(
      waitedfile.map(async (file) => {
        const path = `${Date.now()}-${file.originalname}`;
        const uploadfile = storage.file(`file/${path}`);
        await uploadfile.save(file.buffer, file.mimetype);
        return `my-own-diary/file/${path}`;
      }),
    );
  }
}

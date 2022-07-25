import {
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Storage } from '@google-cloud/storage';
import { format } from 'util';
import axios from 'axios';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly connection: Connection,
  ) {}

  async findall() {
    return await getRepository(User).createQueryBuilder('user').getMany();
  }

  async findone(id) {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getMany();
  }

  async create(input) {
    const check = await this.userRepository.find({ email: input.email });
    console.log(check);
    if (check.length) throw new ConflictException('이미 등록된 이메일입니다');
    const { password, ...user } = input;
    const hash = await bcrypt.hash(password, 2);

    return await this.userRepository.save({ ...user, password: hash });
  }

  async findemail({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async delete(id) {
    const result = await this.userRepository.softDelete({ id });
    return result.affected ? true : false;
  }

  async findme(input) {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: input.id })
      .getOne();
  }
}

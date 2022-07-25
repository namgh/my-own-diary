import { ApiProperty } from '@nestjs/swagger';

export class BlogCreateInput {
  @ApiProperty({
    type: String,
    description: '제목',
    default: '',
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: '제목',
    default: '',
  })
  readonly content: string;

  @ApiProperty({
    type: String,
    description: '태그',
    default: '',
  })
  readonly tag: string;

  @ApiProperty({
    type: String,
    description: 'url',
    default: '',
  })
  readonly url: string;
}

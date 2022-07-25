import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @ApiProperty({
    type: String,
    description: 'email',
    default: '',
  })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'password',
    default: '',
  })
  readonly password: string;
}

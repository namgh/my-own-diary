import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
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

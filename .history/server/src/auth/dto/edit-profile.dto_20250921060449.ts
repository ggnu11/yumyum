import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
  @ApiProperty({
    description: 'User nickname',
    example: 'user@example.com',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;

  @IsString()
  imageUri: string;
}

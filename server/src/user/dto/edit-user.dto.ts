import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({
    description: 'User nickname',
    example: 'fourfourfourfourfour',
    minLength: 1,
    maxLength: 20,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  nickname: string;

  @ApiProperty({
    description: 'User profile pic',
    example: '[any uri not yet example]',
    type: String,
  })
  @IsString()
  imageUri: string;
}

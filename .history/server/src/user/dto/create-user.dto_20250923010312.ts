import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsDate, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsEnum(['email', 'kakao', 'apple'])
  social_provider: 'email' | 'kakao' | 'apple';

  @IsString()
  social_id: string;

  @IsOptional()
  @IsString()
  yumyum_id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'User nickname',
    example: 'fourfourfourfourfour',
    minLength: 1,
    maxLength: 20,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(20)
  nickname?: string;

  @ApiProperty({
    description: 'User profile pic',
    example: '[any uri not yet example]',
    type: String,
  })
  @IsOptional()
  @IsString()
  profile_image_url?: string;

  @IsOptional()
  @IsString()
  real_name?: string;

  @IsOptional()
  @IsNumber()
  phone_number?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;
}

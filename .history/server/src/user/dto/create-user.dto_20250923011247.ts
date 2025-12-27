import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail,
  IsEnum, 
  IsOptional, 
  IsString, 
  IsDate, 
  IsNumber, MaxLength, MinLength, Matches, } from 'class-validator';

export class CreateUserDto {

  @IsEnum(['email', 'kakao', 'apple'])
  social_provider: 'email' | 'kakao' | 'apple';

  @IsString()
  social_id: string;

  @IsOptional()
  @IsString()
  yumyum_id?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: '올바른 이메일 형식이 아닙니다.',
  })
  @MaxLength(50, {
    message: '올바른 이메일 형식이 아닙니다.',
  })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: '올바른 이메일 형식이 아닙니다.',
  })
  @ValidateIf(o => o.email !== null)
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

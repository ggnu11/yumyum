import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsOptional()
  @IsString()
  nickname?: string;

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

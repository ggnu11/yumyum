import { User } from '../user/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

    getUser(user: User) {
        const { password, hashed_refresh_token: hashedRefreshToken, ...rest } = user;
    
        return { ...rest };
      }
    
async editUser(editUserDto: EditUserDto, user: User) {
        const profile = await this.userRepository
          .createQueryBuilder('user')
          .where('user.id = :userId', { userId: user.user_id })
          .getOne();
    
        if (!profile) {
          throw new NotFoundException('존재하지 않는 사용자입니다.');
        }
    
        const { nickname, imageUri } = editUserDto;
        profile.nickname = nickname;
        profile.profile_image_url = imageUri;
    
        try {
          await this.userRepository.save(profile);
          const { password, hashed_refresh_token: hashedRefreshToken, ...rest } = profile;
          return { ...rest };
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException(
            '프로필 수정 도중 에러가 발생했습니다.',
          );
        }
      }

async withdrawUser(userId: number ) {
    console.log('Service: received userId to delete:', userId);
  const existingUser = await this.userRepository.findOneBy({ user_id: userId });
    console.log('Service: existingUser found:', userId);
  if (!existingUser) {
    throw new NotFoundException('존재하지 않는 사용자입니다.');
  }

  try {
    const result = await this.userRepository.delete(userId);
    console.log('Service: delete result:', result);
    return { message: '회원탈퇴가 완료되었습니다.' };
  } catch (error) {
    console.log(error);
    throw new InternalServerErrorException('회원탈퇴 처리 중 에러가 발생했습니다.');
  }
}
}

import { Injectable } from '@nestjs/common';
import { User } from 'user.entity';

@Injectable()
export class UserService {

    getProfile(user: User) {
        const { password, hashedRefreshToken, ...rest } = user;
    
        return { ...rest };
      }
    
      async editProfile(editProfileDto: EditProfileDto, user: User) {
        const profile = await this.userRepository
          .createQueryBuilder('user')
          .where('user.id = :userId', { userId: user.user_id })
          .getOne();
    
        if (!profile) {
          throw new NotFoundException('존재하지 않는 사용자입니다.');
        }
    
        const { nickname, imageUri } = editProfileDto;
        profile.nickname = nickname;
        profile.profile_image_url = imageUri;
    
        try {
          await this.userRepository.save(profile);
          const { password, hashedRefreshToken, ...rest } = profile;
          return { ...rest };
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException(
            '프로필 수정 도중 에러가 발생했습니다.',
          );
        }
      }
}

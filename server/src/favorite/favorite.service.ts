import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { sleep } from 'src/@common/sleep';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async getFavoritePosts(page: number, user: User) {
    const perPage = 10;
    const offset = (page - 1) * perPage;
    const favorites = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .innerJoinAndSelect('favorite.post', 'post')
      .leftJoinAndSelect('post.images', 'image')
      .where('favorite.user_id = :user_id', { user_id: user.user_id })
      .orderBy('post.date', 'DESC')
      .skip(offset)
      .take(perPage)
      .getMany();
    const newPosts = favorites.map(fav => {
      const post = fav.post;
      const images = post.images?.map(img => ({ uri: img.uri })) || [];
      return { ...post, imageUris: images };
  });
    /*
    const newPosts = favorites.map((favorite) => { 
    const post = favorite.post; 
    const images = [...post.images].sort((a, b) => (a.id - b.id)); 
    return { ...post, imageUris: images }; });
    */
   
    // await sleep(3000);
    return newPosts;
  }

  async toggleFavorite(post_id: number, user: User) {
    if (!post_id) {
      throw new BadRequestException('존재하지 않는 피드입니다.');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { 
       post: { id: post_id },
       user: { user_id: user.user_id },
       },
       relations: ['post', 'user'],
    }); 

    if (existingFavorite) {
      await this.favoriteRepository.delete(existingFavorite.id);

      return existingFavorite.post_id;
    }

    const favorite = this.favoriteRepository.create({
      post: { id: post_id },
      user: { user_id: user.user_id },
    });

    await this.favoriteRepository.save(favorite);

    return favorite.post_id;
  }
}

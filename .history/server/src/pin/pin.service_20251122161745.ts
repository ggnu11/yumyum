import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreatePinDto } from './dto/create-pin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from './pin.entity'; 
import {Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Image } from 'src/image/image.entity';


@Injectable()
export class PinService {

        constructor(
            @InjectRepository(Pin)
            private pinRepository: Repository<Pin>,
            @InjectRepository(Image)
            private imageRepository: Repository<Image>,
        ) {}
    
        async getAllMarkers(user: User) {
            try {
                const markers = await this.pinRepository
                    .createQueryBuilder('pin')
                    .where('pin.user_id = :user_id', { user_id: user.user_id })
                    .select([
                        'pin.id',
                        'pin.latitude',
                        'pin.longitude',
                        'pin.color',
                        'pin.score'
                    ])
                    .getMany();
    
                return markers;

            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                    '마커를 가져오는 도중 에러가 발생했습니다.',
                );
            }
        }
    
        private getPinsWithOrderImages(pins: Pin[]) {
            return pins.map((pin) => {
                const { images, ...rest } = pin;
                const newImages = [...images].sort((a, b) => a.id - b.id);
                return { ...rest, imageUris: newImages };
            });
        }
    
        private async getPinsBaseQuery(
            user_id: number,
        ): Promise<SelectQueryBuilder<Pin>> {
            return this.pinRepository
                .createQueryBuilder('pin')
                .leftJoinAndSelect('pin.images', 'image')
                .where('pin.user_id = :user_id', { user_id })
                .orderBy('pin.date', 'DESC');
        }
    
        async getMyPins(page: number, user: User) {
            const perPage = 10;
            const offset = (page - 1) * perPage;
            const queryBuilder = await this.getPinsBaseQuery(user.user_id);
            const pins = await queryBuilder.take(perPage).skip(offset).getMany();
    
            // await sleep(3000);
            return this.getPinsWithOrderImages(pins);
        }
    
        async getPinById(id: number, user: User) {
            try {
                const foundPin = await this.pinRepository
                    .createQueryBuilder('pin')
                    .leftJoinAndSelect('pin.images', 'image')
                    .leftJoinAndSelect(
                        'pin.wishlists',
                        'wishlist',
                        'wishlist.user_id = :user_id',
                        { user_id: user.user_id },
                    )
                    .where('pin.user_id = :user_id', { user_id: user.user_id })
                    .andWhere('pin.id = :id', { id })
                    .getOne();
    
                if (!foundPin) {
                    throw new NotFoundException('존재하지 않는 피드입니다.');
                }
    
                const { wishlists, images, ...rest } = foundPin;
                const pinWithIsWishlists = {
                    ...rest,
                    isWishlist: wishlists.length > 0,
                    imageUris: images,
                };
    
                return pinWithIsWishlists;
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                    '장소를 가져오는 도중 에러가 발생했습니다.',
                );
            }
        }
    
        async createPost(createPinDto: CreatePinDto, user: User) {
            try {
                const {
                    latitude,
                    longitude,
                    color,
                    memo,
                    visit_date,
                    imageUris,
                } = createPinDto;
                const pin = this.pinRepository.create({
                    latitude,
                    longitude,
                    color,
                    memo,
                    visit_date,
                    description,
                    date,
                    score,
                    user,
                });
                const images = imageUris.map((uri) =>
                    this.imageRepository.create(uri),
                );
                pin.images = images;
    
                await this.imageRepository.save(images);
                await this.pinRepository.save(pin);
    
                const { user: _, ...pinWithoutUser } = pin;
                return pinWithoutUser;
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                    '장소를 추가하는 도중 에러가 발생했습니다.',
                );
            }
        }
    
        async deletePost(id: number, user: User) {
            try {
                const result = await this.postRepository
                    .createQueryBuilder('post')
                    .delete()
                    .from(Post)
                    .where('post.user_id = :user_id', { user_id: user.user_id })
                    .andWhere('id = :id', { id })
                    .execute();
    
                if (result.affected === 0) {
                    throw new NotFoundException('존재하지 않는 피드입니다.');
                }
    
                return id;
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                    '장소를 삭제하는 도중 에러가 발생했습니다.',
                );
            }
        }
    
        async updatePost(
            id: number,
            updatePostDto: Omit<
                CreatePostDto,
                'latitude' | 'longitude' | 'address'
            >,
            user: User,
        ) {
            const pinEntity = await this.pinRepository.findOne({
                where: { id, user: { user_id: user.user_id } },
                relations: ['images'],
            });
    
            if (!pinEntity) {
                throw new NotFoundException('존재하지 않는 피드입니다.');
            }
    
            const { title, description, color, date, score, imageUris } =
                updatePinDto;
    
            if (pinEntity.images?.length) {
                const imageIds = pinEntity.images.map((img) => img.id);
                await this.imageRepository.delete(imageIds);
            }
    
            const newImages = imageUris.map((uri) =>
                this.imageRepository.create(uri),
            );
            await this.imageRepository.save(newImages);
    
            pinEntity.title = title;
            pinEntity.description = description;
            pinEntity.color = color;
            pinEntity.date = date;
            pinEntity.score = score;
            pinEntity.images = newImages;
    
            try {
                await this.postRepository.save(postEntity);
                const { images, ...rest } = postEntity;
                return { ...rest, imageUris: newImages };
            } catch (error) {
                console.log(error);
                throw new InternalServerErrorException(
                    '장소를 수정하는 도중 에러가 발생했습니다.',
                );
            }
        }
    
        async getPostsByMonth(year: number, month: number, user: User) {
            const posts = await this.pinRepository
                .createQueryBuilder('post')
                .where('post.user_id = :user_id', { user_id: user.user_id })
                .andWhere('extract(year from post.date) = :year', { year })
                .andWhere('extract(month from post.date) = :month', { month })
                .select([
                    'post.id AS id',
                    'post.title AS title',
                    'post.address AS address',
                    'EXTRACT(DAY FROM post.date) AS date',
                ])
                .getRawMany();
    
            const groupPostsByDate = posts.reduce((acc, post) => {
                const { id, title, address, date } = post;
    
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push({ id, title, address });
    
                return acc;
            }, {});
    
            return groupPostsByDate;
        }
}

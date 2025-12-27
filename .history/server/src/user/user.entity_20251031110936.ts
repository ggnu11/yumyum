import { Favorite } from 'src/favorite/favorite.entity';
import { Post } from 'src/post/post.entity';
import { Pin } from 'src/pin/pin.entity';
import { WishList } from 'src/wish-list/wish-list.entity';
import { VisitReview } from 'src/visit-review/visit-review.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Friendship } from 'src/friendship/friendship.entity';

@Entity()
@Unique(['email'])
@Check(`"social_provider" = 'email' OR "social_id" IS NOT NULL`)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  social_provider: 'email' | 'kakao' | 'apple' | 'naver';

  @Column({ nullable: true })
  social_id: string;

  @Column({ nullable: true })
  yumyum_id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  nickname?: string | null;

  @Column({ nullable: true })
  profile_image_url?: string;

  @Column({ unique: true })
  invite_code: string;

  @Column({ nullable: true })
  real_name?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  birthday?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @Column({ nullable: true })
  hashed_refresh_token?: string;

  @Column({ nullable: true })
  social_access_token?: string;

  @Column({ nullable: true })
  social_refresh_token?: string;

  @OneToMany(() => Post, (post) => post.user, { eager: false })
  post: Post[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { eager: false })
  favorites: Favorite[];

  @OneToMany(() => Group, (group) => group.user, { eager: false})
  group: Group[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user, { eager: false})
  groupMember: GroupMember[];

  @OneToMany(() => Pin, (pin) => pin.user, { eager: false })
  pin: Pin[];

  @OneToMany(() => WishList, (wishList) => wishList.user, { eager: false })
  wishList: WishList[];

  @OneToMany(() => Friendship, (friendship) => friendship.user, { eager: false})
  friendship: Friendship[];

}

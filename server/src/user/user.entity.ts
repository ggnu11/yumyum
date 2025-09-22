import { Favorite } from 'src/favorite/favorite.entity';
import { Post } from 'src/post/post.entity';
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
  phone_number?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  birthday?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ nullable: true })
  hashed_refresh_token?: string;

  @OneToMany(() => Post, (post) => post.user, { eager: false })
  post: Post[];

  @OneToMany(() => Favorite, (favorite) => favorite.user, { eager: false })
  favorites: Favorite[];
}

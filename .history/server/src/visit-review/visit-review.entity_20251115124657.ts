import { WishList } from 'src/wish-list/wish-list.entity';
import { User } from 'src/user/user.entity';
import { Place } from 'src/place/place.entity';
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
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class VisitReview extends BaseEntity {
    @PrimaryGeneratedColumn()
    yumyum_place_id: number;

    @Column({ nullable: true })
    place_id: number;

    @Column({ nullable: true })
    place_name: string;

    @Column({ nullable: true })
    address_name: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    place_url: string;

    @Column('double precision')
    latitude: number;

    @Column('double precision')
    longitude: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ default: 'kakao_api' })
    created_by: string;

    @Column({ nullable: true, type: 'json' })
    extraData?: Record<string, any>;

    @OneToMany(() => WishList, (wishList) => wishList.user, { eager: false })
    wishList: WishList[];

    @ManyToOne(() => User, (user) => user.visitReview, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Place, (place) => place.visitReviews)
    place: Place;
}

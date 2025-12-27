import { WishList } from 'src/wish-list/wish-list.entity';
import { User } from 'src/user/user.entity';
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
} from 'typeorm';

@Entity()
export class Friendship extends BaseEntity {
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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => WishList, (wishList) => wishList.user, { eager: false })
    wishList: WishList[];

    @ManyToOne(() => User, (user) => user.friendRequestsSent, { eager: false })
    requester: User;

    @ManyToOne(() => User, (user) => user.friendRequestsReceived, {
        eager: false,
    })
    addressee: User;
}

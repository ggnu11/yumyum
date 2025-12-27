import { User } from 'src/user/user.entity';
import { Place } from 'src/place/place.entity';
import { Pin } from 'src/pin/pin.entity';
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
    Index
} from 'typeorm';

@Entity()
export class WishList extends BaseEntity {
    @PrimaryGeneratedColumn()
    wish_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    memo?: string;

    @Index('idx_wish_list_user')
    @ManyToOne(() => User, (user) => user.wishLists, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Index('idx_wish_list_place')
    @ManyToOne(() => Place, (place) => place.wishList, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'place_id' })
    place: Place;

    @ManyToOne(() => Pin, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pin_id' })
    pin: Pin;
}

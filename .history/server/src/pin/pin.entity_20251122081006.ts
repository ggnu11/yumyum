import { User } from 'src/user/user.entity';
import { Place } from 'src/place/place.entity';
import { PinAudience } from 'src/pin-audience/pin-audience.entity';
import { Image } from 'src/image/image.entity';
import { WishList } from 'src/wish-list/wish-list.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';

@Entity()
export class Pin extends BaseEntity {
    @PrimaryGeneratedColumn()
    pin_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    visit_date: Date;

    @Column({ nullable: true, type: 'text' })
    memo?: string;

    @Column('text', { array: true, nullable: true })
    photos?: string[];

    @Column({ nullable: true })
    color: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index('idx_pin_user')
    @ManyToOne(() => User, (user) => user.pins, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Index('idx_pin_place')
    @ManyToOne(() => Place, (place) => place.pins)
    @JoinColumn({ name: 'place_id' })
    place: Place;

    @OneToMany(() => PinAudience, (pinaudience) => pinaudience.pin)
    audience: PinAudience[];

    @OneToMany(() => Image, (image) => image.pin)
        images: Image[];

    @OneToMany(() => WishList, (wishlist) => wishlist.pin)
        wishlist: Favorite[];
}

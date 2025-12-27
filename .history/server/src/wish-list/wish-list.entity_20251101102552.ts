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
export class WishList extends BaseEntity {
    @PrimaryGeneratedColumn()
    wish_id: number;

    @ManyToOne(() => User, (user) => user.wishList, {
        eager: false,
        onDelete: 'CASCADE',
        })
        @JoinColumn({ name: 'user_id' })
        user: User;

    @ManyToOne(() => Place, (place) => place.wishList, {
        eager: false,
        onDelete: 'CASCADE',
        })
        @JoinColumn({ name: 'place_id' })
        place: Place;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    memo?: string;
}

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

export enum Visibility {
    PRIVATE = 'private',
    FRIEND = 'friend',
    GROUP = 'group',
}

@Entity()
export class Pin extends BaseEntity {
    @PrimaryGeneratedColumn()
    pin_id: number;

    @Column()
    place_id: string;

    @Column()
    visit_date: Date;

    @Column({ nullable: true, type: 'text' })
    memo?: string;

    @Column('text', { array: true, nullable: true })
    photos?: string[];

    @Column({
        type: 'enum',
        enum: Visibility,
        default: Visibility.PRIVATE,
    })
    visibility: Visibility;

    @Column({ nullable: true })
    group_id?: number;

    @Column({ nullable: true })
    color: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.pins, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Place, (place) => place.pins)
    @JoinColumn({ name: 'place_id' })
    place: Place;
}

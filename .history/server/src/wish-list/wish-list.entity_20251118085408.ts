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
export class WishList extends BaseEntity {
    @PrimaryGeneratedColumn()
    wish_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    memo?: string;
}

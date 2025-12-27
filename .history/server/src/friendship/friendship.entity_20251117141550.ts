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
    JoinColumn
} from 'typeorm';

@Entity()
@Unique(['requester', 'addressee'])
@Check(`"requesterId" <> "addresseeId"`)
export class Friendship extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'accepted' | 'blocked';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.friendRequestsSent, { eager: false })
    @JoinColumn({ name: 'user_id' })
    requester: User;

    @ManyToOne(() => User, (user) => user.friendRequestsReceived, {
        eager: false,
    })
    addressee: User;
}

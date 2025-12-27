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
    JoinColumn,
    Index,
} from 'typeorm';

@Entity()
@Unique(['requester', 'addressee'])
@Check(`"requester_id" <> "addressee_id"`)

@Index('idx_friendship_addressee', ['addressee'])
export class Friendship extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'accepted' | 'blocked';

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index('idx_friendship_requester', ['requester'])
    @ManyToOne(() => User, (user) => user.friendRequestsSent, { eager: false })
    @JoinColumn({ name: 'requester_id' })
    requester: User;

    @ManyToOne(() => User, (user) => user.friendRequestsReceived, {
        eager: false,
    })
    @JoinColumn({ name: 'addressee_id' })
    addressee: User;
}

import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index
} from 'typeorm';

@Entity()
export class GroupMember extends BaseEntity {
    @PrimaryGeneratedColumn()
    group_member_id: number;

    @Column({ default: 'member' })
    role: 'member' | 'admin';

    @Column({ default: 'pending' })
    status: 'pending' | 'accepted' | 'blocked';

    @CreateDateColumn()
    joined_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index('idx_group_member_user')
    @ManyToOne(() => User, (user) => user.groupMember, { eager: false })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Index('idx_group_member_group')
    @ManyToOne(() => Group, (group) => group.members)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}

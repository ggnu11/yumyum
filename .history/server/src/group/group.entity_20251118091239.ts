import { WishList } from 'src/wish-list/wish-list.entity';
import { User } from 'src/user/user.entity';
import { GroupMember } from 'src/group-member/group-member.entity';
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
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    group_id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Index('idx_group_owner')
    @ManyToOne(() => User, (user) => user.ownedGroups, { eager: false })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

    @OneToMany(() => GroupMember, (groupmember) => groupmember.group)
    members: GroupMember[];

    @OneToMany(() => PinAudience, (pinaudience) => pinaudience.group)
    audience: GroupMember[];

}

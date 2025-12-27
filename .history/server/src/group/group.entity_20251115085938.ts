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
} from 'typeorm';

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column('double precision')
    latitude: number;

    @Column('double precision')
    longitude: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.ownedGroups, { eager: false })
    @JoinColumn({ name: 'owner_id' })
    owner: User;

@OneToMany(() => GroupMember, (gm) => gm.group)
members: GroupMember[];

}

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
    Index,
} from 'typeorm';

@Entity()
export class PinAudience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pin, pin => pin.audience, { onDelete: 'CASCADE' })
  pin: Pin;

  @ManyToOne(() => Group, group => group.pinAudience, { nullable: true })
  group: Group;

  @Column({ type: 'enum', enum: ['FRIENDS', 'GROUP', 'PUBLIC'] })
  audience_type: string;
}
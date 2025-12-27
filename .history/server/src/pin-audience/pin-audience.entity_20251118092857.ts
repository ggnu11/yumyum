import { Pin } from 'src/pin/pin.entity';
import { Group } from 'src/group/group.entity'; 
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
  @JoinColumn({ name: 'pin_id' })
  pin: Pin;

  @ManyToOne(() => Group, group => group.audience, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ type: 'enum', enum: ['FRIENDS', 'GROUP', 'PUBLIC'] })
  audience_type: string;
}
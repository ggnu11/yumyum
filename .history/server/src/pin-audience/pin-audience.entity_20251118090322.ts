import { Pin } from 'src/pin/pin.entity';
import { gr } from 
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
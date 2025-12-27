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
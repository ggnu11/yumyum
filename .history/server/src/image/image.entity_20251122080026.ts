import { Pin } from 'src/pin/pin.entity'; 
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Image extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uri: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date | null;

    @ManyToOne(() => Pin, (pin) => pin.images, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'place_id' })
    pin: Pin;
}

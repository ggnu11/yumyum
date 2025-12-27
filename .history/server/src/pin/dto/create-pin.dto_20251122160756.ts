import {
    IsArray,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString
} from 'class-validator';

export class CreatePinDto {
    @IsNotEmpty()
    latitude: number;

    @IsNotEmpty()
    longitude: number;

    @IsString()
    color: string;

    @IsString()
    address: string;

    @IsNotEmpty()
    title: string;

    @IsString()
    memo: string;

    @IsDateString()
    visit_date: Date;

    @IsArray()
    imageUris: { uri: string }[];
    
    
        @Column('text', { array: true, nullable: true })
        photos?: string[];
    
        @Column({ nullable: true })
        color: string;
    
        @CreateDateColumn()
        created_at: Date;
    
        @UpdateDateColumn()
        updated_at: Date;
    
        @Index('idx_pin_user')
        @ManyToOne(() => User, (user) => user.pins, {
            eager: false,
            onDelete: 'CASCADE',
        })
        @JoinColumn({ name: 'user_id' })
        user: User;
    
        @Index('idx_pin_place')
        @ManyToOne(() => Place, (place) => place.pins)
        @JoinColumn({ name: 'place_id' })
        place: Place;
    
        @OneToMany(() => PinAudience, (pinaudience) => pinaudience.pin)
        audience: PinAudience[];
    
        @OneToMany(() => Image, (image) => image.pin)
            images: Image[];
    
        @OneToMany(() => WishList, (wishlist) => wishlist.pin)
            wishlists: WishList[];
}

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
    
    
    
        @OneToMany(() => PinAudience, (pinaudience) => pinaudience.pin)
        audience: PinAudience[];
    
        @OneToMany(() => Image, (image) => image.pin)
            images: Image[];
    
        @OneToMany(() => WishList, (wishlist) => wishlist.pin)
            wishlists: WishList[];
}

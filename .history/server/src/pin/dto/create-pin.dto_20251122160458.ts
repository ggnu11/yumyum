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
    description: string;

    @IsDateString()
    date: Date;

    @IsArray()
    imageUris: { uri: string }[];
}

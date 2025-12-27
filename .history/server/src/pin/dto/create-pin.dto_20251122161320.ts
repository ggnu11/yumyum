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
}

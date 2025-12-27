import { basename, extname } from 'path';

export function getUniqueFileName(file: Express.Multer.File, id: number) {
    const ext = extname(file.originalname);
    const fileName = basename(file.originalname, ext) + id + ext;

    return fileName;
}

export function parseDurationToSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return Number(duration);

    const value = Number(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 3600;
        case 'd':
            return value * 86400;
        default:
            return value;
    }
}

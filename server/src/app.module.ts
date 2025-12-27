import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FavoriteModule } from './favorite/favorite.module';
import { LoggerMiddleware } from './@common/logger';
import { UserModule } from './user/user.module';
import { PlaceModule } from './place/place.module';
import { PinController } from './pin/pin.controller';
import { PinService } from './pin/pin.service';
import { PinModule } from './pin/pin.module';
import { WishListController } from './wish-list/wish-list.controller';
import { WishListService } from './wish-list/wish-list.service';
import { WishListModule } from './wish-list/wish-list.module';
import { GroupModule } from './group/group.module';
import { GroupMemberModule } from './group-member/group-member.module';
import { VisitReviewService } from './visit-review/visit-review.service';
import { VisitReviewController } from './visit-review/visit-review.controller';
import { VisitReviewModule } from './visit-review/visit-review.module';
import { FriendshipModule } from './friendship/friendship.module';
import { PinAudienceModule } from './pin-audience/pin-audience.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: true,
            ssl: false, //{ rejectUnauthorized: false },
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
        PostModule,
        AuthModule,
        ImageModule,
        FavoriteModule,
        UserModule,
        PlaceModule,
        PinModule,
        WishListModule,
        GroupModule,
        GroupMemberModule,
        VisitReviewModule,
        FriendshipModule,
        PinAudienceModule,
    ],
    providers: [ConfigService, PinService, WishListService, VisitReviewService],
    controllers: [PinController, WishListController, VisitReviewController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}

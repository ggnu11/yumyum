import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    ValidationPipe,
    UnauthorizedException,
    Headers
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiBody({ type: AuthDto })
    signup(@Body(ValidationPipe) authDto: AuthDto) {
        return this.authService.signup(authDto);
    }

    @Post('/signin')
    @ApiOperation({ summary: 'Sign in user' })
    @ApiResponse({ status: 200, description: 'User signed in successfully.' })
    @ApiBody({ type: AuthDto })
    signin(@Body(ValidationPipe) authDto: AuthDto) {
        return this.authService.signin(authDto);
    }

    @Get('/refresh')
    @ApiOperation({ summary: 'Refresh JWT token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
    async refresh(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No refresh token provided');
        }

        const providedRefreshToken = authHeader.split(' ')[1];
        return this.authService.refreshToken(providedRefreshToken);
    }

    @Post('/logout')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Log out user' })
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    logout(@GetUser() user: User) {
        return this.authService.deleteRefreshToken(user);
    }

    @Post('/oauth/kakao')
    @ApiOperation({ summary: 'OAuth login with Kakao' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'Authorization code from Kakao',
                },
            },
        },
    })
    async kakaoLogin(@Body() body: { code: string }) {
        return this.authService.kakaoLogin(body.code);
    }

    @Post('/oauth/naver')
    @ApiOperation({ summary: 'OAuth login with naver' })
    @ApiBody({
        schema: { type: 'object', properties: { token: { type: 'string' } } },
    })
    naverLogin(@Body() naverToken: { token: string }) {
        return this.authService.naverLogin(naverToken);
    }

    @Post('/oauth/apple')
    @ApiOperation({ summary: 'OAuth login with Apple' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                identityToken: { type: 'string' },
                appId: { type: 'string' },
                nickname: { type: 'string', nullable: true },
            },
        },
    })
    appleLogin(
        @Body()
        appleIdentity: {
            identityToken: string;
            appId: string;
            nickname: string | null;
        },
    ) {
        return this.authService.appleLogin(appleIdentity);
    }
}

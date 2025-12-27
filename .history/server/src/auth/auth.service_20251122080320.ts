import axios from 'axios';
import appleSignin from 'apple-signin-auth';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import { parseDurationToSeconds } from 'src/@common/utils/index';

//temporal
function generateRandomInviteCode(length = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signup(authDto: AuthDto) {
        const { email, password } = authDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            social_provider: 'email',
            invite_code: generateRandomInviteCode(),
        });

        try {
            await this.userRepository.save(user);
        } catch (error) {
            console.log(error);
            if (error.code === '23505') {
                throw new ConflictException('이미 존재하는 이메일입니다.');
            }

            throw new InternalServerErrorException(
                '회원가입 도중 에러가 발생했습니다.',
            );
        }
    }

    private async getTokens(payload: { userId: number }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get(
                    'JWT_ACCESS_TOKEN_EXPIRATION',
                ),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get(
                    'JWT_REFRESH_TOKEN_EXPIRATION',
                ),
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async signin(authDto: AuthDto) {
        const { email, password } = authDto;
        const user = await this.userRepository.findOneBy({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException(
                '이메일 또는 비밀번호가 일치하지 않습니다.',
            );
        }

        // Check if user already has a valid refresh token
        let refreshToken: string;
        if (!user.hashed_refresh_token) {
            // First login, issue refresh token
            const tokens = await this.getTokens({ userId: user.user_id });
            refreshToken = tokens.refreshToken;
            await this.updateHashedRefreshToken(user.user_id, refreshToken);
        }

        // Always issue new access token
        const accessToken = await this.jwtService.signAsync(
            { userId: user.user_id },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get(
                    'JWT_ACCESS_TOKEN_EXPIRATION',
                ),
            },
        );

        return { accessToken, refreshToken };
    }

    private async updateHashedRefreshToken(id: number, refreshToken: string) {
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

        try {
            await this.userRepository.update(id, {
                hashed_refresh_token: hashedRefreshToken,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async refreshToken(providedRefreshToken: string) {
        // Include exp and iat to read token expiry
        let payload: { userId: number; exp: number; iat: number };

        // Verify the refresh token and extract payload
        try {
            payload = this.jwtService.verify<{
                userId: number;
                exp: number;
                iat: number;
            }>(providedRefreshToken, {
                secret: this.configService.get('JWT_SECRET'),
            });
        } catch (e) {
            throw new ForbiddenException('Invalid refresh token');
        }

        const user = await this.userRepository.findOneBy({
            user_id: payload.userId,
        });
        if (!user || !user.hashed_refresh_token) {
            throw new ForbiddenException('Refresh token not valid');
        }

        const isValid = await bcrypt.compare(
            providedRefreshToken,
            user.hashed_refresh_token,
        );
        if (!isValid) throw new ForbiddenException('Refresh token mismatch');

        // Always issue new access token
        const accessToken = await this.jwtService.signAsync(
            { userId: user.user_id },
            {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get(
                    'JWT_ACCESS_TOKEN_EXPIRATION',
                ),
            },
        );

        // Optional: Rotate refresh token if it’s about to expire
        const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
        const expiresInSeconds = payload.exp - now;

        const refreshExpSeconds = parseDurationToSeconds(
            this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION'),
        );

        let refreshToken: string | undefined = undefined;

        if (expiresInSeconds < refreshExpSeconds / 2) {
            const tokens = await this.getTokens({ userId: user.user_id });
            refreshToken = tokens.refreshToken;
            await this.updateHashedRefreshToken(user.user_id, refreshToken);
        }

        return { accessToken, refreshToken };
    }

    async deleteRefreshToken(user: User) {
        try {
            await this.userRepository.update(user.user_id, {
                hashed_refresh_token: null,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async kakaoLogin(authCode: string) {
        try {
            // Step 1: Exchange auth code for tokens
            const tokenResponse = await axios.post(
                'https://kauth.kakao.com/oauth/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.KAKAO_CLIENT_ID,
                    redirect_uri: process.env.KAKAO_REDIRECT_URI,
                    code: authCode,
                    client_secret: process.env.KAKAO_CLIENT_SECRET,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const {
                access_token: kakaoAccessToken,
                refresh_token: kakaoRefreshToken,
            } = tokenResponse.data;

            // Step 2: Fetch user profile
            const userResponse = await axios.get(
                'https://kapi.kakao.com/v2/user/me',
                {
                    headers: {
                        Authorization: `Bearer ${kakaoAccessToken}`,
                        'Content-type':
                            'application/x-www-form-urlencoded;charset=utf-8',
                    },
                },
            );

            const { id: kakaoId, kakao_account } = userResponse.data;
            const nickname = kakao_account?.profile.nickname;
            const email = kakao_account?.email ?? '';

            // Step 3: Upsert user
            let user = await this.userRepository.findOne({
                where: {
                    social_id: kakaoId.toString(),
                    social_provider: 'kakao',
                },
            });

            if (!user) {
                user = this.userRepository.create({
                    social_provider: 'kakao',
                    social_id: kakaoId.toString(),
                    email,
                    nickname,
                    invite_code: generateRandomInviteCode(),
                });
            }

            user.social_access_token = kakaoAccessToken;
            user.social_refresh_token = kakaoRefreshToken;

            await this.userRepository.save(user);

            // Step 4: Generate internal JWT tokens
            const { accessToken, refreshToken } = await this.getTokens({
                userId: user.user_id,
            });
            await this.updateHashedRefreshToken(user.user_id, refreshToken);

            return { accessToken, refreshToken };
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                'Kakao 로그인 중 오류가 발생했습니다.',
            );
        }
    }

    async appleLogin(appleIdentity: {
        identityToken: string;
        appId: string;
        nickname: string | null;
    }) {
        const { identityToken, appId, nickname } = appleIdentity;

        try {
            // Verify Apple identity token
            const { sub: appleId, email } = await appleSignin.verifyIdToken(
                identityToken,
                {
                    audience: appId,
                    ignoreExpiration: true,
                },
            );

            // Check if user exists
            let existingUser = await this.userRepository.findOne({
                where: { social_id: appleId, social_provider: 'apple' },
            });

            if (existingUser) {
                const tokens = await this.getTokens({
                    userId: existingUser.user_id,
                });
                await this.updateHashedRefreshToken(
                    existingUser.user_id,
                    tokens.refreshToken,
                );
                return tokens;
            }

            // If new user, create one
            const newUser = this.userRepository.create({
                social_provider: 'apple',
                social_id: appleId, // use Apple's unique sub, not appId
                email: email ?? null, // Apple only sends email first time if user consents
                nickname: nickname ?? '이름없음',
                profile_image_url: null, // Apple doesn't provide profile picture
                invite_code: generateRandomInviteCode(),
            });

            await this.userRepository.save(newUser);

            const tokens = await this.getTokens({ userId: newUser.user_id });
            await this.updateHashedRefreshToken(
                newUser.user_id,
                tokens.refreshToken,
            );

            return tokens;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Apple SSO login failed.');
        }
    }

    async naverLogin(naverToken: { token: string }) {
        const url = 'https://openapi.naver.com/v1/nid/me';
        const headers = { Authorization: `Bearer ${naverToken.token}` };

        try {
            const { data } = await axios.get(url, { headers });
            const userData = data.response;
            const { id: naverId, email, nickname, profile_image } = userData;

            // Check if user exists
            let existingUser = await this.userRepository.findOne({
                where: { social_id: naverId, social_provider: 'naver' },
            });

            if (existingUser) {
                const tokens = await this.getTokens({
                    userId: existingUser.user_id,
                });
                await this.updateHashedRefreshToken(
                    existingUser.user_id,
                    tokens.refreshToken,
                );
                return tokens;
            }

            // If new user, create
            const newUser = this.userRepository.create({
                social_provider: 'naver',
                social_id: naverId,
                email: email ?? null,
                nickname,
                profile_image_url: profile_image,
                invite_code: generateRandomInviteCode(),
            });

            await this.userRepository.save(newUser);

            const tokens = await this.getTokens({ userId: newUser.user_id });
            await this.updateHashedRefreshToken(
                newUser.user_id,
                tokens.refreshToken,
            );

            return tokens;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Naver SSO login failed.');
        }
    }
}

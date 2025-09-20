import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from './user.entity';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { EditProfileDto } from './dto/edit-profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiBody({ type: AuthDto })
  @Post('/signup')
  signup(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully.' })
  @ApiBody({ type: AuthDto })
  @Post('/signin')
  signin(@Body(ValidationPipe) authDto: AuthDto) {
    return this.authService.signin(authDto);
  }

  @Get('/refresh')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  refresh(@GetUser() user: User) {
    return this.authService.refreshToken(user);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user profile.' })
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }

  @Patch('/me')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Edit user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  editProfile(@Body() editProfileDto: EditProfileDto, @GetUser() user: User) {
    return this.authService.editProfile(editProfileDto, user);
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
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string' } } } })
  kakaoLogin(@Body() kakaoToken: { token: string }) {
    return this.authService.kakaoLogin(kakaoToken);
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

  @Delete('/withdraw')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Withdraw user account' })
  @ApiResponse({ status: 200, description: 'User withdrawn successfully.' })
  withdrawUser(@GetUser() user: User) {
    return this.authService.withdrawUser(user);
  }
}

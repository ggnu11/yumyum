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
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { EditProfileDto } from '../user/dto/edit-profile.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
    constructor(
    private authService: AuthService
  ) {}

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

      @Delete('/withdraw')
      @UseGuards(AuthGuard())
      @ApiOperation({ summary: 'Withdraw user account' })
      @ApiResponse({ status: 200, description: 'User withdrawn successfully.' })
      withdrawUser(@GetUser() user: User) {
        return this.authService.withdrawUser(user);
      }
}

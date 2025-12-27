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
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from '../user/user.service';

@Controller('user')
export class UserController {
    constructor(
    private userService: UserService
  ) {}

    @Get('/me')
    @UseGuards(AuthGuard())
@ApiOperation({ summary: 'Get current user profile' })
@ApiResponse({ status: 200, description: 'Returns current user profile.' })
async getProfile(@GetUser() user: User) {
  const profile = await this.userRepository.findOne({
    where: { user_id: user.user_id },
  });

  if (!profile) {
    throw new NotFoundException('User not found');
  }

  const { password, hashed_refresh_token, ...rest } = profile;
  return rest;
}
    
    @Patch('/me')
      @UseGuards(AuthGuard())
      @ApiOperation({ summary: 'Edit user profile' })
      @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
      editProfile(@Body() editUserDto: EditUserDto, @GetUser() user: User) {
        return this.userService.editUser(editUserDto, user);
      }

    @Delete('/withdraw')
      @UseGuards(AuthGuard())
      @ApiOperation({ summary: 'Withdraw user account' })
      @ApiResponse({ status: 200, description: 'User withdrawn successfully.' })
      withdrawUser(@GetUser() user : User) {
        console.log('Deleting user with ID:', user.user_id);
      return this.userService.withdrawUser( user.user_id );
    }
}

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
      getProfile(@GetUser() user: User) {
        return this.userService.getUser(user);
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
      withdrawUser(@GetUser() userPayload: { userId: number }) {
        console.log('Deleting user with ID:', userPayload.userId);
      return this.userService.withdrawUser(userPayload);
    }
}

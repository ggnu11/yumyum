import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from '../user/user.entity';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from '../user/user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/me')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Returns current user profile.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@GetUser() user: User) {
        return this.userService.getUser(user);
    }

    @Patch('/me')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Edit user profile' })
    @ApiBody({ type: EditUserDto })
    @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    editProfile(
        @Body(ValidationPipe) editUserDto: EditUserDto,
        @GetUser() user: User,
    ) {
        return this.userService.editUser(editUserDto, user);
    }

    @Delete('/withdraw')
    @UseGuards(AuthGuard())
    @ApiOperation({ summary: 'Withdraw user account' })
    @ApiResponse({ status: 200, description: 'User withdrawn successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    withdrawUser(@GetUser() user: User) {
        console.log('Deleting user with ID:', user.user_id);
        return this.userService.withdrawUser(user.user_id);
    }
}

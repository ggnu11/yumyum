import { Controller } from '@nestjs/common';

@Controller('user')
export class UserController {

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

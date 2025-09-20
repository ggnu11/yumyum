import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from './favorite.service';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get paginated favorite posts for the current user' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'List of favorite posts returned successfully.' })
  async getFavoritePosts(@Query('page') page: number, @GetUser() user: User) {
    return this.favoriteService.getFavoritePosts(page, user);
  }

  @ApiOperation({ summary: 'Toggle favorite for a specific post' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the post to toggle favorite',
    example: 42,
  })
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Post('/:id')
  toggleFavorite(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.favoriteService.toggleFavorite(id, user);
  }
}

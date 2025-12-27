import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/@common/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller()
@UseGuards(AuthGuard())
export class PostController {
    constructor(private postService: PostService) {}

    @Get('/markers')
    @ApiOperation({ summary: 'Get all map markers' })
    @ApiResponse({
        status: 200,
        description: 'Markers successfully retrieved.',
    })
    getAllMarkers(@GetUser() user: User) {
        return this.postService.getAllMarkers(user);
    }

    @Get('/posts')
    @ApiOperation({
        summary: 'Get posts (my posts with page, or by year/month)',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for my posts',
    })
    @ApiQuery({
        name: 'year',
        required: false,
        type: Number,
        description: 'Filter by year',
    })
    @ApiQuery({
        name: 'month',
        required: false,
        type: Number,
        description: 'Filter by month',
    })
    @ApiResponse({ status: 200, description: 'Posts successfully retrieved.' })
    getPosts(
        @Query('page') page: number,
        @Query('year') year: number,
        @Query('month') month: number,
        @GetUser() user: User,
    ) {
        if (page) {
            return this.postService.getMyPosts(page, user);
        }

        return this.postService.getPostsByMonth(year, month, user);
    }

    @Get('/posts/:id')
    @ApiOperation({ summary: 'Get a single post by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Post successfully retrieved.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    getPostById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.postService.getPostById(id, user);
    }

    @Post('/posts')
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post successfully created.' })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    createPost(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
        return this.postService.createPost(createPostDto, user);
    }

    @Delete('/posts/:id')
    @ApiOperation({ summary: 'Delete a post by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Post successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    deletePost(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.postService.deletePost(id, user);
    }

    @Patch('/posts/:id')
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Update a post by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
    @ApiResponse({ status: 200, description: 'Post successfully updated.' })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    @ApiResponse({ status: 404, description: 'Post not found.' })
    updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        updatePostDto: Omit<
            CreatePostDto,
            'latitude' | 'longitude' | 'address'
        >,
        @GetUser() user: User,
    ) {
        return this.postService.updatePost(id, updatePostDto, user);
    }
}

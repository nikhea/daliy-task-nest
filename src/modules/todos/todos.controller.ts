import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Cat, CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindTodosQueryDto } from './dto/find-todos-query.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { SetTodocompletedDto } from './dto/set-isCompleted.dto';

const response = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: { type: 'object' },
    },
    pagination: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        limit: { type: 'number' },
        total: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  },
};

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiCreatedResponse({
    description: 'Todo created successfully',
    type: Cat,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiOkResponse({
    description: 'List of todos with pagination info',
    schema: response,
  })
  @ApiResponse({ status: 404, description: 'No todos found' })
  findAll(@Query() query: FindTodosQueryDto) {
    return this.todosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo by ID' })
  @ApiResponse({ status: 200, description: 'Todo found' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }

  @Patch(':id/set-completed')
  @ApiOperation({ summary: 'Set todo as completed or in-completed' })
  setCompleted(
    @Param('id') id: string,
    @Body() isCompleted: SetTodocompletedDto,
  ) {
    return this.todosService.setCompleted(id, isCompleted.isCompleted);
  }

  @Patch(':id/upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}

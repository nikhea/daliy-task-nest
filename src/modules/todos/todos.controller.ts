import { Express, Request } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  // FileInterceptor,
} from '@nestjs/platform-express';
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
  UploadedFiles,
  BadRequestException,
  // UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
  // ApiBearerAuth,
} from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { Cat, CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { FindTodosQueryDto } from './dto/find-todos-query.dto';
import { FileUploadDto, SingleFileUploadDto } from './dto/file-upload.dto';
import { SetTodocompletedDto } from './dto/set-isCompleted.dto';
// import { AuthAndVerificationGuard } from 'src/common/guards/protect.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { TAuthUser } from 'src/common/decorator/user.decorator';
import {
  fileNameAndSizeMixUpload,
  multerOptions,
  validateUploadedFiles,
} from '../../common/constant/constant';
// import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

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
// @UseGuards(AuthGuard)
// @UseGuards(AuthAndVerificationGuard)
// @ApiBearerAuth()
// @UseInterceptors(CacheInterceptor)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

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
  findAll(@Query() query: FindTodosQueryDto, @CurrentUser() user: TAuthUser) {
    return this.todosService.findAll(query, user);
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

  @Patch(':id/upload/single')
  @ApiOperation({ summary: 'Upload single file' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Single file upload with optional description',
    type: SingleFileUploadDto,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadFileWithDto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: SingleFileUploadDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return {
      message: 'File uploaded successfully',
      id,
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      description: uploadDto.description || null,
    };
  }

  @Patch(':id/set-completed')
  @ApiOperation({ summary: 'Set todo as completed or in-completed' })
  setCompleted(
    @Param('id') id: string,
    @Body() isCompleted: SetTodocompletedDto,
  ) {
    return this.todosService.setCompleted(id, isCompleted.isCompleted);
  }

  @Patch(':id/upload/multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiResponse({ status: 200, description: 'File uploaded successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List Of Uploaded FIles',
    type: FileUploadDto,
  })
  // @ApiCreatedResponse({
  //   description: 'file uploaded successfully',
  //   type: UploadDto,
  // })
  @UseInterceptors(
    FileFieldsInterceptor(fileNameAndSizeMixUpload(), multerOptions),
  )
  uploadFile(
    @Param('id') id: string,
    @UploadedFiles()
    uploadedFiles: {
      file?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
    @Body() uploadDto: FileUploadDto,
  ) {
    if (!validateUploadedFiles(uploadedFiles)) {
      throw new BadRequestException('No files uploaded');
    }

    const singleFile = uploadedFiles.file?.[0];
    const multipleFiles = uploadedFiles.files || [];

    if (!singleFile && multipleFiles.length === 0) {
      throw new BadRequestException('At least one file must be uploaded');
    }
    return {
      message: 'Mixed files uploaded successfully',
      id,
      uploadDto: {
        description: uploadDto.description,
      },
      singleFile: singleFile?.originalname || null,
      multipleFiles: multipleFiles.map((f) => ({
        name: f.originalname,
        mime: f.mimetype,
        size: f.size,
        fileName: f.fieldname,
        file: f.filename,
      })),
      totalCount: (singleFile ? 1 : 0) + multipleFiles.length,
    };
  }
}

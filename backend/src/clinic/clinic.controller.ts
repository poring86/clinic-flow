import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

interface CreateClinicBody {
  name: string;
}

@ApiTags('clinic')
@Controller('clinic')
export class ClinicController {
  @Get()
  @ApiOperation({ summary: 'List all clinics' })
  findAll() {
    return [{ id: '1', name: 'Clinic Example' }];
  }

  @Post()
  @ApiOperation({ summary: 'Create a clinic' })
  create(@Body() body: CreateClinicBody) {
    return { id: '1', ...body };
  }
}

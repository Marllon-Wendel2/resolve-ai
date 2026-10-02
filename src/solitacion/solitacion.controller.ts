import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SolitacionService } from './solitacion.service';
import {
  createSolicitationPipe,
  updateSolicitationPipe,
  type UpdateSolitacionDto,
  type CreateSolitacionDto,
} from './dto/solitacion.dto';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from 'src/auth/guards/jwt-auth.guard';
import type { Filter, QueryParams } from './dto/filter';

@Controller('solitacion')
@UseGuards(JwtAuthGuard)
export class SolitacionController {
  constructor(private readonly solitacionService: SolitacionService) {}

  @Post()
  createSolitacion(
    @Body(createSolicitationPipe) createSolitacionDto: CreateSolitacionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.solitacionService.createSolitacion(
      req.user.sub,
      createSolitacionDto,
    );
  }

  @Get()
  findLastSolitacion(@Query() query: QueryParams) {
    const limit = Number(query.limit) || 10;
    const offset = Number(query.offset) || 0;
    const orderBy = query.orderBy === 'asc' ? 'asc' : 'desc';

    const filter: Filter = {
      category: query.category,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      search: query.search,
    };

    return this.solitacionService.findLastSolitacion({
      limit,
      offset,
      orderBy,
      filter,
    });
  }

  @Get(':id')
  async consultSolitacion(@Param('id') id: string) {
    return await this.solitacionService.consultSolitacion(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(updateSolicitationPipe) updateSolitacionDto: UpdateSolitacionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.solitacionService.updateSolitacion(
      id,
      req.user.sub,
      updateSolitacionDto,
    );
  }

  @Delete(':id')
  removeSolitacion(@Param('id') id: string) {
    return this.solitacionService.removeSolitacion(id);
  }
}

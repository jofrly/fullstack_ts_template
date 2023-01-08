import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';

import { TestEnvGuard } from '../guards/test-env.guard';
import { RunSeedDto } from '../dtos/run-seed.dto';
import { SeedService } from '../services/seed.service';

@UseGuards(TestEnvGuard)
@Controller('api/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  index(): string {
    return '';
  }

  @Post()
  create(@Body() runSeedDto: RunSeedDto): Promise<any> {
    return this.seedService.runSeed(runSeedDto);
  }
}

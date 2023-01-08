import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RunSeedDto } from '../dtos/run-seed.dto';
import { FactoryBot, purgeDatabase } from '../../specs/support/general';
import E2ESeeds from '../e2e-seeds';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async runSeed(runSeedDto: RunSeedDto): Promise<void> {
    await purgeDatabase(this.dataSource);
    FactoryBot.dataSource = this.dataSource;

    const result = await E2ESeeds[runSeedDto.group][runSeedDto.seed](
      this.dataSource,
    );

    return result || {};
  }
}

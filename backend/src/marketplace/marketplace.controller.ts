import { Body, Controller, Post, Get, Patch, Delete } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post()
  async create(@Body() body: any) {
    console.log(body);

    return this.marketplaceService.create(body);
  }

  @Get()
  async findAll() {
    return this.marketplaceService.findAll();
  }

  @Patch(':id')
  async update(@Body() body: any) {
    return this.marketplaceService.update(body);
  }

  @Delete(':id')
  async remove(@Body() body: any) {
    return this.marketplaceService.remove(body);
  }
}

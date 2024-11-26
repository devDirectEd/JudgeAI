import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('metrics')
  async getMetrics() {
    return this.adminService.getMetrics();
  }
}
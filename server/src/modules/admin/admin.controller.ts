import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Auth } from 'src/common/decorators/role.decorators';
import { Permission } from 'src/types/permission.types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('metrics')
  @Auth(['admin'], [Permission.VIEW_PROFILE])
  async getMetrics() {
    return this.adminService.getMetrics();
  }
  @Get(':id')
  @Auth(['admin'], [Permission.VIEW_PROFILE])
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }
}

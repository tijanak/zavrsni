import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from '@dog-finder/models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Patch()
  updateProfile(@Body() updateDto: UpdateUserDto, @Req() req) {
    return this.userService.update(req.user.id, updateDto);
  }
}

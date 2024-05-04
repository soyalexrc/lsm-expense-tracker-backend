import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Post()
  create(@Body() createUserSettingDto: CreateUserSettingDto) {
    return this.userSettingsService.create(createUserSettingDto);
  }

  @Post('GetByUserId')
  getByUserId(@Body() body: { userId: string }) {
    return this.userSettingsService.getByUserId(body.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
  ) {
    return this.userSettingsService.update(id, updateUserSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSettingsService.remove(+id);
  }
}

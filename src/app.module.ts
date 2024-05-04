import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'),
          dbName: configService.get<string>('DB_NAME'),
        };
      },
    }),
    ExpenseModule,
    CategoryModule,
    UserSettingsModule,
  ],
})
export class AppModule {}

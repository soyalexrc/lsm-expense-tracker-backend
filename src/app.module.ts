import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExpenseModule } from './expense/expense.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
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
    UserModule,
  ],
})
export class AppModule {}

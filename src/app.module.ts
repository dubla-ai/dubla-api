import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { dataSourceOptions } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

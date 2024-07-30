import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { dataSourceOptions } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/projects/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

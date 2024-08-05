import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/projects/project.module';
import dataSourceOptions from './configs/data-source-options.config';
import { VoiceModule } from './modules/voices/voice.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    ProjectModule,
    VoiceModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

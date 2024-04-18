import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { ChatbotModule } from './chatbot/chatbot.module';
import { NoteModule } from './note/note.module';
import { CommonChatSessionModule } from './common-chat-session/common-chat-session.module';
import { RessourceModule } from './ressource/ressource.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { AbsenceModule } from './absence/absence.module';
import { TaskModule } from './task/task.module';
import { SubjectModule } from './subject/subject.module';
import { SessionTypeModule } from './session-type/session-type.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { StudentEntity } from './user/entities/student.entity';
import { FileUploadModule } from './file-upload/file-upload.module';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      debug: false,
    }),
    ChatbotModule,
    NoteModule,
    RessourceModule,
    AnnouncementModule,
    AbsenceModule,
    TaskModule,
    SubjectModule,
    SessionTypeModule,
    SessionModule,
    UserModule,
    FileUploadModule,
    TypeOrmModule.forFeature([UserEntity, StudentEntity]),
    CommonChatSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HelmetMiddleware).forRoutes('');
  }
}

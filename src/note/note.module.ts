import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './entities/note.entity';
import { SessionEntity } from '../session/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity, SessionEntity])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}

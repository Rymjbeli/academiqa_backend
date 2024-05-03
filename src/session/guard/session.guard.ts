import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SessionService } from '../session.service';
import { User } from '../../user/entities/user.entity';
import { StudentService } from '../../user/student/student.service';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly studentService: StudentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser: User = request?.user;
    // console.log('currentUser', currentUser);

    const sessionId = request?.params?.id;
    // console.log('sessionId', sessionId);

    const session = await this.sessionService.findOneForGuard(sessionId);
    if (!session) {
      return false;
    }
    console.log('session', session.sessionType);

    const { sessionType } = session;

    if (currentUser?.role === 'Admin') {
      return true;
    } else if (currentUser?.role === 'Teacher') {
      const teacher = sessionType?.teacher;
      console.log(
        'helllllllllllllloooooooooooooooooooo',
        currentUser?.id,
        teacher?.id,
      );
      return currentUser?.id === teacher?.id;
    } else if (currentUser?.role === 'Student') {
      const student = await this.studentService.findOneStudent(currentUser?.id);
      // console.log('student', student);
      console.log(student?.group?.id === sessionType?.group?.id);
      if (session?.sessionType?.type === SessionTypeEnum?.Lecture) {
        return student?.group?.sectorLevel === sessionType?.group?.sectorLevel;
      } else {
        return student?.group?.id === sessionType?.group?.id;
      }
    }

    return false;
  }
}

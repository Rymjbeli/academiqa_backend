import { IsNotEmpty } from 'class-validator';
import { SessionEntity } from 'src/session/entities/session.entity';

export class CreateRessourceDto {
  @IsNotEmpty()
  session: SessionEntity;
}

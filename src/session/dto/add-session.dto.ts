import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';

export class AddSessionDto {
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  endTime: Date;

  /*
  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum = SessionTypeEnum.Rattrapage;
*/

  @IsNotEmpty()
  @IsString()
  name: string;
}

/*
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
*/

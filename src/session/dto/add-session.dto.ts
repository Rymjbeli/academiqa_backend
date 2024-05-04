import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SessionTypeEntity } from '../../session-type/entities/session-type.entity';
import { SessionTypeEnum } from '../../Enums/session-type.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddSessionDto {
  @Expose()
  @IsNotEmpty()
  date: Date;

  @Expose()
  @IsNotEmpty()
  endTime: Date;

  /*
  @IsNotEmpty()
  @IsEnum(SessionTypeEnum)
  type: SessionTypeEnum = SessionTypeEnum.Rattrapage;
*/

  @Expose()
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

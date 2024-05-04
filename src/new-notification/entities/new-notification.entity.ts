import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotifTypeEnum } from '../../Enums/notif-type.enum';
import { TimestampEntites } from '../../Generics/timestamp.entities';

@Entity('notification')
export class NewNotificationEntity extends TimestampEntites {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column({
    nullable: true,
  })
  broadcast: string;
  @Column({
    nullable: true,
  })
  link: number;
  @Column({
    nullable: true,
  })
  senderImage: string;
  @Column({
    type: 'enum',
    enum: NotifTypeEnum,
    default: NotifTypeEnum.MESSAGE,
  })
  notificationType: string;
  @Column()
  receiver: number;
}

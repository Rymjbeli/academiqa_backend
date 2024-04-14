import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NotifTypeEnum } from '../../Enums/notif-type.enum';

@Entity('notifications')
export class Notification {
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

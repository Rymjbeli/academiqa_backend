import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class CommonChatEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  // @ManyToOne(()=> UserEntity, {
  //   nullable: false,
  // })
  // author: UserEntity;
  @Column()
  parentId: number;
  // @ManyToOne(()=> SessionEntity, {
  //   nullable: false,
  // })
  // session: SessionEntity;
}

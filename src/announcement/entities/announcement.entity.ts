import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  // @ManyToOne(()=>SubjectEntity,{
  // subject: SubjectEntity;
  // @ManyToOne(()=>UserEntity,{
  //   nullable: false,
  // })
  // user: UserEntity;
}

import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class RessourceEntity {
  @PrimaryGeneratedColumn()
  id: number;
  // @ManyToOne(()=>SessionEntity,{
  //   nullable: false,
  // })
  // session: SessionEntity;
  @Column()
  path: string;
}

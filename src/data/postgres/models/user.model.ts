import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({nullable: false})
  name!: string

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({nullable: false})
  password!: string

  @Column({ nullable: true })
  img?: string

  @Column({ 
    type: "enum", 
    enum: ["USER_ROLE", "ADMIN_ROLE"], 
    default: "USER_ROLE"
  })
  roles!: string[]
}
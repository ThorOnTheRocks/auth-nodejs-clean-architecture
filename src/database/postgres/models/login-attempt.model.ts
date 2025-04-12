import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity()
@Index(["email", "createdAt"])
@Index(["ipAddress", "createdAt"])
export class LoginAttempt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  email!: string;

  @Column({ nullable: true })
  userId!: string | null;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @Column({ nullable: true })
  userAgent!: string | null;

  @Column()
  success!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

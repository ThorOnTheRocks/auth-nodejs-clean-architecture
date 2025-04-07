import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class VerificationToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  userId!: string;

  @Column({ nullable: false, unique: true })
  token!: string;

  @Column({ nullable: false })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

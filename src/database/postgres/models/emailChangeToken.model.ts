import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class EmailChangeToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  userId!: string;

  @Column({ nullable: false })
  currentEmail!: string;

  @Column({ nullable: false })
  newEmail!: string;

  @Column({ nullable: false, unique: true })
  token!: string;

  @Column({ nullable: false })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

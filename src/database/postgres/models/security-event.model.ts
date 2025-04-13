import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class SecurityEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true, type: "varchar" })
  userId!: string | null;

  @Column()
  eventType!: string;

  @Column({ nullable: true, type: "varchar" })
  ipAddress!: string | null;

  @Column({ nullable: true, type: "varchar" })
  userAgent!: string | null;

  @Column({ type: "jsonb", nullable: true })
  details!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;
}

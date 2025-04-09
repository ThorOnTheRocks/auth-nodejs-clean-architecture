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

  @Column({ nullable: true })
  userId!: string | null;

  @Column()
  eventType!: string;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @Column({ nullable: true })
  userAgent!: string | null;

  @Column({ type: "jsonb", nullable: true })
  details!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity()
@Index(["userId", "fingerprint"], { unique: true })
export class UserDevice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  userId!: string;

  @Column({ nullable: true })
  deviceName!: string | null;

  @Column({ nullable: true })
  deviceType!: string | null;

  @Column({ nullable: true })
  browser!: string | null;

  @Column({ nullable: true })
  operatingSystem!: string | null;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @Column()
  @Index()
  fingerprint!: string;

  @Column({ default: false })
  isTrusted!: boolean;

  @UpdateDateColumn()
  lastUsedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

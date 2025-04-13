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

  @Column({ nullable: true, type: "varchar" })
  deviceName!: string | null;

  @Column({ nullable: true, type: "varchar" })
  deviceType!: string | null;

  @Column({ nullable: true, type: "varchar" })
  browser!: string | null;

  @Column({ nullable: true, type: "varchar" })
  operatingSystem!: string | null;

  @Column({ nullable: true, type: "varchar" })
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

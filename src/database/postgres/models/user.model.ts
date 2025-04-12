import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: true })
  img?: string;

  @Column({
    type: "enum",
    enum: ["USER_ROLE", "ADMIN_ROLE"],
    default: "USER_ROLE",
  })
  roles!: string[];

  @Column({ default: false })
  isLocked!: boolean;

  @Column({ nullable: true, type: "timestamp" })
  lockedUntil!: Date | null;

  @Column({ nullable: true })
  lockReason!: string | null;
}

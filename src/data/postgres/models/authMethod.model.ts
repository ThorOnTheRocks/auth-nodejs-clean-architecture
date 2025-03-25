import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { OauthProvider } from "../../../domain/entities/authMethod.entity";

@Entity()
export class AuthMethod {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column({
    type: "enum",
    enum: ["local", "google", "github"],
  })
  provider!: OauthProvider;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;
}

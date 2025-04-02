import {
  EmailContent,
  EmailDataSource,
  EmailResponse,
} from "../../domain/datasources/email.datasources";
import { EmailRepository } from "../../domain/repositories/email.repository";

export class EmailRepositoryImpl implements EmailRepository {
  constructor(private readonly emailDataSource: EmailDataSource) {}

  sendEmail(content: EmailContent): Promise<EmailResponse> {
    return this.emailDataSource.sendEmail(content);
  }
}

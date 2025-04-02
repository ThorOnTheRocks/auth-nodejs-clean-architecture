import { EmailContent, EmailResponse } from "../datasources/email.datasources";

export abstract class EmailRepository {
  abstract sendEmail(content: EmailContent): Promise<EmailResponse>;
}

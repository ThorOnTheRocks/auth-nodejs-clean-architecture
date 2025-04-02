export interface EmailContent {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResponse {
  id: string;
  success: boolean;
  error?: string;
}

export abstract class EmailDataSource {
  abstract sendEmail(content: EmailContent): Promise<EmailResponse>;
}

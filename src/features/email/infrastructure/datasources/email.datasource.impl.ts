import {
  EmailContent,
  EmailDataSource,
  EmailResponse,
} from "../../domain/datasources/email.datasources";
import { ResendAdapter } from "../../../../config/resend";
import { CustomError } from "../../../../domain/errors/errors";

export class ResendEmailDataSourceImpl implements EmailDataSource {
  async sendEmail(content: EmailContent): Promise<EmailResponse> {
    try {
      const result = await ResendAdapter.sendEmail(content);

      if (!result.success) {
        throw new Error(result.error || "Failed to send email");
      }

      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw CustomError.internalServerError(
        `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

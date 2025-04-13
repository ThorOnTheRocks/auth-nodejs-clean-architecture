import { Resend } from "resend";
import { envs } from "./envs";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface SendEmailResponse {
  id: string;
  success: boolean;
  error?: string;
}

export class ResendAdapter {
  private static resend: Resend;
  private static defaultFromEmail: string;

  static initialize() {
    this.resend = new Resend(envs.RESEND_API_KEY);
    this.defaultFromEmail = envs.EMAIL_FROM || "auth@resend.dev";
  }

  static async sendEmail(
    options: SendEmailOptions,
  ): Promise<SendEmailResponse> {
    if (!this.resend) {
      this.initialize();
    }

    try {
      const { to, subject, html, text, from, replyTo } = options;

      const response = await this.resend.emails.send({
        from: from || this.defaultFromEmail,
        to: typeof to === "string" ? to : to.join(","),
        subject,
        html: html || undefined,
        text: text || undefined,
        replyTo: replyTo,
        react: undefined,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return {
        id: response.data?.id || "",
        success: !!response.data?.id,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        id: "",
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}

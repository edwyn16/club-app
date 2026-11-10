import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export interface SendEmailInput {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export class EmailServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EmailServiceError';
    }
}

export const sendEmail = async (input: SendEmailInput,): Promise<string> => {
    const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.text !== undefined && { text: input.text }),
    });

    if (error || !data) {
        console.error("Resend email delivery failed:", error);

        throw new EmailServiceError(
            "Unable to send the email. Please try again later.",
        );
    }

    return data.id;
};
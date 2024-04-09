import { render } from "@react-email/render";

import { env } from "./env";
import { getTransport } from "./mailTransport";

type SendEmailProps<T> = {
  to: string | string[];
  subject: string;
  Email: (props: T) => JSX.Element;
  emailProps: T;
};

export const sendEmail = async <T>({ to, subject, Email, emailProps }: SendEmailProps<T>) => {
  const transport = getTransport();

  const renderEmail = render(Email(emailProps));

  await transport.sendMail({
    from: env.EMAIL_SENDER,
    to,
    subject,
    html: renderEmail,
  });
};

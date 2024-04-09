/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Font } from "@react-email/font";
import { Head } from "@react-email/head";

import { env } from "../env";

type EmailContentProps = {
  userName: string;
  organizationName: string;
  invitedUserName: string;
  token: string;
};

const EmailContent = ({
  userName,
  organizationName,
  invitedUserName,
  token,
}: EmailContentProps) => (
  <Tailwind>
    <Html>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2",
            format: "woff2",
          }}
        />
      </Head>

      <Preview>Has sido invitado a una organización en Cacta</Preview>

      <Body>
        <Container className="mx-auto my-0 mb-16 bg-white pb-12 pt-5">
          <Section>
            <Section className="mb-10 flex w-full justify-center">
              <Img
                src={`${env.NEXT_PUBLIC_BASE_URL}/icons/logoBlackLetters.svg`}
                alt="Cacta"
                width={240}
                height={70}
              />
            </Section>

            <Text className="mb-8 font-primary text-sm font-normal not-italic leading-4">
              Hola {invitedUserName}!
            </Text>

            <Text className="mb-8 text-justify text-sm font-normal not-italic">
              <span className="text-[#8e33ff]">{userName}</span> te ha invitado a unirte a la
              organización <span className="text-[#8e33ff]">{organizationName}</span> en Cacta. Para
              aceptar la invitación, haz clic en "Confirmar".
            </Text>

            <Button
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#8e33ff] p-3 text-center font-secondary text-sm font-medium leading-5 text-white ring-offset-background transition-colors focus-visible:outline-none"
              href={`${env.NEXT_PUBLIC_BASE_URL}/confirm-invite?token=${token}`}
            >
              Confirmar
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default EmailContent;

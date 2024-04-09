/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "../env";

type EmailContentProps = {
  userName: string;
  password: string;
  organizationName: string;
  token: string;
};

const EmailContent = ({ userName, password, organizationName, token }: EmailContentProps) => (
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

      <Preview>Bienvenido/a a Cacta</Preview>

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
              Bienvenido/a a Cacta!
            </Text>

            <Text className="mb-8 text-justify text-sm font-normal not-italic">
              <span className="text-[#8e33ff]">{userName}</span> te ha invitado a unirte a la
              organización <span className="text-[#8e33ff]">{organizationName}</span> en Cacta. Para
              aceptar la invitación has click en "Confirmar".
            </Text>

            <Text className="mb-10 text-justify text-sm font-extrabold not-italic">
              Tu contraseña temporal es: <span className="text-[#8e33ff]">{password}</span>
              <br /> Serás redirigido para cambiar tu contraseña luego de ingresar por primera vez a
              la plataforma.
            </Text>

            <Button
              className="flex w-full items-center justify-center rounded-lg bg-[#8e33ff] p-3 text-center font-secondary text-sm font-medium leading-5 text-white ring-offset-background transition-colors focus-visible:outline-none"
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

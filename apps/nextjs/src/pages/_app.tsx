import type { ReactElement } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import { Toaster } from "~/components/molecules/Toaster";
import { AppContextProvider } from "~/context/AppContext";

import "~/styles/globals.css";

import { NextIntlClientProvider } from "next-intl";

export type NextPageWithLayout<PageProps = unknown> = NextPage<PageProps> & {
  getLayout?: (page: ReactElement<PageProps>) => ReactElement;
};

type CustomAppProps = {
  session: Session | null;
  messages: IntlMessages;
};

type AppPropsWithLayout<T> = AppProps<T & CustomAppProps> & {
  Component: NextPageWithLayout<T>;
};

const MyApp = <T extends object>({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout<T>) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <SessionProvider {...pageProps}>
        <AppContextProvider>{getLayout(<Component {...pageProps} />)}</AppContextProvider>
      </SessionProvider>
      <Toaster />
    </NextIntlClientProvider>
  );
};

export default api.withTRPC(MyApp);

import NextHead from "next/head";

type HeadProps = {
  title: string;
};

const Head = ({ title }: HeadProps) => (
  <NextHead>
    <title>{title}</title>
    <meta name="description" content="Cacta" />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" href="/icons/logo.svg" />
  </NextHead>
);

export default Head;

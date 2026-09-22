import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="NHS England TIS Self-Service web application"
        />
        {process.env.NEXT_PUBLIC_ENVIRONMENT_NAME !== "production" && (
          <meta name="robots" content="noindex,nofollow" />
        )}
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className="nhsuk-frontend-supported">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="h-full bg-cream text-ink antialiased" lang="et">
      <Head>
        <meta name="theme-color" content="#FAF8F4" />
      </Head>
      <body className="flex h-full flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

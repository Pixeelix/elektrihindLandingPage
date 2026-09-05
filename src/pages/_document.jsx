import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="h-full text-ink antialiased" style={{ background: '#eef1ff' }} lang="et">
      <Head>
        <meta name="theme-color" content="#eef1ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="alternate" hrefLang="et" href="https://nordprice.app/" />
        <link rel="alternate" hrefLang="en" href="https://nordprice.app/?lang=en" />
        <link rel="alternate" hrefLang="x-default" href="https://nordprice.app/" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5431783362632568" crossOrigin="anonymous" />
      </Head>
      <body className="flex h-full flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

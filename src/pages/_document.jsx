import { Head, Html, Main, NextScript } from 'next/document'

const noFlashScript = `(function(){try{var t=localStorage.getItem('nordprice:theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.style.background='#1a1e35';}else{document.documentElement.style.background='#a8b2f5';}}catch(e){}})();`

export default function Document() {
  return (
    <Html className="h-full text-ink antialiased" lang="et">
      <Head>
        <meta name="theme-color" content="#a8b2f5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
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

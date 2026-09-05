import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

function BrandMark({ gradientId = 'np-grad' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 50 50" className="flex-none" aria-hidden="true">
      <defs>
        <radialGradient id={gradientId} cx="65%" cy="35%" r="85%">
          <stop offset="0%" stopColor="#7B8FFF" />
          <stop offset="50%" stopColor="#4A5AE8" />
          <stop offset="100%" stopColor="#3040D5" />
        </radialGradient>
      </defs>
      <rect width="50" height="50" rx="12" fill={`url(#${gradientId})`} />
      <g fill="#FFF" transform="translate(15.234 7.91)">
        <g>
          <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z" />
          <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z" />
        </g>
        <g transform="rotate(180 9.766 17.139)">
          <path fillOpacity="0.80" d="M15.4296875 0L0 19.6289063 8.18260051 19.6289063z" />
          <path fillOpacity="0.40" d="M0 19.6289062L15.4296875 0 4.06593117 19.6289062z" />
        </g>
      </g>
    </svg>
  )
}

const t = {
  et: {
    pageTitle: 'Privaatsuspoliitika · NordPrice',
    lang: 'ET',
    otherLang: 'EN',
    heading: 'Privaatsuspoliitika',
    updated: 'Viimati uuendatud: september 2026',
    intro:
      'NordPrice kuvab Nord Pooli elektrihindu Eestis, Lätis, Leedus ja Soomes. Me ei kogu ega töötle kasutajate isikuandmeid.',
    sections: [
      {
        title: 'Andmeallikas',
        body: 'Elektrihinna andmed pärinevad otse Elering AS-i avalikust API-st (elering.ee). NordPrice ei muuda ega filtreeri neid andmeid.',
      },
      {
        title: 'Seaded ja lokaalne salvestus',
        body: 'Sinu valikud (piirkond, ühik, keel, intervall) salvestatakse ainult sinu seadme localStorage-i. Neid andmeid ei edastata meile ega kolmandatele osapooltele.',
      },
      {
        title: 'Reklaamid — Google AdSense (veeb)',
        body: 'Veebileht kasutab Google AdSense\'i reklaame. Google võib koguda järgmisi andmeid:\n• IP-aadress seadme ligikaudse asukoha tuvastamiseks\n• Seadme identifikaator (reklaamitunnus) kolmanda osapoole reklaami ja analüütika jaoks\n• Reklaamiandmed (vaadatud reklaamid) reklaami tõhususe mõõtmiseks\n• Kasutaja interaktsioonid rakendusega (käivitamine, klõpsud, video vaatamine) reklaami täiustamiseks\nLisateave: https://policies.google.com/privacy',
      },
      {
        title: 'Reklaamid — Google AdMob (mobiilirakendus)',
        body: 'Mobiilirakendus kasutab Google AdMob SDK-d. SDK võib koguda:\n• IP-aadress seadme ligikaudse asukoha tuvastamiseks\n• Vearaportid (kasutajaga mitte seotud) probleemide diagnoosimiseks\n• Jõudlusandmed (käivitusaeg, hangumissagedus, energiakasutus) kasutajakogemuse hindamiseks\n• Seadme identifikaator reklaami ja analüütika jaoks\n• Reklaamiandmed ja kasutaja interaktsioonid reklaami täiustamiseks',
      },
      {
        title: 'Küpsised',
        body: 'NordPrice ise ei kasuta küpsiseid. Google AdSense ja AdMob võivad paigaldada küpsiseid vastavalt oma privaatsuspoliitikale.',
      },
      {
        title: 'Andmete säilitamine',
        body: 'Me ei salvesta serveris ühtegi isikuandmeid. Kõik seaded on lokaalsed ja kasutaja saab need igal ajal brauseri seadetest kustutada.',
      },
      {
        title: 'Kontakt',
        body: 'Privaatsusega seotud küsimuste korral kirjuta: martin.jogi@lhv.ee',
      },
    ],
  },
  en: {
    pageTitle: 'Privacy Policy · NordPrice',
    lang: 'EN',
    otherLang: 'ET',
    heading: 'Privacy Policy',
    updated: 'Last updated: September 2026',
    intro:
      'NordPrice displays Nord Pool electricity prices for Estonia, Latvia, Lithuania, and Finland. We do not collect or process any personal data from users.',
    sections: [
      {
        title: 'Data Source',
        body: 'Electricity price data is fetched directly from the public API of Elering AS (elering.ee). NordPrice does not modify or filter this data.',
      },
      {
        title: 'Settings and Local Storage',
        body: 'Your preferences (region, unit, language, interval) are stored exclusively in your device\'s localStorage. This data is never transmitted to us or any third party.',
      },
      {
        title: 'Advertising — Google AdSense (web)',
        body: 'The website uses Google AdSense for advertising. Google may collect the following data:\n• IP address to estimate the general location of a device\n• Device identifier (advertising ID) for third-party advertising and analytics\n• Advertising data (ads seen) to measure ad effectiveness\n• User interactions with the app (launches, taps, video views) to improve advertising\nMore information: https://policies.google.com/privacy',
      },
      {
        title: 'Advertising — Google AdMob (mobile app)',
        body: 'The mobile app uses the Google AdMob SDK. The SDK may collect:\n• IP address to estimate the general location of a device\n• Non-user related crash logs to diagnose problems and improve the SDK\n• Performance data (launch time, hang rate, energy usage) to evaluate user behaviour\n• Device identifier for advertising and analytics purposes\n• Advertising data and user interactions to improve advertising performance',
      },
      {
        title: 'Cookies',
        body: 'NordPrice itself does not use cookies. Google AdSense and AdMob may set cookies in accordance with their own privacy policies.',
      },
      {
        title: 'Data Retention',
        body: 'We do not store any personal data on our servers. All settings are local and can be cleared at any time from your browser settings.',
      },
      {
        title: 'Contact',
        body: 'For privacy-related questions, please email: martin.jogi@lhv.ee',
      },
    ],
  },
}

export default function Privacy() {
  const [lang, setLang] = useState('et')
  const content = t[lang]

  return (
    <>
      <Head>
        <title>{content.pageTitle}</title>
      </Head>

      <main className="relative min-h-screen text-ink">
        <div className="ambient" aria-hidden="true">
          <div className="aurora" />
          <div className="aurora aurora--2" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark gradientId="np-grad-privacy" />
              <p className="text-xl font-bold tracking-tight">NordPrice</p>
            </Link>

            <button
              type="button"
              onClick={() => setLang(lang === 'et' ? 'en' : 'et')}
              className="rounded-full bg-ink/[.05] px-4 py-1.5 text-sm font-semibold text-ink/70 transition hover:bg-ink/10 hover:text-ink"
            >
              {content.otherLang}
            </button>
          </header>

          {/* Content */}
          <article className="mt-10 pb-20">
            <h1 className="text-3xl font-extrabold tracking-tight">{content.heading}</h1>
            <p className="mt-1 text-sm text-ink/40">{content.updated}</p>
            <p className="mt-6 text-base leading-relaxed text-ink/70">{content.intro}</p>

            <div className="mt-10 space-y-8">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-lg font-bold tracking-tight">{section.title}</h2>
                  <div className="mt-2 text-base leading-relaxed text-ink/70 whitespace-pre-line">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
    </>
  )
}

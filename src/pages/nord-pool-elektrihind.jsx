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
    lang: 'ET',
    otherLang: 'EN',
    pageTitle: 'Nord Pool elektrihind Eestis – Kuidas börsihind kujuneb? | NordPrice',
    pageDescription: 'Mis on Nord Pool ja kuidas kujuneb börsielektrihind Eestis, Soomes, Lätis ja Leedus? Selgitus, võrdlus ja reaalajas hinnad.',
    hero: {
      label: '',
      heading: 'Nord Pool elektrihind Eestis',
      lead: 'Nord Pool on Põhja- ja Baltimaade suurim elektribörsi operaator. Siin selgitame, kuidas börsielektrihind kujuneb ja mida see sinu arve jaoks tähendab.',
    },
    cta: 'Vaata praegust hinda →',
    sections: [
      {
        heading: 'Mis on Nord Pool?',
        body: 'Nord Pool on elektrienergia börs, mis tegutseb Norras, Rootsis, Soomes, Taanis, Eestis, Lätis, Leedus, Poolas, Saksamaal, Hollandis ja Belgias. Börs loob igal päeval järgmise päeva tunnihinnad, mille alusel teevad elektrimüüjad, tootjad ja suurtarbijad oma tehingud.\n\nEestis kehtib Nord Pooli Eesti hinnapiirkond (EE), mis on tihedalt seotud Soome (FI), Läti (LV) ja Leedu (LT) piirkondadega.',
      },
      {
        heading: 'Kuidas börsihind kujuneb?',
        body: 'Iga päev kell 12:00 Kesk-Euroopa aja järgi kogub Nord Pool pakkumised kõigilt elektritootjatelt ja -müüjatelt terve järgmise päeva kohta. Hind kujuneb pakkumise ja nõudluse ristumiskohas — iga tunni jaoks eraldi.\n\nHinda mõjutavad:\n• Tuule- ja päikeseenergia toodang (rohkem tootmist → madalam hind)\n• Hüdroelektrijaamade reservuaaride tase Norras ja Rootsis\n• Välisõhu temperatuur (külm → suurem tarbimine → kõrgem hind)\n• Kaablite läbilaskevõime piirkondade vahel\n• Gaasi ja söe maailmaturuhinnad',
      },
      {
        heading: 'Eesti vs Soome vs Läti vs Leedu — miks hinnad erinevad?',
        body: 'Põhimõtteliselt peaks börsihind kõigis piirkondades olema sama. Erinevused tekivad siis, kui ühendusvõimsus kahe piirkonna vahel on ammendunud — nt Eesti-Soome kaabel on täis — ja odavat elektrienergiat ei saa üle kanda. Sellisel juhul tekib hinnalõhe (price split).\n\nEestis kujuneb hind sageli Läti ja Leeduga sarnaselt, kuna Baltimaade sisene ühendus on tugev. Soome hind aga sõltub rohkem Põhjamaade hüdroreservuaaridest.',
      },
      {
        heading: 'Kas börsihind tähendab odavamat elektriarvet?',
        body: 'Börsielektrilepinguga maksad iga kuu tegeliku tunnihinnagraafiku põhjal. See võib olla odavam kui fikseeritud hind — aga ka kallim, kui hinnad on kõrged (nt talvised tippkoormused).\n\nBörsihinnas ei sisaldu:\n• Võrguteenuse tasu (~40–50% arvest)\n• Taastuvenergia tasu\n• Käibemaks (24%)\n\nNordPrice näitab börsihindu koos ja ilma käibemaksuta, et saaksid oma tarbimist planeerida.',
      },
    ],
    faq: {
      heading: 'Korduma kippuvad küsimused',
      items: [
        {
          q: 'Millal avaldatakse homse päeva hinnad?',
          a: 'Nord Pool avaldab järgmise päeva tunnihinnad igal tööpäeval kell 13:00–14:00 Eesti aja järgi (kell 12:00 Kesk-Euroopa aeg). NordPrice uuendab andmeid automaatselt kohe pärast avaldamist.',
        },
        {
          q: 'Miks on mõne tunni hind negatiivne?',
          a: 'Negatiivne hind tekib siis, kui elektritootmine ületab tarbimise selliselt, et tootjad on valmis maksma, et keegi nende elektrit ära tarbiks. See juhtub peamiselt tuuliste öötundide ajal, kui tuulepark toodab palju, aga tarbimine on madal.',
        },
        {
          q: 'Kas NordPrice näitab ka võrguteenuse tasu?',
          a: 'Ei — NordPrice näitab ainult Nord Pooli börsihinda. Võrguteenuse tasu sõltub sinu piirkonnast ja võrguettevõttest ning seda NordPrice ei kuva.',
        },
        {
          q: 'Kus on Nord Pooli andmed kõige odavamad?',
          a: 'See muutub pidevalt. Põhjamaades (eriti Norras ja Rootsis) on hinnad sageli madalamad tänu rohkele hüdroenergiale. Eesti, Läti ja Leedu hinnad on omavahel sarnasemad. NordPrice võimaldab kõiki nelja piirkonda võrrelda reaalajas.',
        },
      ],
    },
    footer: {
      backLabel: '← Tagasi reaalajas hindadele',
      privacy: 'Privaatsus',
    },
  },
  en: {
    lang: 'EN',
    otherLang: 'ET',
    pageTitle: 'Nord Pool Electricity Price in Estonia – How Is It Formed? | NordPrice',
    pageDescription: 'What is Nord Pool and how is the spot electricity price formed in Estonia, Finland, Latvia and Lithuania? Explained clearly, with live prices.',
    hero: {
      label: '',
      heading: 'Nord Pool Electricity Price in Estonia',
      lead: 'Nord Pool is the largest electricity exchange in Northern and Baltic Europe. Here we explain how the spot price is formed and what it means for your bill.',
    },
    cta: 'See the current price →',
    sections: [
      {
        heading: 'What is Nord Pool?',
        body: 'Nord Pool is an electricity exchange operating across Norway, Sweden, Finland, Denmark, Estonia, Latvia, Lithuania, Poland, Germany, the Netherlands, and Belgium. Every day it establishes hourly prices for the next day, which electricity sellers, producers, and large consumers use for their trades.\n\nEstonia belongs to the Nord Pool EE price area, which is closely linked to Finland (FI), Latvia (LV), and Lithuania (LT).',
      },
      {
        heading: 'How is the spot price formed?',
        body: 'Every day at 12:00 Central European Time, Nord Pool collects bids from all electricity producers and sellers for each hour of the next day. The price forms at the intersection of supply and demand — separately for each hour.\n\nFactors influencing the price:\n• Wind and solar power output (more production → lower price)\n• Water reservoir levels in Norwegian and Swedish hydro plants\n• Outdoor temperature (cold → higher demand → higher price)\n• Transmission capacity between price areas\n• Global gas and coal market prices',
      },
      {
        heading: 'Estonia vs Finland vs Latvia vs Lithuania — why do prices differ?',
        body: 'In principle, spot prices should be identical across all areas. Differences arise when the interconnection capacity between two areas is fully used — e.g. the Estonia–Finland cable is congested — and cheap electricity cannot flow across. This causes a price split.\n\nEstonian prices often move in sync with Latvia and Lithuania, as intra-Baltic interconnection is strong. Finnish prices depend more on Nordic hydro reservoir levels.',
      },
      {
        heading: 'Does a spot price contract mean a cheaper bill?',
        body: 'With a spot electricity contract you pay based on the actual hourly price each month. This can be cheaper than a fixed rate — but also more expensive when prices spike (e.g. cold winter peaks).\n\nThe spot price does not include:\n• Grid service fee (~40–50% of the bill)\n• Renewable energy levy\n• VAT (24%)\n\nNordPrice shows spot prices with and without VAT so you can plan your consumption.',
      },
    ],
    faq: {
      heading: 'Frequently Asked Questions',
      items: [
        {
          q: "When are tomorrow's prices published?",
          a: "Nord Pool publishes the next day's hourly prices on every working day between 13:00–14:00 Estonian time (12:00 Central European Time). NordPrice updates automatically as soon as they are released.",
        },
        {
          q: 'Why is the price negative for some hours?',
          a: 'Negative prices occur when electricity production exceeds consumption to the point where producers are willing to pay others to use their electricity. This typically happens during windy night hours when wind farms produce a lot but demand is low.',
        },
        {
          q: 'Does NordPrice show the grid service fee?',
          a: 'No — NordPrice shows only the Nord Pool spot price. The grid service fee depends on your region and network operator and is not displayed by NordPrice.',
        },
        {
          q: 'Which Nord Pool area tends to have the cheapest prices?',
          a: 'It changes constantly. The Nordic countries (especially Norway and Sweden) often have lower prices thanks to abundant hydro power. Estonian, Latvian and Lithuanian prices tend to move together. NordPrice lets you compare all four areas in real time.',
        },
      ],
    },
    footer: {
      backLabel: '← Back to live prices',
      privacy: 'Privacy',
    },
  },
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-ink/10 py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <span className="font-semibold text-ink">{q}</span>
        <span className="mt-0.5 flex-none text-ink/40 text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p className="mt-3 text-base leading-relaxed text-ink/70 whitespace-pre-line">{a}</p>
      )}
    </div>
  )
}

export default function NordPoolElektrihind() {
  const [lang, setLang] = useState('et')
  const content = t[lang]

  return (
    <>
      <Head>
        <title>{content.pageTitle}</title>
        <meta name="description" content={content.pageDescription} />
        <link rel="canonical" href="https://nordprice.app/nord-pool-elektrihind" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://nordprice.app/nord-pool-elektrihind" />
        <meta property="og:title" content={content.pageTitle} />
        <meta property="og:description" content={content.pageDescription} />
        <meta property="og:image" content="https://nordprice.app/og-image.png" />
        <meta property="og:site_name" content="NordPrice" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: content.hero.heading,
              description: content.pageDescription,
              url: 'https://nordprice.app/nord-pool-elektrihind',
              publisher: { '@type': 'Organization', name: 'NordPrice', url: 'https://nordprice.app' },
              mainEntityOfPage: 'https://nordprice.app/nord-pool-elektrihind',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faq.items.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            }),
          }}
        />
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
              <BrandMark gradientId="np-grad-guide" />
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

          <article className="mt-10 pb-24">
            {/* Hero */}
            <h1 className="text-h2 font-extrabold tracking-tight text-ink">{content.hero.heading}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">{content.hero.lead}</p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              {content.cta}
            </Link>

            {/* Sections */}
            <div className="mt-14 space-y-12">
              {content.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-bold tracking-tight text-ink">{section.heading}</h2>
                  <p className="mt-3 text-base leading-relaxed text-ink/70 whitespace-pre-line">{section.body}</p>
                </section>
              ))}
            </div>

            {/* FAQ */}
            <section className="mt-16">
              <h2 className="text-xl font-bold tracking-tight text-ink">{content.faq.heading}</h2>
              <div className="mt-4">
                {content.faq.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </section>

            {/* Footer nav */}
            <div className="mt-16 flex items-center justify-between text-sm text-ink/50">
              <Link href="/" className="hover:text-ink transition">{content.footer.backLabel}</Link>
              <Link href="/privacy" className="hover:text-ink transition">{content.footer.privacy}</Link>
            </div>
          </article>
        </div>
      </main>
    </>
  )
}

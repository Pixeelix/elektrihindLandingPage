import Head from 'next/head'
import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Google Ads</title>
      </Head>

      <section
        id="get-free-shares-today"
        className="h-full overflow-hidden bg-gray-900 py-20 sm:py-28"
      >
        <div className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
          <CircleBackground color="#fff" className="animate-spin-slower" />
        </div>
        <Container className="absolute top-1/2 left-20 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
          <div className="mx-auto max-w-md sm:text-center">
            <p className="mt-4 text-lg text-gray-300">
            google.com, pub-5431783362632568, DIRECT, f08c47fec0942fa0
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

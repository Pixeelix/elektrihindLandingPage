import Head from 'next/head'
import { CircleBackground } from '@/components/CircleBackground'
import { Container } from '@/components/Container'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy</title>
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
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
              We don't store your data, period.
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              We physically can't. We have nowhere to store it. We don't even
              have a server database to store it. So even if Justin Bieber asked
              nicely to see your data, we wouldn't have anything to show him.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}

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
        id="privacy"
        aria-label="Features for investing all your money"
        className="bg-gray-900 py-20 sm:py-32"
      >
        <Container>
          <div className="mx-auto max-w-fit max-h-screen lg:mx-0 lg:max-w-fit">
            <h2 className="text-3xl font-medium tracking-tight text-white">
              Privacy policy
            </h2>
            <p className="mt-2 text-lg text-gray-400">
              To improve the performance of AdMob, the Google Mobile Ads SDK may collect certain information from apps, including:
              <ul class="list-disc">
                <li>IP address, which may be used to estimate the general location of a device.</li>
              </ul>
              <ul class="list-disc">
                <li>Non-user related crash logs, which may be used to diagnose problems and improve the SDK. Diagnostic information may also be used for advertising and analytics purposes.</li>
              </ul>
              <ul class="list-disc">
                <li>User-associated performance data such as app launch time, hang rate, or energy usage, which may be used to evaluate user behavior, understand the effectiveness of existing product features, and plan new features. Performance data may also be used for displaying ads, including sharing with other entities that display ads.</li>
              </ul>
              <ul class="list-disc">
                <li>A Device ID, such as the device's advertising identifier or other app- or developer-bounded device identifiers, which may be used for the purpose of third-party advertising and analytics.</li>
              </ul>
              <ul class="list-disc">
                <li>Advertising data, such as advertisements the user has seen, may be used to power analytics and advertising features.</li>
              </ul>
              <ul class="list-disc">
                <li>Other user product interactions like app launch taps, and interaction information, like video views, may be used to improve advertising performance.</li>
              </ul>
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
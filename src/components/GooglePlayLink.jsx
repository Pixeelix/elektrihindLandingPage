import Link from 'next/link'
import Image from 'next/image'
import googlePlayImage from '@/images/google-play-badge.png'

export function GooglePlayLink() {
  return (
    <Link
      href="https://play.google.com/store/apps/details?id=com.saarsen.elektrihind&hl=et&fbclid=IwAR2hIsXvmU-FEfJWy38OYumZ5IncUigGzwbknhKNOSNYehc7BglUl6GTQco"
      aria-label="Laadi alla Google Playst"
    >
      <Image
        src={googlePlayImage}
        alt="Get it on Google Play"
        className="Google Play Logo"
        style={{ width: 140, height: 40 }}
      />
    </Link>
  )
}

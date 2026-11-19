// Locales live under app/[lang]. English is served without a prefix:
//   /creators        -> app/[lang=en]/creators
//   /ko/creators     -> app/[lang=ko]/creators
// Creator profiles use the public URL /@handle, which Next can't express as a
// folder name ("@" means a parallel route), so it rewrites to /profile/handle.
const OTHER = 'ko|ja|zh|vi'
const NOT_REWRITTEN = `(?!(?:en|${OTHER})(?:/|$)|_next/|og/|sitemaps/|media/|.*\\.(?:xml|txt|png|jpg|jpeg|svg|ico|webp|avif|woff2|json|webmanifest)$)`

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async rewrites() {
    return {
      beforeFiles: [
        { source: `/:lang(${OTHER})/@:handle`, destination: '/:lang/profile/:handle' },
        { source: '/@:handle', destination: '/en/profile/:handle' },
        { source: '/', destination: '/en' },
        { source: `/:path(${NOT_REWRITTEN}.*)`, destination: '/en/:path' },
      ],
    }
  },
  async redirects() {
    return [
      // one URL per page: the English prefix and the internal profile path never show
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/profile/:handle', destination: '/@:handle', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      // 301 map from the current megaevolution.io URLs — keep in sync with REDIRECTS.md
      { source: '/search', destination: '/creators', permanent: true },
      { source: '/about', destination: '/about-agency', permanent: true },
      { source: '/about-platform', destination: '/tools', permanent: true },
      { source: '/about-creator', destination: '/for-creators', permanent: true },
      { source: '/request-campaign', destination: '/about-agency#inquiry', permanent: true },
      { source: '/business-inquiry', destination: '/about-agency#inquiry', permanent: true },
      { source: '/help-center', destination: '/help', permanent: true },
      { source: '/help-center/:slug*', destination: '/help/:slug*', permanent: true },
      { source: '/support', destination: '/help', permanent: true },
      { source: '/creator-registration', destination: '/signup?as=creator', permanent: true },
      { source: '/blog/post', destination: '/blog', permanent: true },
      { source: '/terms-and-conditions', destination: '/help/terms', permanent: true },
      { source: '/privacy-policy', destination: '/help/privacy', permanent: true },
      { source: '/cookie-policy', destination: '/help/cookies', permanent: true },
    ]
  },
}

export default config

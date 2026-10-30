import { messages, type Language } from '../../i18n/messages'

export type SitePage = 'contact' | 'privacy'

interface SiteNavProps {
  language: Language
  current?: SitePage
  className?: string
}

export function SiteNav({ className, current, language }: SiteNavProps) {
  const t = messages[language]
  const links: Array<{ page: SitePage; href: string; label: string }> = [
    { page: 'contact', href: '/contact', label: t.contact },
    { page: 'privacy', href: '/privacy', label: t.privacyPolicy },
  ]

  return (
    <nav className={className ? `site-nav ${className}` : 'site-nav'}>
      {links.map(({ page, href, label }) => (
        <a aria-current={current === page ? 'page' : undefined} href={href} key={page}>
          {label}
        </a>
      ))}
    </nav>
  )
}

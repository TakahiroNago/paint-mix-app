import type { ReactNode } from 'react'
import { SiteLogo } from './SiteLogo'
import { SiteMenu } from './SiteMenu'
import { SiteNav, type SitePage } from './SiteNav'
import { messages, type Language } from '../../i18n/messages'
import './site.css'
import './SubPageLayout.css'

interface SubPageLayoutProps {
  current: SitePage
  language: Language
  onLanguageChange: (language: Language) => void
  children: ReactNode
}

export function SubPageLayout({ children, current, language, onLanguageChange }: SubPageLayoutProps) {
  const t = messages[language]

  return (
    <div className="site sub-page">
      <header className="sub-page__header">
        <SiteLogo />
        <a className="sub-page__back" href="/">
          <span aria-hidden="true">←</span>
          {t.backToMixer}
        </a>
        <SiteNav className="sub-page__nav" current={current} language={language} />
        <SiteMenu language={language} onLanguageChange={onLanguageChange} />
      </header>
      <main className="sub-page__main">{children}</main>
      <footer className="sub-page__footer">
        <SiteNav current={current} language={language} />
      </footer>
    </div>
  )
}

import { messages } from '../../i18n/messages'
import { useMixerPreferences } from '../mixer/useMixerPreferences'
import './PrivacyPolicyPage.css'

function PrivacyPolicyPage() {
  const { language } = useMixerPreferences()
  const t = messages[language]
  const sections = [
    { title: t.privacyLocalStorageTitle, description: t.privacyLocalStorageDescription },
    { title: t.privacyContactTitle, description: t.privacyContactDescription },
    { title: t.privacyDisclosureTitle, description: t.privacyDisclosureDescription },
    { title: t.privacyChangesTitle, description: t.privacyChangesDescription },
  ]

  return (
    <main className="privacy-page">
      <header className="privacy-page__header">
        <a aria-label={t.backToMixer} className="privacy-page__brand" href="/">
          Paint Mix 🎨
        </a>
      </header>

      <article aria-labelledby="privacy-title" className="privacy-page__card">
        <h1 id="privacy-title">{t.privacyTitle}</h1>
        <p>{t.privacyIntro}</p>

        {sections.map(({ title, description }) => (
          <section className="privacy-page__section" key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </section>
        ))}

        <section className="privacy-page__section">
          <h2>{t.privacyMixboxTitle}</h2>
          <p>{t.privacyMixboxDescription}</p>
          <p className="privacy-page__references">
            <a href="https://scrtwpns.com/mixbox/" rel="noopener noreferrer" target="_blank">
              Mixbox
            </a>
            {' · '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t.mixboxLicense}
            </a>
          </p>
        </section>

        <p className="privacy-page__operator">
          {t.operator}: Art Full Stack
        </p>
        <a className="privacy-page__back" href="/">
          {t.backToMixer}
        </a>
      </article>
    </main>
  )
}

export default PrivacyPolicyPage

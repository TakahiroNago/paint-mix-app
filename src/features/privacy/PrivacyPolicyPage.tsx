import { messages } from '../../i18n/messages'
import { SubPageLayout } from '../layout/SubPageLayout'
import { useMixerPreferences } from '../mixer/useMixerPreferences'
import './PrivacyPolicyPage.css'

const MIXBOX_COPYRIGHT = 'Copyright (c) 2022, Secret Weapons. All rights reserved.'

function PrivacyPolicyPage() {
  const { language, changeLanguage } = useMixerPreferences()
  const t = messages[language]
  const sections = [
    { id: 'browser', title: t.privacyLocalStorageTitle, description: t.privacyLocalStorageDescription },
    { id: 'mail', title: t.privacyContactTitle, description: t.privacyContactDescription },
    { id: 'third-party', title: t.privacyDisclosureTitle, description: t.privacyDisclosureDescription },
    { id: 'changes', title: t.privacyChangesTitle, description: t.privacyChangesDescription },
  ]
  const contents = [...sections, { id: 'mixbox', title: t.privacyMixboxTitle }]

  return (
    <SubPageLayout current="privacy" language={language} onLanguageChange={changeLanguage}>
      <article aria-labelledby="privacy-title" className="privacy">
        <h1 className="sub-page__title privacy__title" id="privacy-title">
          {t.privacyTitle}
        </h1>
        <p className="sub-page__text privacy__lead">{t.privacyIntro}</p>

        <nav aria-labelledby="privacy-contents" className="privacy__contents">
          <h2 id="privacy-contents">{t.tableOfContents}</h2>
          <ol>
            {contents.map(({ id, title }) => (
              <li key={id}>
                <a href={`#privacy-${id}`}>
                  {title}
                  <span aria-hidden="true">↓</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="privacy__body">
          {sections.map(({ id, title, description }) => (
            <section className="privacy__section" id={`privacy-${id}`} key={id}>
              <h2>{title}</h2>
              <p className="sub-page__text">{description}</p>
            </section>
          ))}

          <section className="privacy__section" id="privacy-mixbox">
            <h2>{t.privacyMixboxTitle}</h2>
            <p className="sub-page__text">{t.privacyMixboxDescription}</p>
            <div className="privacy__credit">
              <p>{MIXBOX_COPYRIGHT}</p>
              <div className="privacy__credit-links">
                <a href="https://scrtwpns.com/mixbox/" rel="noopener noreferrer" target="_blank">
                  Mixbox <span aria-hidden="true">↗</span>
                </a>
                <a
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {t.mixboxLicense} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>

          <dl className="sub-page__operator privacy__operator">
            <dt>{t.operator}</dt>
            <dd>Art Full Stack</dd>
          </dl>
        </div>
      </article>
    </SubPageLayout>
  )
}

export default PrivacyPolicyPage

import { messages } from '../../i18n/messages'
import { useMixerPreferences } from '../mixer/useMixerPreferences'
import './ContactPage.css'

const CONTACT_EMAIL = 'artfullstack@gmail.com'
const OPERATOR_NAME = 'Art Full Stack'

function ContactPage() {
  const { language } = useMixerPreferences()
  const t = messages[language]

  return (
    <main className="contact-page">
      <header className="contact-page__header">
        <a aria-label={t.backToMixer} className="contact-page__brand" href="/">
          Paint Mix 🎨
        </a>
      </header>

      <section aria-labelledby="contact-title" className="contact-page__card">
        <h1 id="contact-title">{t.contactTitle}</h1>
        <p>{t.contactDescription}</p>

        <dl className="contact-page__details">
          <div>
            <dt>{t.email}</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </dd>
          </div>
          <div>
            <dt>{t.operator}</dt>
            <dd>{OPERATOR_NAME}</dd>
          </div>
        </dl>

        <a className="contact-page__back" href="/">
          {t.backToMixer}
        </a>
      </section>
    </main>
  )
}

export default ContactPage

import { messages } from '../../i18n/messages'
import { SubPageLayout } from '../layout/SubPageLayout'
import { useCopyToClipboard } from '../layout/useCopyToClipboard'
import { useMixerPreferences } from '../mixer/useMixerPreferences'
import './ContactPage.css'

const CONTACT_EMAIL = 'artfullstack@gmail.com'
const OPERATOR_NAME = 'Art Full Stack'

function ContactPage() {
  const { language, changeLanguage } = useMixerPreferences()
  const { copied, copy } = useCopyToClipboard()
  const t = messages[language]

  return (
    <SubPageLayout current="contact" language={language} onLanguageChange={changeLanguage}>
      <div className="contact">
        <h1 className="sub-page__title contact__title">{t.contactTitle}</h1>
        <p className="sub-page__text contact__lead">{t.contactDescription}</p>

        <section aria-labelledby="contact-email" className="contact__card">
          <h2 className="contact__label" id="contact-email">
            {t.email}
          </h2>
          <p className="contact__address">{CONTACT_EMAIL}</p>
          <a className="contact__send" href={`mailto:${CONTACT_EMAIL}`}>
            {t.sendEmail}
          </a>
          <button className="contact__copy" onClick={() => void copy(CONTACT_EMAIL)} type="button">
            <span aria-live="polite">{copied ? t.copied : t.copyAddress}</span>
          </button>
        </section>

        <dl className="sub-page__operator contact__operator">
          <dt>{t.operator}</dt>
          <dd>{OPERATOR_NAME}</dd>
        </dl>
      </div>
    </SubPageLayout>
  )
}

export default ContactPage

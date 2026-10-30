import MixerPage from './features/mixer/MixerPage'
import ContactPage from './features/contact/ContactPage'
import PrivacyPolicyPage from './features/privacy/PrivacyPolicyPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '')

  if (pathname.endsWith('/contact')) {
    return <ContactPage />
  }

  if (pathname.endsWith('/privacy')) {
    return <PrivacyPolicyPage />
  }

  return <MixerPage />
}

export default App

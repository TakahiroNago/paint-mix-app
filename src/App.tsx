import TwoColorMixerPage from './features/mixer/TwoColorMixerPage'
import MultiColorMixerPage from './features/mixer/MultiColorMixerPage'
import ContactPage from './features/contact/ContactPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '')

  if (pathname.endsWith('/contact')) {
    return <ContactPage />
  }

  if (pathname.endsWith('/more')) {
    return <MultiColorMixerPage />
  }

  return <TwoColorMixerPage />
}

export default App

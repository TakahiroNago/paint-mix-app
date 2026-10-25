import TwoColorMixerPage from './features/mixer/TwoColorMixerPage'
import MultiColorMixerPage from './features/mixer/MultiColorMixerPage'

function App() {
  if (window.location.pathname.replace(/\/+$/, '').endsWith('/more')) {
    return <MultiColorMixerPage />
  }

  return <TwoColorMixerPage />
}

export default App

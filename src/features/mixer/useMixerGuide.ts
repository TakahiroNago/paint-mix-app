import { useEffect, useState } from 'react'

export type MixerGuideStep = 'colors' | 'ratio' | 'result'

interface MixerGuideOptions {
  hasResultStep: boolean
}

function readTouched(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === 'true'
  } catch (error) {
    console.warn(`Could not read the ${key} guide preference.`, error)
    return false
  }
}

function saveTouched(key: string) {
  try {
    window.localStorage.setItem(key, 'true')
  } catch (error) {
    console.error(`Could not save the ${key} guide preference.`, error)
  }
}

export function useMixerGuide({ hasResultStep }: MixerGuideOptions) {
  const [colorsTouched, setColorsTouched] = useState(() => readTouched('touched'))
  const [ratiosTouched, setRatiosTouched] = useState(() => readTouched('touchedR'))
  const [resultTouched, setResultTouched] = useState(() => readTouched('touchedM'))
  const [visibleStep, setVisibleStep] = useState<MixerGuideStep | null>(null)

  const currentStep: MixerGuideStep | null = !colorsTouched
    ? 'colors'
    : !ratiosTouched
      ? 'ratio'
      : hasResultStep && !resultTouched
        ? 'result'
        : null

  useEffect(() => {
    if (!currentStep) {
      return
    }

    const timer = window.setTimeout(() => setVisibleStep(currentStep), 3000)
    return () => window.clearTimeout(timer)
  }, [currentStep])

  function markColorsTouched() {
    if (!colorsTouched) {
      setColorsTouched(true)
      saveTouched('touched')
    }
  }

  function markRatiosTouched() {
    if (!ratiosTouched) {
      setRatiosTouched(true)
      saveTouched('touchedR')
    }
  }

  function markResultTouched() {
    if (!resultTouched) {
      setResultTouched(true)
      saveTouched('touchedM')
    }
  }

  function dismissCurrentStep() {
    if (currentStep === 'colors') {
      markColorsTouched()
    } else if (currentStep === 'ratio') {
      markRatiosTouched()
    } else if (currentStep === 'result') {
      markResultTouched()
    }
  }

  return {
    visibleStep: visibleStep === currentStep ? visibleStep : null,
    markColorsTouched,
    markRatiosTouched,
    markResultTouched,
    dismissCurrentStep,
  }
}

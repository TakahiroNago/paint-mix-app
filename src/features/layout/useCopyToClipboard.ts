import { useEffect, useState } from 'react'

/** Copies text and reports `copied` for a moment so the button label can confirm it. */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (error) {
      console.warn('Could not copy to the clipboard.', error)
    }
  }

  return { copied, copy }
}

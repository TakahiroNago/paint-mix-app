// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import MultiColorMixerPage from './MultiColorMixerPage'
import TwoColorMixerPage from './TwoColorMixerPage'

vi.mock('../../domain/mixbox', () => ({
  loadMixbox: vi.fn(async () => ({
    lerp: (_color1: string, _color2: string, amount: number) =>
      `rgb(${Math.round(amount * 255)}, 0, 0)`,
  })),
}))

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem('lang', 'en')
  window.localStorage.setItem('nameDisp', 'true')
  window.localStorage.setItem('touched', 'true')
  window.localStorage.setItem('touchedR', 'true')
  window.localStorage.setItem('touchedM', 'true')
})

afterEach(() => {
  cleanup()
})

describe('TwoColorMixerPage', () => {
  it('selects a palette color and updates the mix when its ratio changes', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    const ratio = await screen.findByRole('slider', { name: 'Mix Ratio' })
    expect(ratio).toHaveValue('10')
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Select from Mixed Colors' }).getAttribute('style'),
      ).toContain('rgb(128, 0, 0)'),
    )

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    await user.click(within(palette).getByRole('button', { name: 'Cadmium Red' }))

    expect(screen.getByRole('button', { name: 'Select Color 1: Cadmium Red' })).toBeInTheDocument()
    fireEvent.change(ratio, { target: { value: '15' } })
    expect(ratio).toHaveValue('15')
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Select from Mixed Colors' }).getAttribute('style'),
      ).toContain('rgb(191, 0, 0)'),
    )
  })

  it('opens premixed colors and updates the selected pair', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await screen.findByRole('button', { name: 'Select from Mixed Colors' })
    await user.click(screen.getByRole('button', { name: 'Select from Mixed Colors' }))
    const dialog = screen.getByRole('dialog', { name: 'Select from Mixed Colors' })
    await user.click(
      within(dialog).getByRole('button', { name: 'Cadmium Yellow + Hansa Yellow' }),
    )

    expect(screen.getByRole('button', { name: 'Select Color 1: Cadmium Yellow' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Color 2: Hansa Yellow' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Mix Ratio' })).toHaveValue('10')
  })

  it('changes language and opens the license dialog', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await user.click(screen.getByRole('button', { name: 'Options' }))
    await user.click(screen.getByRole('button', { name: '日本語' }))
    expect(screen.getByRole('slider', { name: '混合比' })).toBeInTheDocument()
    expect(window.localStorage.getItem('lang')).toBe('ja')

    await user.click(screen.getByRole('button', { name: 'ライセンス' }))
    const dialog = screen.getByRole('dialog', { name: 'ライセンス' })
    expect(within(dialog).getByText(/非営利目的のみ/)).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

describe('MultiColorMixerPage', () => {
  it('updates an individual color ratio and toggles breakdown display', async () => {
    const user = userEvent.setup()
    render(<MultiColorMixerPage />)

    const firstRatio = await screen.findByRole('slider', { name: 'Color 1 ratio' })
    expect(firstRatio).toHaveValue('10')
    fireEvent.change(firstRatio, { target: { value: '4' } })
    expect(firstRatio).toHaveValue('4')

    await user.click(screen.getByRole('button', { name: 'Options' }))
    await user.click(screen.getByRole('button', { name: 'Break Down' }))
    expect(screen.getByLabelText('Paint ratio breakdown')).toBeInTheDocument()
    expect(screen.getByLabelText('Final five-color result')).toBeInTheDocument()
  })

  it('allows selecting the fifth color from the palette', async () => {
    const user = userEvent.setup()
    render(<MultiColorMixerPage />)

    await screen.findByRole('slider', { name: 'Fifth color ratio' })
    await user.click(screen.getByRole('button', { name: /Select Color 5:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 5' })
    await user.click(within(palette).getByRole('button', { name: 'Mars Black' }))

    expect(screen.getByRole('button', { name: 'Select Color 5: Mars Black' })).toBeInTheDocument()
  })
})

describe('app navigation', () => {
  it('renders the multi-color page for the /more path', async () => {
    window.history.pushState({}, '', '/more')
    render(<App />)

    expect(await screen.findByRole('slider', { name: 'Fifth color ratio' })).toBeInTheDocument()
    const backLinks = screen.getAllByRole('link', { name: 'Back to two-color mixer' })
    expect(backLinks[0]).toHaveAttribute('href', '/')
    window.history.pushState({}, '', '/')
  })
})

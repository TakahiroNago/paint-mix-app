// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import MultiColorMixerPage from './MultiColorMixerPage'
import TwoColorMixerPage from './TwoColorMixerPage'
import { getHueOrderFromYellow } from './mixerUtils'

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
    expect(screen.getByRole('button', { name: 'Select from Mixed Colors' })).toBeEmptyDOMElement()

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    expect(within(palette).queryByText('Custom Color', { selector: 'label' })).not.toBeInTheDocument()
    expect(within(palette).getByRole('button', { name: 'Custom Color' })).toBeInTheDocument()
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

  it('lists pigment and white mixes in hue order starting from yellow', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await user.click(screen.getByRole('button', { name: 'Select from Mixed Colors' }))
    const dialog = screen.getByRole('dialog', { name: 'Select from Mixed Colors' })
    const swatches = within(dialog).getAllByRole('button').filter((button) => button.title)
    expect(swatches).toHaveLength(120)
    expect(swatches.some((swatch) => swatch.title.includes('Titanium White'))).toBe(true)

    const hueOrders = swatches.map((swatch) => {
      const backgroundColor = swatch.style.backgroundColor
      const hue = getHueOrderFromYellow(backgroundColor)
      return hue < 1 ? 0 : hue
    })
    expect(hueOrders).toEqual([...hueOrders].sort((first, second) => first - second))
  })

  it('remembers the custom color in the palette after closing it', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    const colorInput = within(palette).getByLabelText('Custom Color')
    fireEvent.change(colorInput, { target: { value: '#123456' } })
    const customColorButton = within(palette).getByRole('button', { name: 'Custom Color' })
    expect(customColorButton).toHaveStyle({
      backgroundColor: 'rgb(18, 52, 86)',
      color: 'rgb(255, 255, 255)',
    })
    await user.click(within(palette).getByRole('button', { name: 'Close' }))

    await user.click(screen.getByRole('button', { name: /Select Color 2:/ }))
    expect(
      within(screen.getByRole('dialog', { name: 'Palette 2' })).getByLabelText('Custom Color'),
    ).toHaveValue('#123456')
    expect(window.localStorage.getItem('twoColorCustomColor')).toBe('#123456')
  })

  it('shows palette colors in hue order starting with yellow', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    const swatches = within(palette).getAllByRole('button').filter((button) => button.title)
    expect(swatches[0]).toHaveAccessibleName('Hansa Yellow')
    const hueOrders = swatches.map((swatch) => getHueOrderFromYellow(swatch.style.backgroundColor))
    expect(hueOrders).toEqual([...hueOrders].sort((first, second) => first - second))
  })

  it('shows ratio values as percentages', async () => {
    render(<TwoColorMixerPage />)

    const ratio = await screen.findByRole('slider', { name: 'Mix Ratio' })
    expect(ratio).toHaveAttribute('aria-valuetext', 'Color 1 50% : Color 2 50%')
    fireEvent.change(ratio, { target: { value: '15' } })
    expect(ratio).toHaveAttribute('aria-valuetext', 'Color 1 25% : Color 2 75%')
    expect(screen.getByText('Color 1 25% : Color 2 75%')).toBeInTheDocument()

    const white = screen.getByRole('slider', { name: 'Mix with White' })
    fireEvent.change(white, { target: { value: '4' } })
    expect(white).toHaveAttribute('aria-valuetext', 'White 20%')
  })

  it('shows and copies the mixed color code', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    expect(await screen.findAllByText('#800000')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Copy color code of Mixed color' }))
    await expect(navigator.clipboard.readText()).resolves.toBe('#800000')
    expect(
      screen.getByRole('button', { name: 'Copy color code of Mixed color' }),
    ).toHaveTextContent('Copied')
  })

  it('closes dialogs with Escape and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    const opener = screen.getByRole('button', { name: /Select Color 1:/ })
    await user.click(opener)
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    expect(palette).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Palette 1' })).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('keeps keyboard focus inside an open dialog', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    await user.tab({ shift: true })
    expect(within(palette).getByRole('button', { name: 'Custom Color' })).toHaveFocus()
    await user.tab()
    expect(within(palette).getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('closes the options menu with Escape or an outside click', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    const menuButton = screen.getByRole('button', { name: 'Options' })
    await user.click(menuButton)
    expect(screen.getByRole('region', { name: 'Options' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'Options' })).not.toBeInTheDocument()
    expect(menuButton).toHaveFocus()

    await user.click(menuButton)
    await user.click(screen.getByRole('slider', { name: 'Mix Ratio' }))
    expect(screen.queryByRole('region', { name: 'Options' })).not.toBeInTheDocument()
  })

  it('changes language without showing a license option in the menu', async () => {
    const user = userEvent.setup()
    render(<TwoColorMixerPage />)

    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    await user.click(screen.getByRole('button', { name: 'Options' }))
    expect(screen.queryByRole('button', { name: 'License' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '日本語' }))
    expect(screen.getByRole('slider', { name: '混合比' })).toBeInTheDocument()
    expect(window.localStorage.getItem('lang')).toBe('ja')
    expect(screen.queryByRole('button', { name: 'ライセンス' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'プライバシーポリシー' })).toHaveAttribute(
      'href',
      '/privacy',
    )
  })
})

describe('MultiColorMixerPage', () => {
  it('hides zero-ratio color dots and keeps one plus between each visible dot', async () => {
    const { container } = render(<MultiColorMixerPage />)

    const equation = container.querySelector('.multi-mix__equation')
    expect(equation).not.toBeNull()
    const zeroFirst = screen.getByRole('slider', { name: 'Color 1 ratio' })
    const zeroThird = screen.getByRole('slider', { name: 'Color 3 ratio' })
    fireEvent.change(zeroFirst, { target: { value: '0' } })
    fireEvent.change(zeroThird, { target: { value: '0' } })

    expect(equation?.querySelectorAll('.multi-mix__source-dot')).toHaveLength(2)
    expect(equation?.querySelectorAll('.multi-mix__equation-plus')).toHaveLength(1)

    fireEvent.change(screen.getByRole('slider', { name: 'Color 2 ratio' }), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByRole('slider', { name: 'Color 4 ratio' }), {
      target: { value: '0' },
    })
    expect(equation?.querySelectorAll('.multi-mix__source-dot')).toHaveLength(0)
    expect(equation?.querySelectorAll('.multi-mix__equation-plus')).toHaveLength(0)
  })

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

  it('uses the same remembered custom color palette as the two-color mixer', async () => {
    const user = userEvent.setup()
    render(<MultiColorMixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    expect(within(palette).queryByText('Custom Color', { selector: 'label' })).not.toBeInTheDocument()
    fireEvent.change(within(palette).getByLabelText('Custom Color'), {
      target: { value: '#123456' },
    })
    expect(within(palette).getByRole('button', { name: 'Custom Color' })).toHaveStyle({
      backgroundColor: 'rgb(18, 52, 86)',
      color: 'rgb(255, 255, 255)',
    })
    await user.click(within(palette).getByRole('button', { name: 'Custom Color' }))
    expect(screen.getByRole('button', { name: 'Select Color 1: Custom Color' })).toBeInTheDocument()
    expect(window.localStorage.getItem('twoColorCustomColor')).toBe('#123456')

    await user.click(screen.getByRole('button', { name: /Select Color 2:/ }))
    expect(
      within(screen.getByRole('dialog', { name: 'Palette 2' })).getByLabelText('Custom Color'),
    ).toHaveValue('#123456')
  })

  it('shows palette colors in hue order starting with yellow', async () => {
    const user = userEvent.setup()
    render(<MultiColorMixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const palette = screen.getByRole('dialog', { name: 'Palette 1' })
    const swatches = within(palette).getAllByRole('button').filter((button) => button.title)
    expect(swatches[0]).toHaveAccessibleName('Hansa Yellow')
    const hueOrders = swatches.map((swatch) => getHueOrderFromYellow(swatch.style.backgroundColor))
    expect(hueOrders).toEqual([...hueOrders].sort((first, second) => first - second))
  })
})

describe('app navigation', () => {
  it('renders the contact page for the /contact path', () => {
    window.localStorage.setItem('lang', 'ja')
    window.history.pushState({}, '', '/contact')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'お問い合わせについて' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'artfullstack@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:artfullstack@gmail.com',
    )
    expect(screen.getByText('Art Full Stack')).toBeInTheDocument()

    window.history.pushState({}, '', '/')
  })

  it('renders the privacy policy for the /privacy path', () => {
    window.localStorage.setItem('lang', 'ja')
    window.history.pushState({}, '', '/privacy')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'プライバシーポリシー' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ブラウザーに保存する情報' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '情報の第三者提供' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mixboxのライセンスと著作権表示' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'CC BY-NC 4.0ライセンス' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by-nc/4.0/',
    )

    window.history.pushState({}, '', '/')
  })

  it('renders the multi-color page for the /more path', async () => {
    window.history.pushState({}, '', '/more')
    render(<App />)

    expect(await screen.findByRole('slider', { name: 'Fifth color ratio' })).toBeInTheDocument()
    const backLinks = screen.getAllByRole('link', { name: 'Back to two-color mixer' })
    expect(backLinks[0]).toHaveAttribute('href', '/')
    window.history.pushState({}, '', '/')
  })
})

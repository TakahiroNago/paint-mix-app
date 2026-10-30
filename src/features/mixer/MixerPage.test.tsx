// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import MixerPage from './MixerPage'
import { getHueOrderFromYellow } from './mixerUtils'

vi.mock('../../domain/mixbox', () => ({
  // Averages RGB by weight so results are predictable hex colors.
  loadMixbox: vi.fn(async () => ({
    mix: (colors: string[], weights: number[]) => {
      const total = weights.reduce((sum, weight) => sum + weight, 0)
      const channels = [1, 3, 5].map((offset) =>
        Math.round(
          colors.reduce(
            (sum, color, index) =>
              sum + Number.parseInt(color.slice(offset, offset + 2), 16) * weights[index],
            0,
          ) / total,
        ),
      )
      return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
    },
  })),
}))

function getResultHex() {
  const result = screen.getByRole('region', { name: 'Mixed color' })
  return result.querySelector('.result__hex')?.textContent
}

beforeEach(() => {
  window.localStorage.clear()
  window.localStorage.setItem('lang', 'en')
  window.history.pushState({}, '', '/')
})

afterEach(() => {
  cleanup()
})

describe('two-color mixing', () => {
  it('shows the mix ratio and updates the result when it changes', async () => {
    render(<MixerPage />)

    const ratio = await screen.findByRole('slider', { name: 'Mix Ratio' })
    expect(await screen.findByText('#BDBC8D')).toBeInTheDocument()
    expect(ratio).toHaveAttribute('aria-valuetext', 'Color 1 50%, Color 2 50%')
    expect(screen.getByText('50 : 50')).toBeInTheDocument()

    fireEvent.change(ratio, { target: { value: '15' } })
    expect(screen.getByText('25 : 75')).toBeInTheDocument()
    expect(ratio).toHaveAttribute('aria-valuetext', 'Color 1 25%, Color 2 75%')
    expect(getResultHex()).not.toBe('#BDBC8D')
  })

  it('steps the sliders with the − and + buttons within range', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    const white = await screen.findByRole('slider', { name: 'Mix with White' })
    await user.click(screen.getByRole('button', { name: 'Mix with White +' }))
    expect(white).toHaveValue('11')
    fireEvent.change(white, { target: { value: '20' } })
    await user.click(screen.getByRole('button', { name: 'Mix with White +' }))
    expect(white).toHaveValue('20')
    await user.click(screen.getByRole('button', { name: 'Mix with White −' }))
    expect(white).toHaveValue('19')
  })

  it('shows a whole-number recipe including white', async () => {
    render(<MixerPage />)

    expect(await screen.findByText('1 : 1 + White 2')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('slider', { name: 'Mix with White' }), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByRole('slider', { name: 'Mix Ratio' }), {
      target: { value: '7' },
    })
    expect(screen.getByText('13 : 7')).toBeInTheDocument()
  })

  it('copies the final hex color', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await screen.findByText('#BDBC8D')
    await user.click(screen.getByRole('button', { name: 'Copy HEX' }))
    await expect(navigator.clipboard.readText()).resolves.toBe('#BDBC8D')
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('selects a paint from the picker', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const picker = screen.getByRole('dialog', { name: 'Choose a paint' })
    expect(within(picker).getByRole('button', { name: 'Cadmium Yellow' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await user.click(within(picker).getByRole('button', { name: 'Cadmium Red' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Color 1: Cadmium Red' })).toBeInTheDocument()
  })

  it('lists paints in hue order starting with yellow', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const picker = screen.getByRole('dialog', { name: 'Choose a paint' })
    const paints = Array.from(picker.querySelectorAll<HTMLElement>('.paint-picker__paint'))
    expect(paints[0]).toHaveAccessibleName('Hansa Yellow')
    const hueOrders = paints.map((paint) =>
      getHueOrderFromYellow(
        paint.querySelector<HTMLElement>('.paint-picker__swatch')!.style.backgroundColor,
      ),
    )
    expect(hueOrders).toEqual([...hueOrders].sort((first, second) => first - second))
  })

  it('remembers and uses the custom color', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    let picker = screen.getByRole('dialog', { name: 'Choose a paint' })
    fireEvent.change(within(picker).getByLabelText('Custom Color'), {
      target: { value: '#123456' },
    })
    expect(within(picker).getByRole('button', { name: 'Use this color' })).toHaveStyle({
      backgroundColor: 'rgb(18, 52, 86)',
      color: 'rgb(255, 255, 255)',
    })
    await user.click(within(picker).getByRole('button', { name: 'Close' }))
    expect(window.localStorage.getItem('twoColorCustomColor')).toBe('#123456')

    await user.click(screen.getByRole('button', { name: /Select Color 2:/ }))
    picker = screen.getByRole('dialog', { name: 'Choose a paint' })
    expect(within(picker).getByLabelText('Custom Color')).toHaveValue('#123456')
    await user.click(within(picker).getByRole('button', { name: 'Use this color' }))
    expect(screen.getByRole('button', { name: 'Select Color 2: Custom Color' })).toBeInTheDocument()
  })

  it('selects a premixed pair and resets the ratio', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    const ratio = await screen.findByRole('slider', { name: 'Mix Ratio' })
    fireEvent.change(ratio, { target: { value: '3' } })
    await user.click(screen.getByRole('button', { name: 'Pick a pair' }))
    const dialog = screen.getByRole('dialog', { name: 'Select from Mixed Colors' })
    const swatches = within(dialog).getAllByRole('button').filter((button) => button.title)
    expect(swatches).toHaveLength(120)
    const hueOrders = swatches.map((swatch) => {
      const hue = getHueOrderFromYellow(swatch.style.backgroundColor)
      return hue < 1 ? 0 : hue
    })
    expect(hueOrders).toEqual([...hueOrders].sort((first, second) => first - second))

    await user.click(within(dialog).getByRole('button', { name: 'Cadmium Yellow + Hansa Yellow' }))
    expect(screen.getByRole('button', { name: 'Select Color 1: Cadmium Yellow' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select Color 2: Hansa Yellow' })).toBeInTheDocument()
    expect(ratio).toHaveValue('10')
  })
})

describe('dialogs and menus', () => {
  it('closes dialogs with Escape and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    const opener = screen.getByRole('button', { name: /Select Color 1:/ })
    await user.click(opener)
    expect(screen.getByRole('dialog', { name: 'Choose a paint' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('keeps keyboard focus inside an open dialog', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 1:/ }))
    const picker = screen.getByRole('dialog', { name: 'Choose a paint' })
    await user.tab({ shift: true })
    expect(within(picker).getByRole('button', { name: 'Use this color' })).toHaveFocus()
    await user.tab()
    expect(within(picker).getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('changes language from the options menu and closes it with Escape or an outside click', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    const menuButton = screen.getByRole('button', { name: 'Options' })
    await user.click(menuButton)
    await user.click(screen.getByRole('button', { name: '日本語' }))
    expect(screen.getByRole('slider', { name: '混合比' })).toBeInTheDocument()
    expect(window.localStorage.getItem('lang')).toBe('ja')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('region', { name: 'オプション' })).not.toBeInTheDocument()
    expect(menuButton).toHaveFocus()

    await user.click(menuButton)
    await user.click(screen.getByRole('slider', { name: '混合比' }))
    expect(screen.queryByRole('region', { name: 'オプション' })).not.toBeInTheDocument()
  })
})

describe('four-color mixing', () => {
  it('switches modes with tabs and keeps the URL in sync', async () => {
    const user = userEvent.setup()
    render(<MixerPage />)

    await user.click(screen.getByRole('tab', { name: 'Mix 4 colors' }))
    expect(window.location.pathname).toBe('/more')
    expect(screen.getByRole('tab', { name: 'Mix 4 colors' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('slider', { name: 'Mix Ratio' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Pick a pair' })).not.toBeInTheDocument()

    act(() => {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(screen.getByRole('tab', { name: 'Mix 2 colors' })).toHaveAttribute('aria-selected', 'true')

    screen.getByRole('tab', { name: 'Mix 2 colors' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Mix 4 colors' })).toHaveFocus()
    expect(window.location.pathname).toBe('/more')
  })

  it('shows each paint share and updates the recipe', async () => {
    window.history.pushState({}, '', '/more')
    render(<MixerPage />)

    const first = await screen.findByRole('slider', { name: 'Amount of Color 1' })
    expect(first).toHaveAttribute('aria-valuetext', '25%')
    expect(await screen.findByText('1 : 1 : 1 : 1 + White 4')).toBeInTheDocument()

    fireEvent.change(first, { target: { value: '0' } })
    expect(first).toHaveAttribute('aria-valuetext', '0%')
    expect(screen.getByRole('slider', { name: 'Amount of Color 2' })).toHaveAttribute(
      'aria-valuetext',
      '33%',
    )
    expect(screen.getByText('0 : 1 : 1 : 1 + White 3')).toBeInTheDocument()
  })

  it('selects a paint for a four-color slot', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/more')
    render(<MixerPage />)

    await user.click(screen.getByRole('button', { name: /Select Color 3:/ }))
    await user.click(
      within(screen.getByRole('dialog', { name: 'Choose a paint' })).getByRole('button', {
        name: 'Mars Black',
      }),
    )
    expect(screen.getByRole('button', { name: 'Select Color 3: Mars Black' })).toBeInTheDocument()
  })
})

describe('app navigation', () => {
  it('renders the contact page with mail and copy actions', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem('lang', 'ja')
    window.history.pushState({}, '', '/contact')
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'お問い合わせ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '混色画面へ戻る' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'メールを送る' })).toHaveAttribute(
      'href',
      'mailto:artfullstack@gmail.com',
    )
    expect(screen.getByText('Art Full Stack')).toBeInTheDocument()
    for (const link of screen.getAllByRole('link', { name: 'お問い合わせ' })) {
      expect(link).toHaveAttribute('aria-current', 'page')
    }

    await user.click(screen.getByRole('button', { name: 'アドレスをコピー' }))
    await expect(navigator.clipboard.readText()).resolves.toBe('artfullstack@gmail.com')
    expect(screen.getByRole('button', { name: 'コピーしました' })).toBeInTheDocument()
  })

  it('renders the privacy policy with a table of contents', () => {
    window.localStorage.setItem('lang', 'ja')
    window.history.pushState({}, '', '/privacy')
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'プライバシーポリシー' })).toBeInTheDocument()
    const contents = screen.getByRole('navigation', { name: '目次' })
    const contentLinks = within(contents).getAllByRole('link')
    expect(contentLinks).toHaveLength(5)
    for (const link of contentLinks) {
      const section = document.querySelector(link.getAttribute('href')!)
      expect(section).not.toBeNull()
      expect(within(section as HTMLElement).getByRole('heading')).toHaveTextContent(
        link.textContent!.replace('↓', ''),
      )
    }
    expect(screen.getByText('Copyright (c) 2022, Secret Weapons. All rights reserved.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'CC BY-NC 4.0' })).toHaveAttribute(
      'href',
      'https://creativecommons.org/licenses/by-nc/4.0/',
    )
  })

  it('switches the sub-page language from the menu', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/privacy')
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Options' }))
    await user.click(screen.getByRole('button', { name: '日本語' }))
    expect(screen.getByRole('heading', { level: 1, name: 'プライバシーポリシー' })).toBeInTheDocument()
  })

  it('opens the four-color tab for the /more path', async () => {
    window.history.pushState({}, '', '/more')
    render(<App />)

    expect(screen.getByRole('tab', { name: 'Mix 4 colors' })).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByRole('slider', { name: 'Amount of Color 4' })).toBeInTheDocument()
  })
})

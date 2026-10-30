interface SiteLogoProps {
  /** Renders the logo as the page heading instead of a link back to the mixer. */
  heading?: boolean
}

export function SiteLogo({ heading = false }: SiteLogoProps) {
  const content = (
    <>
      <span aria-hidden="true" className="site-logo__mark">
        <span />
        <span />
        <span />
      </span>
      <span>
        <span className="site-logo__p">P</span>aint<span className="site-logo__m">M</span>ix
      </span>
    </>
  )

  return heading ? (
    <h1 className="site-logo">{content}</h1>
  ) : (
    <a className="site-logo" href="/">
      {content}
    </a>
  )
}

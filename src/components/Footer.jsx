const footerGroups = [
  {
    title: 'Platform',
    links: [
      ['Home', '/'],
      ['Report an Issue', '/report-complaint'],
      ['Explore Reports', '/explore-reports'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['How It Works', '/#track'],
      ['Contact Us', '/contact'],
    ],
  },
]

function Footer() {
  return <footer className="site-footer" id="about">
    <img className="site-footer-pattern" src="/pattern.png" alt="" aria-hidden="true" />
    <div className="site-footer-main">
      <div className="site-footer-brand">
        <a href="/" aria-label="JanSetu home">JANSETU</a>
        <p>Connecting Citizens.<br />Strengthening Communities.</p>
      </div>
      <nav className="site-footer-nav" aria-label="Footer navigation">
        {footerGroups.map(({ title, links }) => <div key={title}>
          <h2>{title}</h2>
          {links.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </div>)}
      </nav>
    </div>
    <div className="site-footer-bottom">
      <span>© 2026 JanSetu</span>
      <span>Digital Civic Governance Platform</span>
    </div>
  </footer>
}

export default Footer

import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--glass-border)', padding: '3rem 0 1rem', marginTop: 'auto' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl text-gradient mb-4" style={{ fontWeight: 900 }}>JobPlatform</h3>
            <p className="text-muted text-sm mb-4">
              Connecting talent with opportunity. Find your dream job today.
            </p>
            <div className="flex gap-4">
              {['Facebook', 'Twitter', 'LinkedIn'].map((social, index) => (
                <a key={index} href="#" className="text-secondary hover:text-primary" title={social}>
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg text-primary mb-4" style={{ fontWeight: 600 }}>Quick Links</h4>
            <ul className="flex flex-col gap-2" style={{ listStyle: 'none' }}>
              {[
                { to: '/', text: 'Home' },
                { to: '/advanced-search', text: 'Search Jobs' },
                { to: '/job-posting', text: 'Post a Job' },
                { to: '/saved', text: 'Saved Jobs' }
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="text-secondary hover:text-primary text-sm">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg text-primary mb-4" style={{ fontWeight: 600 }}>Contact</h4>
            <div className="text-secondary text-sm flex flex-col gap-2">
              <p>support@jobplatform.com</p>
              <p>+1 (555) 123-JOBS</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <p className="text-muted text-sm m-0">
            © 2026 JobPlatform. All rights reserved.
          </p>
          <div className="text-muted text-sm">
            Made with ❤️ by JobPlatform Team
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
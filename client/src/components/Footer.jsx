import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f0f0f 0%, #000000 100%)',
      borderTop: '1px solid #333',
      padding: '30px 20px 20px',
      position: 'relative',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 30,
        marginBottom: 25
      }}>
        {/* Company Info */}
        <div>
          <h3 style={{
            color: '#fbbf24',
            fontSize: 20,
            marginBottom: 12,
            fontWeight: 700
          }}>
            JobPlatform
          </h3>
          <p style={{
            color: '#a3a3a3',
            lineHeight: 1.5,
            marginBottom: 15,
            fontSize: 13
          }}>
            Connecting talent with opportunity. Find your dream job today.
          </p>

          {/* Social Media */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { name: 'Facebook', color: '#1877f2' },
              { name: 'Twitter', color: '#1da1f2' },
              { name: 'LinkedIn', color: '#0077b5' }
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                style={{
                  color: '#a3a3a3',
                  fontSize: 16,
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  padding: '6px',
                  borderRadius: '4px'
                }}
                onMouseOver={(e) => e.target.style.color = social.color}
                onMouseOut={(e) => e.target.style.color = '#a3a3a3'}
                title={social.name}
              >
                {social.name[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{
            color: '#ffffff',
            fontSize: 16,
            marginBottom: 15,
            fontWeight: 600
          }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { to: '/', text: 'Home' },
              { to: '/advanced-search', text: 'Search Jobs' },
              { to: '/job-posting', text: 'Post a Job' },
              { to: '/saved', text: 'Saved Jobs' }
            ].map((link, index) => (
              <li key={index} style={{ marginBottom: 6 }}>
                <Link
                  to={link.to}
                  style={{
                    color: '#a3a3a3',
                    textDecoration: 'none',
                    fontSize: 13,
                    transition: 'color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#fbbf24'}
                  onMouseOut={(e) => e.target.style.color = '#a3a3a3'}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            color: '#ffffff',
            fontSize: 16,
            marginBottom: 15,
            fontWeight: 600
          }}>
            Contact
          </h4>
          <div style={{ color: '#a3a3a3', lineHeight: 1.5 }}>
            <p style={{ margin: '0 0 6px 0', fontSize: 13 }}>
              support@jobplatform.com
            </p>
            <p style={{ margin: '0 0 6px 0', fontSize: 13 }}>
              +1 (555) 123-JOBS
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid #2a2a2a',
        paddingTop: 15,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <p style={{
          color: '#a3a3a3',
          fontSize: 12,
          margin: 0
        }}>
          © 2025 JobPlatform. All rights reserved.
        </p>

        <div style={{
          color: '#737373',
          fontSize: 11
        }}>
          Made with ❤️ by JobPlatform Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
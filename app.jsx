const { useState, useEffect, useMemo } = React;
const ReactMarkdown = window.ReactMarkdown;

// ============================================================================
// APP COMPONENT (with routing)
// ============================================================================
function App() {
  const [content, setContent] = useState(null);
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [darkMode, setDarkMode] = useState(false);
  const [isPrivateUnlocked, setIsPrivateUnlocked] = useState(false);

  useEffect(() => {
    fetch('content.json')
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(err => console.error('Failed to load content:', err));
    
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!content) {
    return <div className="loading">Loading portfolio...</div>;
  }

  const renderRoute = () => {
    const path = route.replace('#', '');
    
    if (path === '/' || path === '') {
      return <Home content={content} />;
    } else if (path === '/resume') {
      return <Resume content={content} />;
    } else if (path === '/memos') {
      return <Memos content={content} isPrivateUnlocked={isPrivateUnlocked} />;
    } else if (path.startsWith('/memos/')) {
      const slug = path.replace('/memos/', '');
      return <MemoDetail content={content} slug={slug} isPrivateUnlocked={isPrivateUnlocked} />;
    } else if (path === '/about') {
      return <About content={content} />;
    } else if (path === '/contact') {
      return <Contact content={content} />;
    } else if (path === '/private') {
      return <Private isPrivateUnlocked={isPrivateUnlocked} setIsPrivateUnlocked={setIsPrivateUnlocked} />;
    } else {
      return <NotFound />;
    }
  };

  return (
    <div className="app-container">
      <Nav content={content} darkMode={darkMode} setDarkMode={setDarkMode} isPrivateUnlocked={isPrivateUnlocked} />
      <main className="main-content">
        {renderRoute()}
      </main>
      <Footer content={content} />
    </div>
  );
}

// ============================================================================
// NAVIGATION
// ============================================================================
function Nav({ content, darkMode, setDarkMode, isPrivateUnlocked }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        <a href="#/" className="nav-brand">{content.site.name}</a>
        
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="#/" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#/resume" onClick={() => setMobileMenuOpen(false)}>Resume</a>
          <a href="#/memos" onClick={() => setMobileMenuOpen(false)}>Memos</a>
          <a href="#/about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#/contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          {isPrivateUnlocked && <span className="badge badge-success">Private Access</span>}
          <button 
            className="theme-toggle" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ============================================================================
// HOME PAGE
// ============================================================================
function Home({ content }) {
  const featuredMemos = content.memos
    .filter(m => m.status === 'Public')
    .sort((a, b) => new Date(b.date_published) - new Date(a.date_published))
    .slice(0, 3);

  const stats = [
    { label: 'Memos Published', value: content.memos.filter(m => m.status === 'Public').length },
    { label: 'Years Experience', value: calculateYearsExp(content.resume.experience) },
    { label: 'Sectors Covered', value: getUniqueSectors(content.memos).length }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero-title">{content.resume.headline}</h1>
        <ReactMarkdown className="hero-subtitle">{content.resume.summary_md}</ReactMarkdown>
        <div className="hero-cta">
          <a href="#/resume" className="btn btn-primary">View Resume</a>
          <a href="#/memos" className="btn btn-secondary">Explore Memos</a>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-memos">
        <h2>Featured Analysis</h2>
        <div className="memo-grid">
          {featuredMemos.map(memo => (
            <MemoCard key={memo.slug} memo={memo} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ============================================================================
// RESUME PAGE
// ============================================================================
function Resume({ content }) {
  const { resume } = content;

  return (
    <div className="resume-page">
      <div className="resume-header no-print">
        <h1>Resume</h1>
        <button className="btn btn-primary" onClick={() => window.print()}>
          📄 Download PDF
        </button>
      </div>

      <div className="resume-content">
        <div className="resume-header-print print-only">
          <h1>{content.site.name}</h1>
          <p className="resume-contact-print">
            {resume.contact_links.email} | {resume.contact_links.linkedin}
          </p>
        </div>

        <section className="resume-section">
          <h2>{resume.headline}</h2>
          <ReactMarkdown>{resume.summary_md}</ReactMarkdown>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <h3>{exp.title}</h3>
                  <p className="resume-company">{exp.company}</p>
                </div>
                <div className="resume-dates">
                  {formatDate(exp.start)} – {exp.end ? formatDate(exp.end) : 'Present'}
                </div>
              </div>
              <ul className="resume-bullets">
                {exp.bullets.map((bullet, j) => (
                  <li key={j}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <div>
                  <h3>{edu.degree}</h3>
                  <p className="resume-company">{edu.school}</p>
                </div>
                <div className="resume-dates">{edu.dates}</div>
              </div>
              {edu.notes && <p className="resume-notes">{edu.notes}</p>}
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            {resume.skills.map((skill, i) => (
              <span key={i} className="badge badge-navy">{skill}</span>
            ))}
          </div>
        </section>

        {resume.certifications && resume.certifications.length > 0 && (
          <section className="resume-section">
            <h2>Certifications</h2>
            <ul className="resume-bullets">
              {resume.certifications.map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="resume-section">
          <h2>Selected Work</h2>
          <div className="selected-work">
            {resume.selected_work_slugs.map(slug => {
              const memo = content.memos.find(m => m.slug === slug);
              return memo ? <MemoCard key={slug} memo={memo} compact /> : null;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// MEMOS LIST PAGE
// ============================================================================
function Memos({ content, isPrivateUnlocked }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  const visibleMemos = content.memos.filter(m => 
    m.status === 'Public' || (m.status === 'Private' && isPrivateUnlocked)
  );

  const memoTypes = ['All', ...new Set(visibleMemos.map(m => m.memo_type))];
  const years = ['All', ...new Set(visibleMemos.map(m => new Date(m.analysis_date).getFullYear())).sort((a, b) => b - a)];

  const filteredMemos = useMemo(() => {
    return visibleMemos.filter(memo => {
      const matchesSearch = searchTerm === '' || 
        memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.thesis_one_liner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'All' || memo.memo_type === filterType;
      const matchesYear = filterYear === 'All' || new Date(memo.analysis_date).getFullYear() === filterYear;

      return matchesSearch && matchesType && matchesYear;
    }).sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  }, [visibleMemos, searchTerm, filterType, filterYear]);

  return (
    <div className="memos-page">
      <div className="memos-header">
        <h1>Investment Memos</h1>
        <p className="memos-subtitle">
          Deep-dive analysis on distressed credit and restructuring opportunities
        </p>
      </div>

      <div className="memos-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, company, thesis, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="filter-row">
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {memoTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {!isPrivateUnlocked && (
            <a href="#/private" className="btn btn-secondary btn-sm">
              🔒 Unlock Private Memos
            </a>
          )}
        </div>
      </div>

      <div className="memos-count">
        Showing {filteredMemos.length} of {visibleMemos.length} memos
      </div>

      <div className="memo-grid">
        {filteredMemos.map(memo => (
          <MemoCard key={memo.slug} memo={memo} />
        ))}
      </div>

      {filteredMemos.length === 0 && (
        <div className="empty-state">
          <p>No memos found matching your criteria.</p>
          <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterYear('All'); }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MEMO DETAIL PAGE
// ============================================================================
function MemoDetail({ content, slug, isPrivateUnlocked }) {
  const [showSources, setShowSources] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const memo = content.memos.find(m => m.slug === slug);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.memo-section');
      let current = '';
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) current = section.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!memo) {
    return (
      <div className="empty-state">
        <h1>Memo Not Found</h1>
        <p>The requested memo could not be found.</p>
        <a href="#/memos" className="btn btn-primary">Back to Memos</a>
      </div>
    );
  }

  if (memo.status === 'Private' && !isPrivateUnlocked) {
    return (
      <div className="empty-state">
        <h1>🔒 Private Memo</h1>
        <p>This memo requires authentication to view.</p>
        <a href="#/private" className="btn btn-primary">Unlock Private Access</a>
      </div>
    );
  }

  const toc = generateTOC(memo);

  return (
    <div className="memo-detail-page">
      <div className="memo-detail-sidebar">
        <div className="toc">
          <h3>Contents</h3>
          <ul>
            {toc.map((item, i) => (
              <li key={i} className={activeSection === item.id ? 'active' : ''}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="memo-detail-content">
        <div className="memo-detail-header no-print">
          <a href="#/memos" className="back-link">← Back to Memos</a>
          <h1>{memo.title}</h1>
          <div className="memo-meta">
            <span className="badge badge-navy">{memo.memo_type}</span>
            {memo.status === 'Private' && <span className="badge badge-success">Private</span>}
            <span className="memo-date">Published {formatDateLong(memo.date_published)}</span>
          </div>
          <div className="memo-company">
            <strong>{memo.company}</strong>
            {memo.ticker_or_issuer_id && <span> | {memo.ticker_or_issuer_id}</span>}
          </div>
          <p className="memo-thesis">{memo.thesis_one_liner}</p>
          
          <div className="memo-actions">
            {memo.show_pdf_download && (
              <button className="btn btn-primary" onClick={() => window.print()}>
                📄 Download PDF
              </button>
            )}
            {memo.sources && memo.sources.length > 0 && (
              <button className="btn btn-secondary" onClick={() => setShowSources(true)}>
                📚 View Sources
              </button>
            )}
          </div>
        </div>

        <div className="memo-sections">
          {memo.executive_summary_md && (
            <section id="executive-summary" className="memo-section">
              <ReactMarkdown>{memo.executive_summary_md}</ReactMarkdown>
            </section>
          )}

          {memo.capital_structure_md && (
            <section id="capital-structure" className="memo-section">
              <ReactMarkdown>{memo.capital_structure_md}</ReactMarkdown>
            </section>
          )}

          {memo.timeline && memo.timeline.length > 0 && (
            <section id="timeline" className="memo-section">
              <h2>Timeline</h2>
              <div className="timeline">
                {memo.timeline.map((event, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-date">{formatDateLong(event.date)}</div>
                    <div className="timeline-content">
                      <h4>{event.headline}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {memo.restructuring_mechanics_md && (
            <section id="restructuring-mechanics" className="memo-section">
              <ReactMarkdown>{memo.restructuring_mechanics_md}</ReactMarkdown>
            </section>
          )}

          {memo.scenarios && memo.scenarios.length > 0 && (
            <section id="scenarios" className="memo-section">
              <h2>Scenarios</h2>
              <div className="scenarios-grid">
                {memo.scenarios.map((scenario, i) => (
                  <div key={i} className="scenario-card">
                    <h4>{scenario.name}</h4>
                    <div className="scenario-prob">Probability: <strong>{scenario.probability}</strong></div>
                    <div className="scenario-recovery">Recovery: <strong>{scenario.recovery_range}</strong></div>
                    <p>{scenario.notes}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {memo.valuation_md && (
            <section id="valuation" className="memo-section">
              <ReactMarkdown>{memo.valuation_md}</ReactMarkdown>
            </section>
          )}

          {memo.recovery_waterfall_md && (
            <section id="recovery-waterfall" className="memo-section">
              <ReactMarkdown>{memo.recovery_waterfall_md}</ReactMarkdown>
            </section>
          )}

          {memo.key_lessons && memo.key_lessons.length > 0 && (
            <section id="key-lessons" className="memo-section">
              <h2>Key Lessons</h2>
              <ul className="key-lessons-list">
                {memo.key_lessons.map((lesson, i) => (
                  <li key={i}>{lesson}</li>
                ))}
              </ul>
            </section>
          )}

          {memo.monitoring_plan && memo.monitoring_plan.length > 0 && (
            <section id="monitoring-plan" className="memo-section">
              <h2>Monitoring Plan</h2>
              <div className="monitoring-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Event</th>
                      <th>Signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memo.monitoring_plan.map((item, i) => (
                      <tr key={i}>
                        <td>{formatDateLong(item.milestone_date)}</td>
                        <td>{item.event}</td>
                        <td>{item.signal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {memo.tags && memo.tags.length > 0 && (
            <div className="memo-tags">
              {memo.tags.map((tag, i) => (
                <span key={i} className="badge badge-slate">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showSources && (
        <Modal onClose={() => setShowSources(false)}>
          <h2>Sources & Citations</h2>
          <div className="sources-list">
            {memo.sources.map((source, i) => (
              <div key={i} className="source-item">
                <strong>{source.label}</strong>
                {source.url && (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="source-link">
                    View Source →
                  </a>
                )}
                {source.citation_md && <ReactMarkdown>{source.citation_md}</ReactMarkdown>}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================================
// ABOUT PAGE
// ============================================================================
function About({ content }) {
  return (
    <div className="about-page">
      <h1>About</h1>
      <div className="about-content">
        <section className="about-section">
          <h2>Background</h2>
          <ReactMarkdown>{content.resume.summary_md}</ReactMarkdown>
        </section>

        <section className="about-section">
          <h2>Why Restructuring & Credit?</h2>
          <p>
            The intersection of legal complexity, operational analysis, and capital structure optimization 
            represents one of the most intellectually challenging areas in finance. Distressed situations 
            require synthesizing information across multiple disciplines—from covenant analysis and 
            intercreditor agreements to operational turnarounds and valuation under uncertainty.
          </p>
          <p>
            Every restructuring tells a story about leverage, incentives, and the collision between 
            theoretical capital structure and real-world constraints. This portfolio captures that analysis 
            in a systematic, repeatable framework.
          </p>
        </section>

        <section className="about-section">
          <h2>Methodology</h2>
          <p>Each memo follows a consistent analytical framework:</p>
          <ul className="methodology-list">
            <li><strong>Situation Analysis:</strong> Capital structure, timeline of events, stakeholder mapping</li>
            <li><strong>Scenario Planning:</strong> Probability-weighted outcomes across restructuring paths</li>
            <li><strong>Recovery Analysis:</strong> Waterfall modeling and creditor priority assessment</li>
            <li><strong>Monitoring:</strong> Key milestones and signposts for thesis validation/invalidation</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Get in Touch</h2>
          <p>
            I'm always interested in discussing distressed credit opportunities, restructuring mechanics, 
            or career paths in special situations investing.
          </p>
          <div className="cta-buttons">
            <a href="#/contact" className="btn btn-primary">Contact Me</a>
            <a href={content.site.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================================
// CONTACT PAGE
// ============================================================================
function Contact({ content }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:${content.site.social.email}?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="contact-page">
      <h1>Get in Touch</h1>
      <p className="contact-subtitle">
        Interested in discussing restructuring opportunities or connecting? Reach out below.
      </p>

      <div className="contact-grid">
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="6"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>

        <div className="contact-info">
          <h3>Direct Contact</h3>
          <div className="contact-methods">
            <a href={`mailto:${content.site.social.email}`} className="contact-method">
              <span className="contact-icon">📧</span>
              <span>{content.site.social.email}</span>
            </a>
            <a href={content.site.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-method">
              <span className="contact-icon">💼</span>
              <span>LinkedIn Profile</span>
            </a>
          </div>

          <div className="contact-note">
            <h4>Response Time</h4>
            <p>I typically respond to inquiries within 24-48 hours during business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PRIVATE ACCESS PAGE
// ============================================================================
function Private({ isPrivateUnlocked, setIsPrivateUnlocked }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === 'DISTRESSED2025') {
      setIsPrivateUnlocked(true);
      setError('');
      window.location.hash = '#/memos';
    } else {
      setError('Incorrect passcode. Please try again.');
    }
  };

  if (isPrivateUnlocked) {
    return (
      <div className="private-page">
        <div className="private-unlocked">
          <h1>✓ Private Access Granted</h1>
          <p>You now have access to all private memos.</p>
          <a href="#/memos" className="btn btn-primary">View All Memos</a>
        </div>
      </div>
    );
  }

  return (
    <div className="private-page">
      <div className="private-form-container">
        <h1>🔒 Private Access</h1>
        <p>Enter the passcode to unlock private memos and confidential analysis.</p>

        <form className="private-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="passcode">Passcode</label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              autoFocus
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">Unlock Access</button>
        </form>

        <div className="private-note">
          <p><strong>Note:</strong> Private memos contain confidential analysis and proprietary research. Access is limited to authorized viewers only.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
function MemoCard({ memo, compact = false }) {
  return (
    <a href={`#/memos/${memo.slug}`} className={`memo-card ${compact ? 'memo-card-compact' : ''}`}>
      <div className="memo-card-header">
        <h3>{memo.title}</h3>
        <div className="memo-card-badges">
          <span className="badge badge-navy">{memo.memo_type}</span>
          {memo.status === 'Private' && <span className="badge badge-success">Private</span>}
        </div>
      </div>
      <div className="memo-card-company">{memo.company}</div>
      <p className="memo-card-thesis">{memo.thesis_one_liner}</p>
      {!compact && (
        <>
          <div className="memo-card-tags">
            {memo.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="badge badge-slate">{tag}</span>
            ))}
          </div>
          <div className="memo-card-date">{formatDateLong(memo.date_published)}</div>
        </>
      )}
    </a>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

function Footer({ content }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} {content.site.name}. All rights reserved.</p>
        <div className="footer-links">
          <a href={content.site.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${content.site.social.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="empty-state">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="#/" className="btn btn-primary">Go Home</a>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateLong(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function calculateYearsExp(experience) {
  if (!experience || experience.length === 0) return 0;
  const earliest = experience.reduce((min, exp) => {
    const start = new Date(exp.start);
    return start < min ? start : min;
  }, new Date(experience[0].start));
  const years = (new Date() - earliest) / (1000 * 60 * 60 * 24 * 365);
  return Math.floor(years);
}

function getUniqueSectors(memos) {
  const sectors = new Set();
  memos.forEach(memo => {
    memo.tags.forEach(tag => {
      if (!['RX', 'Distressed', 'Special Sits', 'Lessons'].includes(tag)) {
        sectors.add(tag);
      }
    });
  });
  return Array.from(sectors);
}

function generateTOC(memo) {
  const toc = [];
  const sections = [
    { key: 'executive_summary_md', id: 'executive-summary', text: 'Executive Summary' },
    { key: 'capital_structure_md', id: 'capital-structure', text: 'Capital Structure' },
    { key: 'timeline', id: 'timeline', text: 'Timeline', check: (m) => m.timeline && m.timeline.length > 0 },
    { key: 'restructuring_mechanics_md', id: 'restructuring-mechanics', text: 'Restructuring Mechanics' },
    { key: 'scenarios', id: 'scenarios', text: 'Scenarios', check: (m) => m.scenarios && m.scenarios.length > 0 },
    { key: 'valuation_md', id: 'valuation', text: 'Valuation' },
    { key: 'recovery_waterfall_md', id: 'recovery-waterfall', text: 'Recovery Waterfall' },
    { key: 'key_lessons', id: 'key-lessons', text: 'Key Lessons', check: (m) => m.key_lessons && m.key_lessons.length > 0 },
    { key: 'monitoring_plan', id: 'monitoring-plan', text: 'Monitoring Plan', check: (m) => m.monitoring_plan && m.monitoring_plan.length > 0 }
  ];

  sections.forEach(section => {
    const shouldInclude = section.check ? section.check(memo) : memo[section.key];
    if (shouldInclude) {
      toc.push({ id: section.id, text: section.text });
    }
  });

  return toc;
}

// ============================================================================
// RENDER APP
// ============================================================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

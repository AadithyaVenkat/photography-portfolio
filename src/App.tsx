import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  Moon,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'
import {
  categoryLabels,
  imageSource,
  journalStories,
  photos,
  type Category,
  type JournalStory,
  type Photo,
} from './photos'

type ViewMode = 'stories' | 'scrolly' | 'editorial'

interface ActiveSheetState {
  sequence: Photo[]
  photoId: string
  storyTitle: string
  layoutPrefix: string
}

const pad = (value: number) => String(value).padStart(2, '0')

function getStoryPhotos(story: JournalStory): Photo[] {
  return story.photoIds
    .map(id => photos.find(photo => photo.id === id))
    .filter((photo): photo is Photo => Boolean(photo))
}

const springTransition = {
  type: 'spring' as const,
  duration: 0.3,
  bounce: 0,
}

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'stories'
    const param = new URLSearchParams(window.location.search).get('mode')
    if (param === 'scrolly' || param === 'editorial' || param === 'stories') return param
    return 'stories'
  })

  const [category, setCategory] = useState<Category | 'all'>('all')
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [scrollySelection, setScrollySelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(journalStories.map(s => [s.id, s.photoIds[0] ?? '29'])),
  )

  const [sheet, setSheet] = useState<ActiveSheetState | null>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    const root = document.documentElement
    root.classList.add('suppress-theme-transitions')
    void root.offsetWidth
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('suppress-theme-transitions')
      })
    })
  }

  function selectViewMode(nextMode: ViewMode) {
    setViewMode(nextMode)
    const url = new URL(window.location.href)
    if (nextMode === 'stories') {
      url.searchParams.delete('mode')
    } else {
      url.searchParams.set('mode', nextMode)
    }
    window.history.replaceState({}, '', url)
  }

  const visibleStories = useMemo(() => {
    return category === 'all'
      ? journalStories
      : journalStories.filter(story => story.category === category)
  }, [category])

  const totalVisiblePlates = useMemo(
    () => visibleStories.reduce((sum, story) => sum + story.photoIds.length, 0),
    [visibleStories],
  )

  const spotlightStory = journalStories[spotlightIndex] ?? journalStories[0]!
  const spotlightPhotos = useMemo(() => getStoryPhotos(spotlightStory), [spotlightStory])
  const spotlightLead = spotlightPhotos[0] ?? photos[0]!

  function openStorySheet(
    sequence: Photo[],
    photoId: string,
    storyTitle: string,
    layoutPrefix: string,
    trigger: HTMLButtonElement | null,
  ) {
    openerRef.current = trigger
    setSheet({ sequence, photoId, storyTitle, layoutPrefix })
    document.body.classList.add('sheet-locked')
  }

  function closeStorySheet() {
    setSheet(null)
    document.body.classList.remove('sheet-locked')
    requestAnimationFrame(() => {
      openerRef.current?.focus({ preventScroll: true })
    })
  }

  useEffect(() => {
    if (!sheet) return
    closeBtnRef.current?.focus({ preventScroll: true })

    function handleKeyDown(event: KeyboardEvent) {
      if (!sheet) return
      if (event.key === 'Escape') {
        event.preventDefault()
        closeStorySheet()
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const delta = event.key === 'ArrowRight' ? 1 : -1
        const currentIndex = sheet.sequence.findIndex(p => p.id === sheet.photoId)
        const nextIndex = (currentIndex + delta + sheet.sequence.length) % sheet.sequence.length
        const nextPhoto = sheet.sequence[nextIndex]
        if (nextPhoto) {
          setSheet(prev => (prev ? { ...prev, photoId: nextPhoto.id } : null))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sheet])

  const activeSheetPhoto = useMemo(() => {
    if (!sheet) return null
    return sheet.sequence.find(p => p.id === sheet.photoId) ?? sheet.sequence[0] ?? null
  }, [sheet])

  const activeSheetIndex = useMemo(() => {
    if (!sheet || !activeSheetPhoto) return 0
    return Math.max(
      0,
      sheet.sequence.findIndex(p => p.id === activeSheetPhoto.id),
    )
  }, [sheet, activeSheetPhoto])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#journal-main">
        Skip to photo journal
      </a>

      <header className="apple-nav-chrome" id="top">
        <div className="apple-nav-inner">
          <a className="apple-brand-lockup" href="#top" aria-label="Aadithya photography home">
            <span className="apple-brand-mark">
              av<span>.</span>
            </span>
            <span className="apple-brand-name">Aadithya Venkatanarayanan</span>
            <span className="apple-brand-badge">Photo Journal</span>
          </a>

          <div className="segmented-group" role="group" aria-label="Journal presentation mode">
            {(
              [
                ['stories', 'Bento Stories'],
                ['scrolly', 'Scrollytelling'],
                ['editorial', 'Editorial Spreads'],
              ] as const
            ).map(([modeId, label]) => {
              const active = viewMode === modeId
              return (
                <button
                  key={modeId}
                  type="button"
                  className="segmented-btn"
                  data-mode-btn={modeId}
                  aria-pressed={active}
                  onClick={() => selectViewMode(modeId)}
                >
                  {active && (
                    <motion.span
                      layoutId="view-mode-pill"
                      className="segmented-pill"
                      transition={springTransition}
                    />
                  )}
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          <div className="apple-nav-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              id="theme-switch-btn"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Dark appearance"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span>{theme === 'dark' ? 'Candlelight' : 'Buttercream'}</span>
            </button>

            <a className="contact-pill-link" href="mailto:aadithyavenkat@gmail.com">
              <span>Get in touch</span>
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main className="apple-main" id="journal-main">
        {/* Hero Header */}
        <section aria-labelledby="journal-heading">
          <div className="hero-header-grid">
            <div>
              <p className="section-eyebrow">Fieldnotes · React + Motion Edition</p>
              <h1 className="display-title" id="journal-heading">
                Aadithya
                <span>
                  Venkatanarayanan · <em>Visual Essays.</em>
                </span>
              </h1>
            </div>
            <div>
              <p className="hero-lead-note">
                Three sequenced photo stories on stillness, transit, and everyday detail—built with shared-element card transitions, spring-driven controls, and responsive sequences.
              </p>
              <div className="sample-disclosure-pill">
                <span className="sample-dot" aria-hidden="true" />
                <span>Preview collection · Credited sample photographs (Unsplash / Picsum)</span>
              </div>
            </div>
          </div>

          {/* Interactive Spotlight Deck */}
          <div className="spotlight-bento-card" aria-label="Featured story spotlight">
            <motion.button
              key={spotlightLead.id}
              type="button"
              layoutId={`spotlight-photo-${spotlightLead.id}`}
              className="spotlight-media-btn"
              id="spotlight-open-btn"
              aria-label={`Open ${spotlightLead.title} in full-screen story sheet`}
              aria-haspopup="dialog"
              transition={springTransition}
              onClick={e =>
                openStorySheet(
                  spotlightPhotos,
                  spotlightLead.id,
                  spotlightStory.title,
                  'spotlight',
                  e.currentTarget,
                )
              }
            >
              <img
                src={imageSource(spotlightLead)}
                alt={spotlightLead.alt}
                width={spotlightLead.width}
                height={spotlightLead.height}
                fetchPriority="high"
              />
              <span className="media-floating-badge">
                <Sparkles size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  {spotlightLead.plate} · Click to expand story ({pad(spotlightPhotos.length)}{' '}
                  frames)
                </span>
              </span>
            </motion.button>

            <div className="spotlight-copy-pane">
              <div>
                <div
                  className="spotlight-story-picker"
                  role="group"
                  aria-label="Choose featured essay"
                >
                  {journalStories.map((story, idx) => (
                    <button
                      key={story.id}
                      type="button"
                      className="story-chip-btn"
                      data-spotlight-chip={idx}
                      aria-pressed={idx === spotlightIndex}
                      onClick={() => setSpotlightIndex(idx)}
                    >
                      Essay {pad(idx + 1)} · {categoryLabels[story.category]}
                    </button>
                  ))}
                </div>

                <p className="section-eyebrow">{spotlightStory.kicker}</p>
                <h2>{spotlightStory.title}</h2>
                <p>{spotlightStory.introduction}</p>
                <div className="spotlight-curatorial">{spotlightStory.curatorialNote}</div>
              </div>

              <div className="spotlight-footer-bar">
                <div>
                  <span>Lead plate: {spotlightLead.title} · </span>
                  <a
                    className="credit-inline-link"
                    href={spotlightLead.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sample / {spotlightLead.author}
                  </a>
                </div>
                <div className="spotlight-controls">
                  <button
                    type="button"
                    className="circle-icon-btn"
                    id="spotlight-prev"
                    aria-label="Previous featured essay"
                    onClick={() =>
                      setSpotlightIndex(
                        (spotlightIndex - 1 + journalStories.length) % journalStories.length,
                      )
                    }
                  >
                    <ArrowLeft size={17} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="circle-icon-btn"
                    id="spotlight-next"
                    aria-label="Next featured essay"
                    onClick={() =>
                      setSpotlightIndex((spotlightIndex + 1) % journalStories.length)
                    }
                  >
                    <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Toolbar */}
        <div className="collection-filter-bar" id="work">
          <div className="segmented-group" role="group" aria-label="Filter by collection category">
            {(
              [
                ['all', 'All Essays', journalStories.length],
                ['landscape', categoryLabels.landscape, 1],
                ['street', categoryLabels.street, 1],
                ['details', categoryLabels.details, 1],
              ] as const
            ).map(([catKey, label, count]) => {
              const active = category === catKey
              return (
                <button
                  key={catKey}
                  type="button"
                  className="segmented-btn"
                  data-filter={catKey}
                  aria-pressed={active}
                  onClick={() => setCategory(catKey)}
                >
                  {active && (
                    <motion.span
                      layoutId="category-filter-pill"
                      className="segmented-pill"
                      transition={springTransition}
                    />
                  )}
                  <span>{label}</span>
                  <span className="segmented-count">{pad(count)}</span>
                </button>
              )
            })}
          </div>

          <p className="collection-status" role="status" aria-live="polite">
            {pad(visibleStories.length)} essays · {pad(totalVisiblePlates)} photographs
          </p>
        </div>

        {/* ====================================================================
            VIEW MODE 1: APPLE BENTO STORIES (Shared-element cards)
            ==================================================================== */}
        {viewMode === 'stories' && (
          <div className="story-chapters-stack">
            {visibleStories.map((story, sIdx) => {
              const seq = getStoryPhotos(story)
              return (
                <motion.article
                  key={story.id}
                  id={story.id}
                  className="bento-chapter"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="bento-chapter-head">
                    <div>
                      <p className="section-eyebrow">
                        Chapter {pad(sIdx + 1)} · {story.kicker}
                      </p>
                      <h3>{story.title}</h3>
                      <p className="bento-chapter-sub">{story.subtitle}</p>
                    </div>
                    <blockquote className="bento-passage-card">
                      <span className="section-eyebrow">Between the frames</span>
                      <p>“{story.passage}”</p>
                    </blockquote>
                  </div>

                  <div className="bento-sequence-grid">
                    {seq.map((photo, idx) => {
                      const isWide =
                        (idx === 0 && seq.length > 2) ||
                        (idx === seq.length - 1 && seq.length === 4)
                      return (
                        <figure
                          key={photo.id}
                          className={`bento-photo-card ${isWide ? 'is-wide' : ''}`}
                        >
                          <motion.button
                            type="button"
                            layoutId={`stories-photo-${photo.id}`}
                            className="bento-photo-btn"
                            aria-label={`View ${photo.title}`}
                            aria-haspopup="dialog"
                            transition={springTransition}
                            onClick={e =>
                              openStorySheet(
                                seq,
                                photo.id,
                                story.title,
                                'stories',
                                e.currentTarget,
                              )
                            }
                          >
                            <img
                              src={imageSource(photo)}
                              alt={photo.alt}
                              width={photo.width}
                              height={photo.height}
                              loading={sIdx === 0 && idx < 2 ? 'eager' : 'lazy'}
                            />
                            <span className="media-floating-badge">
                              <Expand size={13} strokeWidth={1.75} aria-hidden="true" />
                              <span>{photo.plate}</span>
                            </span>
                          </motion.button>

                          <figcaption className="bento-card-caption">
                            <div className="bento-card-top">
                              <strong className="bento-card-title">{photo.title}</strong>
                              <span className="bento-card-plate">{photo.plate}</span>
                            </div>
                            <p className="bento-card-story">{photo.story}</p>
                            <p className="bento-card-note">{photo.fieldNote}</p>
                            <a
                              className="credit-inline-link"
                              href={photo.source}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Sample / {photo.author}
                            </a>
                          </figcaption>
                        </figure>
                      )
                    })}
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        {/* ====================================================================
            VIEW MODE 2: APPLE SCROLLYTELLING CINEMA (Sticky Split Stage)
            ==================================================================== */}
        {viewMode === 'scrolly' && (
          <div className="scrolly-section">
            {visibleStories.map((story, sIdx) => {
              const seq = getStoryPhotos(story)
              const selectedId = scrollySelection[story.id] ?? seq[0]!.id
              const activePhoto = seq.find(p => p.id === selectedId) ?? seq[0]!
              const activeIdx = seq.findIndex(p => p.id === activePhoto.id)

              return (
                <article key={story.id} className="scrolly-story-layout" id={`scrolly-${story.id}`}>
                  <div className="scrolly-steps-column">
                    <div className="scrolly-chapter-intro">
                      <p className="section-eyebrow">
                        Essay {pad(sIdx + 1)} · {categoryLabels[story.category]}
                      </p>
                      <h3>{story.title}</h3>
                      <p className="hero-lead-note">{story.introduction}</p>
                      <p className="bento-card-note">“{story.passage}”</p>
                    </div>

                    {seq.map((photo, idx) => {
                      const isSelected = photo.id === activePhoto.id
                      return (
                        <button
                          key={photo.id}
                          type="button"
                          className="scrolly-step-card"
                          aria-pressed={isSelected}
                          onMouseEnter={() =>
                            setScrollySelection(prev => ({ ...prev, [story.id]: photo.id }))
                          }
                          onFocus={() =>
                            setScrollySelection(prev => ({ ...prev, [story.id]: photo.id }))
                          }
                          onClick={() =>
                            setScrollySelection(prev => ({ ...prev, [story.id]: photo.id }))
                          }
                        >
                          <div className="scrolly-step-head">
                            <span>
                              Step {pad(idx + 1)} of {pad(seq.length)} · {photo.plate}
                            </span>
                            <span>{isSelected ? 'Pinned on stage' : 'Select frame'}</span>
                          </div>
                          <strong>{photo.title}</strong>
                          <p>{photo.story}</p>
                          <p>{photo.fieldNote}</p>
                        </button>
                      )
                    })}
                  </div>

                  <div className="scrolly-sticky-stage">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.button
                        key={activePhoto.id}
                        type="button"
                        layoutId={`scrolly-photo-${activePhoto.id}`}
                        className="scrolly-stage-btn"
                        aria-label={`Open ${activePhoto.title} in full-screen viewer`}
                        initial={{ opacity: 0.3, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        onClick={e =>
                          openStorySheet(
                            seq,
                            activePhoto.id,
                            story.title,
                            'scrolly',
                            e.currentTarget,
                          )
                        }
                      >
                        <img
                          src={imageSource(activePhoto)}
                          alt={activePhoto.alt}
                          width={activePhoto.width}
                          height={activePhoto.height}
                        />
                        <span className="media-floating-badge">
                          <Expand size={13} strokeWidth={1.75} aria-hidden="true" />
                          <span>
                            Frame {pad(activeIdx + 1)} / {pad(seq.length)} · Click for full screen
                          </span>
                        </span>
                      </motion.button>
                    </AnimatePresence>

                    <div className="scrolly-stage-meta">
                      <div>
                        <span className="bento-card-plate">{activePhoto.plate}</span>
                        <h4>{activePhoto.title}</h4>
                        <p>{activePhoto.fieldNote}</p>
                      </div>
                      <a
                        className="credit-inline-link"
                        href={activePhoto.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sample / {activePhoto.author}
                      </a>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ====================================================================
            VIEW MODE 3: EDITORIAL SPREADS (Fieldnotes Print Layout)
            ==================================================================== */}
        {viewMode === 'editorial' && (
          <div>
            {visibleStories.map((story, sIdx) => {
              const seq = getStoryPhotos(story)
              return (
                <article
                  key={story.id}
                  className="editorial-chapter-card"
                  data-tone={story.tone}
                >
                  <p className="section-eyebrow">
                    Essay {pad(sIdx + 1)} · {story.kicker}
                  </p>
                  <h3 style={{ font: '400 58px/1 var(--serif)', margin: '4px 0 12px' }}>
                    {story.title}
                  </h3>
                  <p className="hero-lead-note" style={{ maxWidth: '62ch' }}>
                    {story.introduction}
                  </p>

                  <div className="editorial-spread-grid">
                    {seq.map((photo, idx) => (
                      <figure key={photo.id} className="editorial-figure">
                        <button
                          type="button"
                          className="editorial-photo-btn"
                          aria-label={`View ${photo.title}`}
                          onClick={e =>
                            openStorySheet(
                              seq,
                              photo.id,
                              story.title,
                              'editorial',
                              e.currentTarget,
                            )
                          }
                        >
                          <img
                            src={imageSource(photo)}
                            alt={photo.alt}
                            width={photo.width}
                            height={photo.height}
                            loading="lazy"
                          />
                        </button>
                        <figcaption className="bento-card-caption">
                          <div className="bento-card-top">
                            <strong className="bento-card-title">{photo.title}</strong>
                            <span className="bento-card-plate">{photo.plate}</span>
                          </div>
                          <p className="bento-card-note">{photo.fieldNote}</p>
                          <a
                            className="credit-inline-link"
                            href={photo.source}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Sample / {photo.author}
                          </a>
                        </figcaption>
                        {idx === 0 && (
                          <aside className="editorial-passage-box" style={{ marginTop: 18 }}>
                            <span className="section-eyebrow">Between the frames</span>
                            <p>“{story.passage}”</p>
                          </aside>
                        )}
                      </figure>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* About & Contact Section */}
        <section className="apple-about-section" id="about" aria-labelledby="about-heading">
          <div>
            <p className="section-eyebrow">Behind the Frame</p>
            <h2 id="about-heading">
              An engineer’s mind.
              <br />
              <em>A curious eye.</em>
            </h2>
          </div>
          <div className="apple-about-body">
            <p>
              I’m Aadithya Venkatanarayanan. Alongside my engineering work, this journal is a quiet space for places, passing scenes, and visual essays sequenced with care.
            </p>
            <p>
              This preview edition uses credited sample photographs while my personal photography archive is being curated.
            </p>
            <a className="contact-pill-link" href="mailto:aadithyavenkat@gmail.com">
              <span>Write to aadithyavenkat@gmail.com</span>
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="apple-footer">
        <span>Aadithya Venkatanarayanan · {new Date().getFullYear()}</span>
        <span>
          Sample photography via{' '}
          <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer">
            Lorem Picsum
          </a>{' '}
          &amp;{' '}
          <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
        </span>
        <a href="mailto:aadithyavenkat@gmail.com">aadithyavenkat@gmail.com</a>
      </footer>

      {/* ======================================================================
          SHARED-ELEMENT FULL-SCREEN STORY SHEET MODAL
          ====================================================================== */}
      {sheet && activeSheetPhoto && (
        <div
          className="story-sheet-backdrop"
          onClick={e => {
            if (e.target === e.currentTarget) closeStorySheet()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-photo-title"
            aria-describedby="sheet-photo-story"
            className="story-sheet-dialog"
          >
            <div className="story-sheet-topbar">
              <span className="story-sheet-counter" id="viewer-position">
                {pad(activeSheetIndex + 1)} / {pad(sheet.sequence.length)} · {sheet.storyTitle}
              </span>
              <span className="sample-disclosure-pill">
                {activeSheetPhoto.sample ? 'Sample photograph' : 'Photograph'} ·{' '}
                {activeSheetPhoto.plate}
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                className="circle-icon-btn"
                id="viewer-close"
                aria-label="Close photo"
                title="Close photo (Escape)"
                onClick={closeStorySheet}
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="story-sheet-stage">
              <motion.div
                layoutId={`${sheet.layoutPrefix}-photo-${activeSheetPhoto.id}`}
                className="story-sheet-image-frame"
                transition={springTransition}
              >
                <img
                  id="viewer-image"
                  src={imageSource(activeSheetPhoto)}
                  alt={activeSheetPhoto.alt}
                  width={activeSheetPhoto.width}
                  height={activeSheetPhoto.height}
                />
              </motion.div>

              <div className="story-sheet-details">
                <div>
                  <p className="section-eyebrow">
                    {categoryLabels[activeSheetPhoto.category]} · {activeSheetPhoto.plate}
                  </p>
                  <h2 id="sheet-photo-title">{activeSheetPhoto.title}</h2>
                  <p className="story-sheet-story" id="sheet-photo-story">
                    {activeSheetPhoto.story}
                  </p>
                  <p className="story-sheet-fieldnote">{activeSheetPhoto.fieldNote}</p>

                  <div className="sheet-scrubber-strip" role="group" aria-label="Sequence frames">
                    {sheet.sequence.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        className="sheet-thumb-btn"
                        aria-pressed={item.id === activeSheetPhoto.id}
                        onClick={() =>
                          setSheet(prev => (prev ? { ...prev, photoId: item.id } : null))
                        }
                      >
                        <img
                          src={imageSource(item)}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                        />
                        <span>
                          {pad(idx + 1)} · {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="story-sheet-nav-row">
                  <a
                    id="viewer-credit"
                    className="credit-inline-link"
                    href={activeSheetPhoto.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {activeSheetPhoto.sample ? 'Sample photo by ' : 'Photo by '}
                    {activeSheetPhoto.author}
                  </a>

                  <div className="spotlight-controls">
                    <button
                      type="button"
                      className="circle-icon-btn"
                      id="viewer-previous"
                      aria-label="Previous photo"
                      onClick={() => {
                        const prevIdx =
                          (activeSheetIndex - 1 + sheet.sequence.length) %
                          sheet.sequence.length
                        const prevPhoto = sheet.sequence[prevIdx]
                        if (prevPhoto) {
                          setSheet(prev => (prev ? { ...prev, photoId: prevPhoto.id } : null))
                        }
                      }}
                    >
                      <ArrowLeft size={17} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="circle-icon-btn"
                      id="viewer-next"
                      aria-label="Next photo"
                      onClick={() => {
                        const nextIdx = (activeSheetIndex + 1) % sheet.sequence.length
                        const nextPhoto = sheet.sequence[nextIdx]
                        if (nextPhoto) {
                          setSheet(prev => (prev ? { ...prev, photoId: nextPhoto.id } : null))
                        }
                      }}
                    >
                      <ArrowRight size={17} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MotionConfig>
  )
}

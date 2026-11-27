import React, { useEffect, useState } from 'react';
import { DotMatrixCanvas } from './components/DotMatrixCanvas';
import { LiveSimulator } from './components/LiveSimulator';

type ThemeChoice = 'light' | 'dark';

interface AccentPreset {
  id: string;
  label: string;
  hex: string;
}

const ACCENTS: AccentPreset[] = [
  { id: 'teal', label: 'Teal', hex: '#2dd4bf' },
  { id: 'cobalt', label: 'Cobalt', hex: '#38bdf8' },
  { id: 'emerald', label: 'Emerald', hex: '#34d399' },
  { id: 'violet', label: 'Violet', hex: '#a78bfa' },
  { id: 'amber', label: 'Amber', hex: '#fbbf24' },
  { id: 'crimson', label: 'Crimson', hex: '#fb7185' },
];

interface DeckChapter {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  highlights: string[];
  badge: string;
  visualTitle: string;
  visualDesc: string;
  metrics: { label: string; value: string }[];
}

const DECK_CHAPTERS: DeckChapter[] = [
  {
    id: 'trackpad',
    eyebrow: '01 · Precision Surface',
    title: 'Multi-Touch Trackpad',
    summary:
      'Sub-pixel delta streaming over UDP 5002 with adjustable acceleration curves, two-finger inertia scroll, pinch-to-zoom, and crisp haptic clicks.',
    highlights: [
      '1.0× to 2.5× hardware-tuned sensitivity curve',
      'Two-finger scroll & three-finger workspace swipe',
      'Instant left / middle / right click bar with zero-lag audio feedback',
    ],
    badge: 'UDP 5002 · <1ms',
    visualTitle: 'Sub-Pixel Delta Engine',
    visualDesc:
      'Raw pointer velocity is quantized at 120Hz and dispatched via fire-and-forget UDP datagrams, bypassing TCP head-of-line blocking.',
    metrics: [
      { label: 'Polling Rate', value: '120 Hz' },
      { label: 'Transport', value: 'UDP 5002' },
      { label: 'Avg Jitter', value: '0.4 ms' },
    ],
  },
  {
    id: 'keyboard',
    eyebrow: '02 · Full Input Deck',
    title: 'Desktop & TV Keyboard',
    summary:
      'Type naturally into Windows, macOS, or Android TV search bars with live keystrokes, modifier chords (Ctrl/Alt/Win/Cmd), and function keys.',
    highlights: [
      'Full Unicode & special symbol support over TCP 5000',
      'Dedicated Modifier Strip: Ctrl, Alt, Shift, Win/Cmd, Esc, Tab',
      'Works seamlessly with Android TV IME & Windows SendInput',
    ],
    badge: 'TCP 5000 · Reliable',
    visualTitle: 'Reliable Chord Pipeline',
    visualDesc:
      'Every keystroke and modifier state is guaranteed in-order delivery via TCP 5000 so passwords, shortcuts, and TV search queries never drop characters.',
    metrics: [
      { label: 'Delivery', value: 'Guaranteed' },
      { label: 'Shortcuts', value: 'Ctrl+Alt+Del / Cmd' },
      { label: 'TV Support', value: 'IME + Accessibility' },
    ],
  },
  {
    id: 'gamepad',
    eyebrow: '03 · Console Controller',
    title: 'Dual-Stick Gamepad',
    summary:
      'Turn your phone into a low-latency wireless controller with dual analog thumbsticks, pressure-mapped D-pad, triggers, and ABXY face buttons.',
    highlights: [
      'Ergonomic landscape dual-thumbstick layout',
      'Custom XInput / virtual keybinding presets',
      'Tactile haptic rumble feedback on trigger & button press',
    ],
    badge: '60fps Analog',
    visualTitle: 'Dual Analog Telemetry',
    visualDesc:
      'Normalized (-1.0 to +1.0) stick axes and trigger states stream over UDP 5002 for responsive couch gaming on PC or TV.',
    metrics: [
      { label: 'Axes', value: 'LX / LY / RX / RY' },
      { label: 'Triggers', value: 'L1 / L2 / R1 / R2' },
      { label: 'Vibration', value: 'Haptic Engine' },
    ],
  },
  {
    id: 'media',
    eyebrow: '04 · Couch & Presentation',
    title: 'Media & Slide Deck',
    summary:
      'Control Spotify, YouTube, VLC, or PowerPoint from across the room with oversized transport controls, volume rocker, and presentation laser cues.',
    highlights: [
      'Play/Pause, Next/Previous, Mute & Fine Volume Slider',
      'Presentation mode with Next/Prev slide & Screen Blackout',
      'One-tap system power actions (Lock, Sleep, Restart)',
    ],
    badge: 'Zero-Look UI',
    visualTitle: 'Media & Power Deck',
    visualDesc:
      'High-contrast oversized touch targets let you pause movies or advance slides without looking down at your screen.',
    metrics: [
      { label: 'Media Keys', value: 'HID Consumer' },
      { label: 'Slides', value: 'Next / Prev / F5' },
      { label: 'Power', value: 'Lock / Sleep' },
    ],
  },
  {
    id: 'presenter',
    eyebrow: '05 · Multi-Host Mesh',
    title: 'Auto-Discovery Hub',
    summary:
      'Automatically discovers every Windows PC, macOS Mac, and Android TV on your Wi-Fi via UDP 5001 beacons—switch active hosts in one tap.',
    highlights: [
      'Zero manual IP typing on home or studio Wi-Fi',
      'Live latency badge (ms) & host OS identification',
      'Instant hot-swap between PC and Living Room TV',
    ],
    badge: 'UDP 5001 Beacon',
    visualTitle: 'Zero-Config LAN Mesh',
    visualDesc:
      'Host servers broadcast lightweight JSON presence beacons on UDP 5001 every second so your phone discovers them the moment you open the app.',
    metrics: [
      { label: 'Discovery', value: 'UDP 5001' },
      { label: 'Switch Time', value: '<150 ms' },
      { label: 'Hosts', value: 'Win / TV / Mac' },
    ],
  },
];

type PlatformKey = 'windows' | 'tv' | 'macos';

interface PlatformInfo {
  name: string;
  tagline: string;
  badge: string;
  details: string[];
  hasBanner?: boolean;
}

const PLATFORMS: Record<PlatformKey, PlatformInfo> = {
  windows: {
    name: 'Windows 10 / 11 Host',
    tagline: 'Native Win32 SendInput + System Tray Daemon',
    badge: 'RemoteMouseServer.exe',
    details: [
      'Zero-install portable .exe with automatic Windows Firewall rule prompt',
      'Hardware-level SendInput cursor, scroll, media keys & keyboard chords',
      'Runs silently in the System Tray with QR/IP quick-connect',
    ],
  },
  tv: {
    name: 'Android TV & Google TV',
    tagline: 'Leanback 10-Foot UI + Accessibility & IME Service',
    badge: 'android-tv-server.apk',
    details: [
      'Designed for D-pad navigation with auto-permission onboarding wizard',
      'Hardware-accelerated floating cursor overlay + native IME text injection',
      'Built-in Wi-Fi WakeLock & Foreground Service prevents idle disconnects',
    ],
    hasBanner: true,
  },
  macos: {
    name: 'macOS Apple Silicon & Intel',
    tagline: 'Quartz CGEvent Engine + Menu Bar App',
    badge: 'build_macos.sh',
    details: [
      'Native Quartz CGEventPost mouse, trackpad inertia & Mission Control gestures',
      'Universal binary support for M1/M2/M3/M4 and Intel Macs',
      'Guided Accessibility permission prompt for instant setup',
    ],
  },
};

const FAQ_ITEMS = [
  {
    q: 'Why does Remote Trackpad use both TCP and UDP?',
    a: 'Mouse movement and analog gamepad sticks demand sub-millisecond responsiveness, so they stream over UDP port 5002 where a dropped packet is immediately superseded by the next frame. Keyboard strokes, clicks, and system commands use TCP port 5000 so every character and shortcut arrives reliably in exact order.',
  },
  {
    q: 'How does Auto-Discovery find my PC or TV without typing an IP?',
    a: 'Each host server broadcasts a lightweight presence packet on UDP port 5001 across your local Wi-Fi subnet. The Android mobile app listens on UDP 5001 and lists all active Windows, macOS, and Android TV hosts with their live ping latency.',
  },
  {
    q: 'What permissions does the Android TV Server need?',
    a: 'On first launch, the TV Server guides you through enabling two Android TV permissions: Display Over Other Apps (to render the smooth cursor pointer) and Accessibility Service (to dispatch taps, swipes, back/home actions, and keyboard input across any TV app).',
  },
  {
    q: 'Does it require an internet connection or cloud account?',
    a: 'No. All traffic stays 100% inside your local Wi-Fi network. There are no accounts, no cloud relays, no telemetry, and no subscription fees.',
  },
];

function detectDefaultPlatform(): PlatformKey {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) return 'macos';
  if (ua.includes('android')) return 'tv';
  return 'windows';
}

function getSystemTheme(): ThemeChoice {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncMetaColorScheme(theme: ThemeChoice) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', theme);
  }
}

export function App() {
  const [theme, setTheme] = useState<ThemeChoice>(() => {
    try {
      const stored = localStorage.getItem('theme-preference');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {
      // ignore storage access issues
    }
    return getSystemTheme();
  });

  const [accent, setAccent] = useState<AccentPreset>(ACCENTS[0]);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>(detectDefaultPlatform);
  const [setupTab, setSetupTab] = useState<'tv' | 'macos'>('tv');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Sync <meta name="color-scheme"> when theme changes
  useEffect(() => {
    syncMetaColorScheme(theme);
  }, [theme]);

  // Listen to OS system preference changes when no explicit stored override exists
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      try {
        const stored = localStorage.getItem('theme-preference');
        if (stored === 'light' || stored === 'dark') return;
      } catch {
        // ignore
      }
      setTheme(mq.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Sync accent CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent.hex);
  }, [accent]);

  // Scroll-reveal observer (compositor-friendly opacity + translate)
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next: ThemeChoice = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      const sys = getSystemTheme();
      if (next === sys) {
        localStorage.removeItem('theme-preference');
      } else {
        localStorage.setItem('theme-preference', next);
      }
    } catch {
      // ignore
    }
  };

  const copyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(cmd);
      window.setTimeout(() => setCopiedCmd(null), 1800);
    } catch {
      setCopiedCmd(cmd);
      window.setTimeout(() => setCopiedCmd(null), 1800);
    }
  };

  const currentChapter = DECK_CHAPTERS[activeChapter];
  const currentPlatform = PLATFORMS[activePlatform];

  return (
    <>
      <DotMatrixCanvas accentHex={accent.hex} isDark={theme === 'dark'} />

      <header className="site-header">
        <nav className="nav-capsule" aria-label="Primary">
          <a href="#top" className="brand-link">
            <img src="/app-icon.png" alt="Remote Trackpad Pro icon" />
            <span>Remote Trackpad</span>
          </a>

          <div className="nav-links">
            <a href="#simulator">Simulator</a>
            <a href="#architecture">Turbo UDP</a>
            <a href="#decks">Control Decks</a>
            <a href="#platforms">Ecosystem</a>
            <a href="#download">Downloads</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="icon-pill-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Theme: ${theme === 'dark' ? 'Obsidian Dark' : 'Studio Light'}`}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <a
              href="https://github.com/AgrShubham/Remote-trackpad-app"
              target="_blank"
              rel="noreferrer"
              className="icon-pill-btn"
              aria-label="View source on GitHub"
              title="GitHub Repository"
            >
              ⌥
            </a>
            <a href="#download" className="cta-pill">
              Download v1.5.0
            </a>
          </div>
        </nav>
      </header>

      <main id="top" className="container">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="pulse-dot" />
            <span>v1.5.0 Release · Turbo UDP &amp; Android TV Server</span>
          </div>

          <h1 className="hero-title">
            Zero-latency control for your{' '}
            <span className="gradient-text">entire screen ecosystem.</span>
          </h1>

          <p className="hero-subtitle">
            Transform your Android phone into a hardware-grade wireless trackpad, keyboard, dual-stick gamepad, and media deck for Windows, macOS, and Android TV.
          </p>

          <div className="hero-ctas">
            <a href="#download" className="btn-primary">
              Download for {activePlatform === 'tv' ? 'Android TV' : activePlatform === 'macos' ? 'macOS' : 'Windows'} &amp; Mobile
            </a>
            <a href="#simulator" className="btn-secondary">
              Try Live Simulator ↓
            </a>
          </div>

          <div className="accent-bar" role="group" aria-label="Accent color theme">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              Accent
            </span>
            {ACCENTS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`accent-swatch ${accent.id === preset.id ? 'active' : ''}`}
                style={{ backgroundColor: preset.hex }}
                aria-label={`Set ${preset.label} accent`}
                aria-pressed={accent.id === preset.id}
                title={preset.label}
                onClick={() => setAccent(preset)}
              />
            ))}
          </div>

          <LiveSimulator />
        </section>

        {/* TURBO UDP ARCHITECTURE */}
        <section id="architecture" className="section-block reveal">
          <div className="section-eyebrow">Dual-Transport Networking</div>
          <h2 className="section-heading">Built for sub-millisecond feel.</h2>
          <p className="section-lead">
            Standard remote apps choke on TCP retransmission stalls. Remote Trackpad splits traffic cleanly across UDP and TCP so your cursor stays locked to your finger at 120Hz.
          </p>

          <div className="race-grid">
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1.05rem' }}>Turbo UDP 5002 (Cursor &amp; Gamepad)</strong>
                <span className="mono" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>
                  0.4ms avg · Zero Stall
                </span>
              </div>
              <div className="race-track" aria-hidden="true">
                <div className="race-pulse-fast" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', marginBottom: 0 }}>
                Fire-and-forget datagrams stream raw dx/dy deltas immediately—no handshake overhead or head-of-line blocking.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1.05rem' }}>Legacy TCP-Only Remotes</strong>
                <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  18–65ms · Retransmit Stalls
                </span>
              </div>
              <div className="race-track" aria-hidden="true">
                <div className="race-pulse-slow" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '12px', marginBottom: 0 }}>
                Every dropped Wi-Fi packet freezes the pointer while the OS waits for acknowledgments.
              </p>
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              marginTop: '20px',
              padding: '22px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700 }}>
                UDP :5001
              </div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>Auto-Discovery Beacon</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
                Broadcasts host name, OS icon &amp; ports on local Wi-Fi.
              </div>
            </div>
            <div>
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700 }}>
                TCP :5000
              </div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>Reliable Control Channel</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
                Guaranteed delivery for keystrokes, clicks, modifiers &amp; power actions.
              </div>
            </div>
            <div>
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700 }}>
                UDP :5002
              </div>
              <div style={{ fontWeight: 600, marginTop: '4px' }}>Turbo Motion Stream</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
                High-frequency cursor deltas, two-finger scroll &amp; analog sticks.
              </div>
            </div>
          </div>
        </section>

        {/* STICKY STORYTELLING CHAPTERS */}
        <section id="decks" className="section-block reveal">
          <div className="section-eyebrow">5 Specialized Control Decks</div>
          <h2 className="section-heading">One app. Every input modality.</h2>
          <p className="section-lead">
            Select any control deck below to inspect how the mobile app pairs haptic ergonomics with host-side precision.
          </p>

          <div className="chapters-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {DECK_CHAPTERS.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={`chapter-card ${activeChapter === idx ? 'active' : ''}`}
                  onClick={() => setActiveChapter(idx)}
                  style={{ textAlign: 'left', color: 'inherit', fontFamily: 'inherit' }}
                >
                  <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--accent)', fontWeight: 700 }}>
                    {chapter.eyebrow}
                  </div>
                  <div style={{ fontSize: '1.12rem', fontWeight: 700, marginTop: '4px' }}>{chapter.title}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                    {chapter.summary}
                  </p>
                </button>
              ))}
            </div>

            <div className="glass-card sticky-stage">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span className="hero-badge" style={{ marginBottom: 0 }}>
                  {currentChapter.badge}
                </span>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Deck {activeChapter + 1} / {DECK_CHAPTERS.length}
                </span>
              </div>

              <h3 style={{ fontSize: '1.55rem', marginBottom: '10px', letterSpacing: '-0.02em' }}>
                {currentChapter.visualTitle}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                {currentChapter.visualDesc}
              </p>

              <ul style={{ paddingLeft: '18px', margin: '0 0 24px 0', display: 'grid', gap: '10px' }}>
                {currentChapter.highlights.map((item) => (
                  <li key={item} style={{ fontSize: '0.92rem' }}>
                    {item}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '18px',
                }}
              >
                {currentChapter.metrics.map((m) => (
                  <div key={m.label}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {m.label}
                    </div>
                    <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '4px', color: 'var(--accent)' }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UNIVERSAL HOST ECOSYSTEM */}
        <section id="platforms" className="section-block reveal">
          <div className="section-eyebrow">Universal Host Ecosystem</div>
          <h2 className="section-heading">Control Windows, Android TV, and macOS seamlessly.</h2>
          <p className="section-lead">
            Run the lightweight host server on any device on your network and jump between screens from a single mobile hub.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {(['windows', 'tv', 'macos'] as PlatformKey[]).map((key) => (
              <button
                key={key}
                type="button"
                className={activePlatform === key ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActivePlatform(key)}
                style={{ padding: '10px 20px', fontSize: '0.92rem' }}
              >
                {key === 'windows' ? 'Windows Host' : key === 'tv' ? 'Android TV Server' : 'macOS Host'}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px', alignItems: 'center' }}>
            <div>
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.84rem', fontWeight: 700 }}>
                {currentPlatform.badge}
              </div>
              <h3 style={{ fontSize: '1.65rem', margin: '8px 0 8px' }}>{currentPlatform.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 0, marginBottom: '18px' }}>{currentPlatform.tagline}</p>
              <ul style={{ paddingLeft: '18px', margin: 0, display: 'grid', gap: '10px' }}>
                {currentPlatform.details.map((line) => (
                  <li key={line} style={{ fontSize: '0.94rem' }}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {currentPlatform.hasBanner ? (
                <img
                  src="/tv-banner.png"
                  alt="Remote Trackpad Pro Android TV Leanback Banner"
                  style={{
                    width: '100%',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  style={{
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    padding: '22px',
                  }}
                >
                  <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--accent)', marginBottom: '10px' }}>
                    ● HOST DAEMON ACTIVE
                  </div>
                  <div className="mono" style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                    <div>Binding TCP Control :5000</div>
                    <div>Binding UDP Turbo   :5002</div>
                    <div>Beacon Broadcast    :5001</div>
                    <div style={{ color: 'var(--text-primary)', marginTop: '6px' }}>
                      Status: Ready for pairing on local Wi-Fi
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* DOWNLOAD CENTER */}
        <section id="download" className="section-block reveal">
          <div className="section-eyebrow">v1.5.0 Release Center</div>
          <h2 className="section-heading">Download &amp; pair in 30 seconds.</h2>
          <p className="section-lead">
            Install the mobile controller on your Android phone and launch the matching host server on your target screen.
          </p>

          <div className="download-grid">
            <div className="glass-card platform-card">
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                MOBILE CONTROLLER
              </div>
              <h3 style={{ margin: '8px 0 6px' }}>Android Phone App</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1 }}>
                5 control decks, Material 3 Obsidian/Light theme, haptics &amp; UDP auto-discovery.
              </p>
              <a
                href="https://github.com/AgrShubham/Remote-trackpad-app/releases/download/v1.5.0/app-release.apk"
                className="btn-primary"
                style={{ textAlign: 'center', marginTop: '14px', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                Download app-release.apk
              </a>
            </div>

            <div className="glass-card platform-card">
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                WINDOWS HOST
              </div>
              <h3 style={{ margin: '8px 0 6px' }}>Windows PC Server</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1 }}>
                Standalone executable with System Tray UI and low-latency Win32 SendInput.
              </p>
              <a
                href="https://github.com/AgrShubham/Remote-trackpad-app/releases/download/v1.5.0/RemoteMouseServer.exe"
                className="btn-primary"
                style={{ textAlign: 'center', marginTop: '14px', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                Download .exe
              </a>
            </div>

            <div className="glass-card platform-card">
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                TELEVISION HOST
              </div>
              <h3 style={{ margin: '8px 0 6px' }}>Android TV Server</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1 }}>
                Leanback 10-foot server with overlay cursor, IME keyboard &amp; wake lock.
              </p>
              <a
                href="https://github.com/AgrShubham/Remote-trackpad-app/releases/download/v1.5.0/android-tv-server.apk"
                className="btn-primary"
                style={{ textAlign: 'center', marginTop: '14px', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                Download TV .apk
              </a>
            </div>

            <div className="glass-card platform-card">
              <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700 }}>
                APPLE HOST
              </div>
              <h3 style={{ margin: '8px 0 6px' }}>macOS Build Script</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1 }}>
                Build the native Quartz CGEvent server directly on Apple Silicon or Intel Macs.
              </p>
              <a
                href="https://github.com/AgrShubham/Remote-trackpad-app/blob/main/server/build_macos.sh"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ textAlign: 'center', marginTop: '14px', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                View build_macos.sh ↗
              </a>
            </div>
          </div>

          <div className="glass-card" style={{ marginTop: '24px', padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <strong>Quick Terminal Setup</strong>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={setupTab === 'tv' ? 'cta-pill' : 'icon-pill-btn'}
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={() => setSetupTab('tv')}
                >
                  Android TV (ADB)
                </button>
                <button
                  type="button"
                  className={setupTab === 'macos' ? 'cta-pill' : 'icon-pill-btn'}
                  style={{ width: 'auto', padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={() => setSetupTab('macos')}
                >
                  macOS Build
                </button>
              </div>
            </div>

            {setupTab === 'tv' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <code className="mono" style={{ fontSize: '0.88rem' }}>
                  adb connect &lt;TV_IP&gt;:5555 &amp;&amp; adb install -r android-tv-server.apk
                </code>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => copyCommand('adb connect <TV_IP>:5555 && adb install -r android-tv-server.apk')}
                >
                  {copiedCmd?.includes('adb') ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <code className="mono" style={{ fontSize: '0.88rem' }}>
                  cd server &amp;&amp; chmod +x build_macos.sh &amp;&amp; ./build_macos.sh
                </code>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => copyCommand('cd server && chmod +x build_macos.sh && ./build_macos.sh')}
                >
                  {copiedCmd?.includes('build_macos') ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            )}

            <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Looking for checksums or previous builds? View the full{' '}
              <a
                href="https://github.com/AgrShubham/Remote-trackpad-app/releases/tag/v1.5.0"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent)', fontWeight: 600 }}
              >
                v1.5.0 GitHub Release Notes ↗
              </a>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION (no headings inside <summary> per accessibility guidance) */}
        <section id="faq" className="section-block reveal">
          <div className="section-eyebrow">Frequently Asked Questions</div>
          <h2 className="section-heading">Architecture &amp; setup details.</h2>

          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-body">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="watermark" aria-hidden="true">
            REMOTE TRACKPAD
          </div>
          <p style={{ margin: '12px 0 6px' }}>
            Remote Trackpad &amp; Gamepad Pro v1.5.0 · Local Wi-Fi, Zero Cloud, Open Source
          </p>
          <p style={{ margin: 0, fontSize: '0.84rem' }}>
            <a
              href="https://github.com/AgrShubham/Remote-trackpad-app"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              GitHub Repository
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/AgrShubham/Remote-trackpad-app/releases/tag/v1.5.0"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent)' }}
            >
              Release v1.5.0
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}

export default App;


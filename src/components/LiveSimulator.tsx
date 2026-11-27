import React, { useState, useRef } from 'react';

type SimDeck = 'touchpad' | 'keyboard' | 'gamepad';

export const LiveSimulator: React.FC = () => {
  const [deck, setDeck] = useState<SimDeck>('touchpad');
  const [cursor, setCursor] = useState({ x: 52, y: 48 });
  const [typedBuffer, setTypedBuffer] = useState('Remote Mouse Pro — <1ms UDP');
  const [lastAction, setLastAction] = useState('Glide on the phone touchpad →');
  const [preset, setPreset] = useState('Xbox Pro');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const handlePadMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 100;
    const ny = ((e.clientY - rect.top) / rect.height) * 100;

    if (lastPosRef.current) {
      const dx = (nx - lastPosRef.current.x) * 1.15;
      const dy = (ny - lastPosRef.current.y) * 1.15;
      setCursor((prev) => ({
        x: Math.max(4, Math.min(94, prev.x + dx)),
        y: Math.max(6, Math.min(90, prev.y + dy)),
      }));
    }
    lastPosRef.current = { x: nx, y: ny };
    setLastAction('UDP 5002 • Streaming sub-pixel delta');
  };

  const handlePadLeave = () => {
    lastPosRef.current = null;
  };

  const handleKeyTap = (k: string) => {
    if (k === '⌫') {
      setTypedBuffer((prev) => prev.slice(0, -1));
      setLastAction('Key: Backspace');
    } else if (k === 'Space') {
      setTypedBuffer((prev) => prev + ' ');
      setLastAction('Key: Space');
    } else if (k === 'Clear') {
      setTypedBuffer('');
      setLastAction('Cleared buffer');
    } else {
      setTypedBuffer((prev) => (prev + k).slice(-38));
      setLastAction(`Key: ${k}`);
    }
  };

  return (
    <div className="glass-card simulator-theater" id="simulator">
      {/* Left: Interactive Phone Controller */}
      <div className="phone-shell">
        <div className="sim-tabs" role="tablist" aria-label="Simulator deck switcher">
          {(['touchpad', 'keyboard', 'gamepad'] as SimDeck[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={deck === tab}
              className={`sim-tab-btn ${deck === tab ? 'active' : ''}`}
              onClick={() => setDeck(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {deck === 'touchpad' && (
          <>
            <div
              className="virtual-pad"
              onPointerMove={handlePadMove}
              onPointerLeave={handlePadLeave}
              onClick={() => setLastAction('Tap Click → Left Mouse Button')}
            >
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>
                INTERACTIVE TRACKPAD
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                Move cursor here to steer PC screen
              </span>
            </div>
            <div className="pad-buttons-row">
              <button
                type="button"
                className="pad-click-btn"
                onClick={() => setLastAction('Left Click Dispatched')}
              >
                Left Click
              </button>
              <button
                type="button"
                className="pad-click-btn"
                onClick={() => setLastAction('Right Click Dispatched')}
              >
                Right Click
              </button>
            </div>
          </>
        )}

        {deck === 'keyboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
            <div
              className="virtual-pad"
              style={{ minHeight: 88 }}
              onPointerMove={handlePadMove}
              onPointerLeave={handlePadLeave}
            >
              <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                UPPER MINI-TOUCHPAD
              </span>
            </div>
            <div className="sim-key-grid">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'A', 'S', 'D', 'F', 'G', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  className="sim-keycap"
                  onClick={() => handleKeyTap(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 6 }}>
              <button type="button" className="sim-keycap" onClick={() => handleKeyTap('Space')}>
                Space
              </button>
              <button type="button" className="sim-keycap" onClick={() => handleKeyTap('Clear')}>
                Clear
              </button>
            </div>
          </div>
        )}

        {deck === 'gamepad' && (
          <div
            className="virtual-pad"
            style={{ justifyContent: 'space-between', padding: 14 }}
            onPointerMove={handlePadMove}
            onPointerLeave={handlePadLeave}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Xbox Pro', 'DualSense', 'FPS Aim', 'Racing'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`sim-tab-btn ${preset === p ? 'active' : ''}`}
                  style={{ border: '1px solid var(--border-subtle)', padding: '4px 8px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreset(p);
                    setLastAction(`Gamepad Preset: ${p}`);
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingInline: 8 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  border: '2px solid var(--accent-border)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                L-STICK
              </div>
              <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Blank Space =<br />Ambient Mouse
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {['Y', 'B', 'X', 'A'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="sim-keycap"
                    style={{ width: 28, height: 28, padding: 0, borderRadius: '50%' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLastAction(`Gamepad Button: ${b}`);
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>
              Active: {preset}
            </span>
          </div>
        )}
      </div>

      {/* Right: Simulated Host PC / Android TV Screen */}
      <div className="screen-stage">
        <div className="screen-topbar mono">
          <span>🖥️ HOST RECEIVER • WINDOWS / MAC / ANDROID TV</span>
          <span style={{ color: 'var(--accent)' }}>● CONNECTED • 1ms UDP</span>
        </div>

        <div className="screen-canvas">
          {/* Simulated Cursor */}
          <svg
            className="sim-cursor"
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 3L10.5 20L13.8 13.4L20.5 11.2L4 3Z"
              fill="var(--accent)"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              CURSOR X:{Math.round(cursor.x * 19.2)} Y:{Math.round(cursor.y * 10.8)}
            </span>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
              {lastAction}
            </span>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 14,
              padding: 16,
              marginTop: 24,
            }}
          >
            <div className="mono" style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 6 }}>
              LIVE INPUT BUFFER (TRY THE KEYBOARD TAB)
            </div>
            <div className="mono" style={{ fontSize: '1.05rem', color: '#ffffff', minHeight: 26 }}>
              {typedBuffer}
              <span style={{ color: 'var(--accent)' }}>|</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
            {[
              { title: 'Windows Host', sub: 'RemoteMouseServer.exe' },
              { title: 'Android TV', sub: 'Leanback + IME Cursor' },
              { title: 'macOS Host', sub: 'Menu Bar + Cocoa Tray' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.title}</div>
                <div className="mono" style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 3 }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


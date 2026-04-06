import { useState, useRef, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

// ─── Petal Particle System ────────────────────────────────────────────────────
function PetalCanvas() {
  const canvasRef = useRef(null)
  const petals = useRef([])
  const animRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const CHARS = ['✿', '❀', '✾', '❁', '⚘']
    const COLORS = ['#ffb7c5', '#f9a8d4', '#ddd6fe', '#c4b5fd', '#fda4af', '#fbcfe8']
    for (let i = 0; i < 38; i++) {
      petals.current.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, size: 10 + Math.random() * 16, char: CHARS[Math.floor(Math.random() * CHARS.length)], color: COLORS[Math.floor(Math.random() * COLORS.length)], speed: 0.3 + Math.random() * 0.7, drift: (Math.random() - 0.5) * 0.5, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.02, opacity: 0.15 + Math.random() * 0.35 })
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      petals.current.forEach(p => { ctx.save(); ctx.globalAlpha = p.opacity; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.font = `${p.size}px serif`; ctx.fillStyle = p.color; ctx.fillText(p.char, 0, 0); ctx.restore(); p.y += p.speed; p.x += p.drift; p.rot += p.rotSpeed; if (p.y > canvas.height + 30) { p.y = -30; p.x = Math.random() * canvas.width }; if (p.x > canvas.width + 30) p.x = -30; if (p.x < -30) p.x = canvas.width + 30 })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
}

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.12 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(36px)', transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s` }}>{children}</div>
}

// ─── Timer Block ──────────────────────────────────────────────────────────────
function TimerBlock({ timer, gradient }) {
  const t = timer || {}
  const units = [{ v: t.years || 0, l: 'Y' }, { v: t.months || 0, l: 'M' }, { v: t.days || 0, l: 'D' }, { v: t.hours || 0, l: 'H' }, { v: t.minutes || 0, l: 'min' }, { v: t.seconds || 0, l: 'sec', pulse: true }]
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '28px 24px', display: 'inline-block', maxWidth: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
        {units.map((u, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: gradient, borderRadius: '12px', padding: '10px 14px', fontFamily: "'Courier New',monospace", fontSize: 'clamp(1.1rem,3vw,1.6rem)', fontWeight: 700, color: '#fff', minWidth: '48px', textAlign: 'center', animation: u.pulse ? 'softPulse 1s ease-in-out infinite' : 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>{String(u.v).padStart(2, '0')}</div>
            <span style={{ color: 'rgba(255,180,200,0.7)', fontSize: '0.75rem', fontFamily: 'Georgia,serif' }}>{u.l}</span>
            {i < units.length - 1 && <span style={{ color: 'rgba(255,180,200,0.4)', fontSize: '1rem', marginRight: '2px' }}>:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ front, back, accent }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div onClick={() => setFlipped(f => !f)} style={{ perspective: '1000px', cursor: 'pointer', width: '100%', height: '160px' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform 0.7s ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: `linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))`, border: `1px solid ${accent}40`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.6 }}>{front}</p>
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `linear-gradient(135deg,${accent}30,${accent}10)`, border: `1px solid ${accent}60`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 'clamp(0.85rem,2vw,1rem)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>{back}</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,180,200,0.4)', marginTop: '6px', letterSpacing: '0.1em', fontFamily: 'Georgia,serif' }}>tap to read</p>
    </div>
  )
}

// ─── Voice Note Player ────────────────────────────────────────────────────────
function VoiceNote({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dur, setDur] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  useEffect(() => {
    const a = audioRef.current; if (!a) return
    const onTime = () => { setProgress((a.currentTime / a.duration) * 100 || 0); setCurrentTime(a.currentTime) }
    const onLoad = () => setDur(a.duration)
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrentTime(0) }
    a.addEventListener('timeupdate', onTime); a.addEventListener('loadedmetadata', onLoad); a.addEventListener('ended', onEnd)
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('loadedmetadata', onLoad); a.removeEventListener('ended', onEnd) }
  }, [])
  const toggle = () => { if (!audioRef.current) return; if (playing) { audioRef.current.pause(); setPlaying(false) } else { audioRef.current.play(); setPlaying(true) } }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const bars = [3, 5, 8, 12, 16, 10, 6, 14, 18, 8, 5, 12, 20, 10, 6, 14, 8, 16, 12, 5, 8, 14, 10, 6, 18, 12, 8, 5]
  return (
    <div onClick={toggle} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(249,168,212,0.2)', borderRadius: '100px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '300px', margin: '0 auto', cursor: 'pointer' }}>
      <audio ref={audioRef} src={src} />
      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#db2777,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: playing ? '0 0 20px rgba(219,39,119,0.5)' : 'none', transition: 'box-shadow 0.3s ease' }}>
        <span style={{ fontSize: '0.85rem', marginLeft: playing ? 0 : '2px' }}>{playing ? '⏸' : '▶'}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '5px', height: '20px' }}>
          {bars.map((h, i) => <div key={i} style={{ width: '2px', height: `${h}px`, borderRadius: '2px', background: (i / bars.length) * 100 <= progress ? 'linear-gradient(to top,#db2777,#c084fc)' : 'rgba(255,255,255,0.18)', transition: 'background 0.1s', flexShrink: 0 }} />)}
        </div>
        <div style={{ fontFamily: "'Lato',sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{dur ? `${fmt(currentTime)} / ${fmt(dur)}` : 'your voice…'}</div>
      </div>
    </div>
  )
}

// ─── Memory Image ─────────────────────────────────────────────────────────────
function MemoryImage({ src }) {
  return (
    <div style={{ maxWidth: '320px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <img src={src} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'center 25%', display: 'block', borderRadius: 0 }} />
    </div>
  )
}

// ─── Memory Card ─────────────────────────────────────────────────────────────
function MemoryCard({ number, label, title, lines, accent, media, mediaCaption, highlight }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.5rem,6vw,3.5rem)', fontWeight: 300, color: `${accent}30`, lineHeight: 1, flexShrink: 0 }}>{number}</span>
        <div>
          <p style={{ fontFamily: "'Lato',sans-serif", fontSize: '0.7rem', color: `${accent}99`, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 300 }}>{label}</p>
          <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.3rem,3.5vw,1.9rem)', fontWeight: highlight ? 500 : 300, color: highlight ? '#fff' : 'rgba(255,255,255,0.88)', fontStyle: 'italic', lineHeight: 1.3 }}>{title}</h3>
        </div>
      </div>
      <div style={{ background: highlight ? `linear-gradient(135deg,${accent}12,rgba(255,255,255,0.03))` : 'rgba(255,255,255,0.03)', border: `1px solid ${highlight ? accent + '35' : 'rgba(255,255,255,0.07)'}`, borderRadius: '20px', padding: 'clamp(24px,5vw,40px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: `linear-gradient(to bottom,${accent},transparent)`, borderRadius: '3px 0 0 3px' }} />
        {media && <div style={{ marginBottom: '28px' }}>{media}{mediaCaption && <p style={{ textAlign: 'center', marginTop: '10px', fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', letterSpacing: '0.08em' }}>{mediaCaption}</p>}</div>}
        <div style={{ paddingLeft: '16px' }}>
          {lines.map((line, i) => <p key={i} style={{ fontFamily: i === 0 ? "'Cormorant Garamond',Georgia,serif" : "'Lato',sans-serif", fontSize: i === 0 ? 'clamp(1rem,2.5vw,1.15rem)' : 'clamp(0.88rem,2vw,1rem)', fontStyle: i === 0 ? 'italic' : 'normal', color: i === 0 ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.52)', lineHeight: 1.95, fontWeight: 300, marginBottom: i < lines.length - 1 ? '10px' : 0 }}>{line}</p>)}
        </div>
      </div>
    </div>
  )
}

// ─── Memory Divider ───────────────────────────────────────────────────────────
function MemoryDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '52px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right,transparent,rgba(255,255,255,0.06))' }} />
      <span style={{ color: 'rgba(249,168,212,0.25)', fontSize: '0.7rem' }}>✦</span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left,transparent,rgba(255,255,255,0.06))' }} />
    </div>
  )
}

// ─── Confession Box ───────────────────────────────────────────────────────────
function ConfessionBox() {
  const [revealed, setRevealed] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = () => { setRevealed(true); setTimeout(() => setOpen(true), 80) }
  return (
    <div style={{ textAlign: 'center' }}>
      {!revealed ? (
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.85rem,2vw,1rem)', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', marginBottom: '20px', letterSpacing: '0.05em' }}>there's one more thing…</p>
          <button onClick={handleOpen}
            style={{ background: 'none', border: '1px solid rgba(249,168,212,0.2)', borderRadius: '100px', padding: '13px 36px', color: 'rgba(249,168,212,0.45)', fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '0.92rem', fontStyle: 'italic', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,168,212,0.5)'; e.currentTarget.style.color = 'rgba(249,168,212,0.9)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(219,39,119,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(249,168,212,0.2)'; e.currentTarget.style.color = 'rgba(249,168,212,0.45)'; e.currentTarget.style.boxShadow = 'none' }}>
            only if you want to know ✦
          </button>
        </div>
      ) : (
        <div style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(24px)', transition: 'all 1.4s ease', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ position: 'relative', background: 'rgba(219,39,119,0.05)', border: '1px solid rgba(219,39,119,0.18)', borderRadius: '20px', padding: 'clamp(28px,5vw,52px)', textAlign: 'left' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: 'radial-gradient(ellipse at top,rgba(219,39,119,0.08),transparent 70%)', pointerEvents: 'none' }} />
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.72rem,1.6vw,0.8rem)', color: 'rgba(249,168,212,0.4)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '28px' }}>the thing I never planned to say</p>
            {[
              { t: "One day — not by my choice, not by any plan — a situation forced my hand.", italic: true },
              { t: "I had decided, long before, that I would carry this feeling for a lifetime and never say a word to you. That was the plan. My plan. The only safe one." },
              { t: "But that day, I told you. Not as a question. Not asking for anything back. I didn't even ask what you thought — I just needed you to know. Because some truths get too heavy to carry alone forever." },
              { t: "I don't regret it. Even if nothing changes between us. Even if everything stays exactly as it is." },
              { t: "Because you deserved to know — that someone sees you, completely and quietly, and thinks you are worth every unreturned, unspoken, silent feeling." },
              { t: "That someone is me. It has always been me.", italic: true, accent: true },
            ].map((p, i) => <p key={i} style={{ fontFamily: p.accent ? "'Cormorant Garamond',Georgia,serif" : "'Lato',sans-serif", fontSize: p.accent ? 'clamp(1rem,2.5vw,1.2rem)' : 'clamp(0.88rem,2vw,0.98rem)', fontStyle: p.italic ? 'italic' : 'normal', fontWeight: 300, color: p.accent ? 'rgba(249,168,212,0.9)' : 'rgba(255,255,255,0.6)', lineHeight: 1.95, marginBottom: i < 5 ? '18px' : 0 }}>{p.t}</p>)}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Polaroid Scatter ─────────────────────────────────────────────────────────
// ↓ Add ALL her image paths here. As many as you have.


const ALL_HER_IMAGES = [
  '/images/1.jpg', '/images/2.jpeg', '/images/3.jpg',
  '/images/4.jpg', '/images/5.jpg', '/images/6.jpg',
  '/images/7.jpg', '/images/8.jpg', '/images/9.jpg',
  '/images/10.jpg', '/images/11.jpg', '/images/12.jpg',
  '/images/13.jpg', '/images/14.jpg', '/images/15.jpg',
  '/images/16.jpg', '/images/17.jpg', '/images/18.jpg',
  '/images/19.jpg', '/images/20.jpg',
];

const CAPTIONS = [
  "My favorite view", "Pure magic", "That smile...", "Memories",
  "Forever", "Stay like this", "The best day", "Thinking of you",
  "Golden hour", "Simply beautiful", "Us", "Always & Forever"
];

const seededRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// FIXED: Added { images } prop to the signature
const PolaroidScatter = ({ images = ALL_HER_IMAGES }) => {
  const items = useMemo(() => {
    const rand = seededRand(42);
    return images.map((src, i) => {
      const depth = rand();
      const isLarge = depth > 0.65;

      return {
        src,
        id: i,
        left: rand() * 100,
        top: rand() * 100,
        rot: (rand() - 0.5) * 40,
        w: isLarge ? 220 + rand() * 100 : 90 + rand() * 60,
        opacity: isLarge ? 0.7 : 0.2,
        blur: isLarge ? 0 : 2,
        zIndex: Math.floor(depth * 50),
        // Speed is now tied to size (Parallax effect)
        dur: isLarge ? 12 + rand() * 8 : 25 + rand() * 15,
        delay: -(rand() * 20),
        driftX: (rand() - 0.5) * 80,
        driftY: (rand() - 0.5) * 80,
        caption: isLarge ? CAPTIONS[Math.floor(rand() * CAPTIONS.length)] : null,
        hasTape: rand() > 0.7,
      };
    });
  }, [images]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 1
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap');
          
          .polaroid-item {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
                        opacity 0.5s ease, 
                        filter 0.5s ease;
            pointer-events: auto; /* Allows hover while container is passive */
          }

          .polaroid-item:hover {
            transform: translate(-50%, -50%) scale(1.15) rotate(0deg) !important;
            opacity: 1 !important;
            filter: blur(0px) brightness(1.1) !important;
            z-index: 999 !important;
            cursor: pointer;
          }

          ${items.map(p => `
            @keyframes drift-${p.id} {
              0%, 100% { transform: translate(-50%, -50%) rotate(${p.rot}deg); }
              50% { transform: translate(calc(-50% + ${p.driftX}px), calc(-50% + ${p.driftY}px)) rotate(${p.rot + 8}deg); }
            }
            
            @keyframes popIn-${p.id} {
              from { opacity: 0; transform: translate(-50%, -50%) scale(0.5) rotate(${p.rot - 20}deg); }
              to { opacity: ${p.opacity}; transform: translate(-50%, -50%) scale(1) rotate(${p.rot}deg); }
            }
          `).join('')}
        `}
      </style>

      {items.map((p, idx) => (
        <div
          key={p.id}
          className="polaroid-item"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.w}px`,
            zIndex: p.zIndex,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            animation: `
              popIn-${p.id} 1s ease-out ${idx * 0.1}s backwards,
              drift-${p.id} ${p.dur}s ease-in-out infinite
            `,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Tape with realistic "frosted" texture */}
          {p.hasTape && (
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%) rotate(-4deg)',
              width: '60px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.25)',
              borderLeft: '1px solid rgba(255,255,255,0.3)',
              borderRight: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(2px)',
              zIndex: 10,
            }} />
          )}

          {/* Polaroid Frame with "Grainy" Photo Effect */}
          <div style={{
            background: '#fff',
            padding: `${p.w * 0.05}px ${p.w * 0.05}px ${p.caption ? p.w * 0.24 : p.w * 0.08}px`,
            borderRadius: '2px',
            boxShadow: `
              ${p.zIndex / 8}px ${p.zIndex / 4}px ${p.zIndex / 2}px rgba(0,0,0,0.5),
              0 0 40px rgba(0,0,0,0.1) inset
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <img
                src={p.src}
                alt=""
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'contrast(1.1) saturate(1.1)',
                }}
              />
              {/* Subtle Film Grain Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
                opacity: 0.1,
                pointerEvents: 'none'
              }} />
            </div>

            {p.caption && (
              <span style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: `${p.w * 0.13}px`,
                color: '#222',
                marginTop: `${p.w * 0.08}px`,
                textAlign: 'center',
                width: '100%',
                lineHeight: 1,
                transform: 'rotate(-1deg)'
              }}>
                {p.caption}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
function BirthdayExperience() {
  const [showContent, setShowContent] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [timers, setTimers] = useState({})
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  const timerDates = { born: '2003-04-07', firstSaw: '2021-11-27', becameFriends: '2021-12-20', startedLoving: '2022-01-10', changedLife: '2022-12-25' }
  const calcDur = (now, d) => { const diff = now.diff(dayjs(d)); const dur = dayjs.duration(diff); return { years: dur.years(), months: dur.months(), days: dur.days(), hours: dur.hours(), minutes: dur.minutes(), seconds: dur.seconds() } }

  useEffect(() => {
    const iv = setInterval(() => {
      const now = dayjs()
      setTimers({ born: calcDur(now, timerDates.born), firstSaw: calcDur(now, timerDates.firstSaw), becameFriends: calcDur(now, timerDates.becameFriends), startedLoving: calcDur(now, timerDates.startedLoving), changedLife: calcDur(now, timerDates.changedLife) })
    }, 1000)
    return () => clearInterval(iv)
  }, [])

  const handleEnter = () => { setIsTransitioning(true); if (audioRef.current) { audioRef.current.play(); setMusicPlaying(true) }; setTimeout(() => { setShowContent(true); setIsTransitioning(false) }, 3000) }
  const toggleMusic = () => { if (!audioRef.current) return; if (audioRef.current.paused) { audioRef.current.play(); setMusicPlaying(true) } else { audioRef.current.pause(); setMusicPlaying(false) } }

  const reasons = [
    { front: "The way you exist…", back: "There's something about you that makes ordinary days feel like they matter more than they ever did before you were in them." },
    { front: "Every time I see you…", back: "Ninu chusina prathi sari — andhuko theleyadhu kaani, kothaga first time chusthunatu undhi. Every single time." },
    { front: "What you did without trying…", back: "You didn't try to fix anything or change anything. You just showed up — and everything quietly got better." },
    { front: "How lucky I feel…", back: "Out of everyone in this world — I got to know you. That alone feels like more luck than one person deserves." },
    { front: "Something I carry silently…", back: "I never said it out loud. I still won't. But it's there — real and steady — every single day." },
    { front: "What today means to me…", back: "For you it's just your birthday. For me, it's the day that gave me you. That makes it everything." },
  ]

  const timelineEvents = [
    { label: "April 7, 2003", title: "The day you came into this world", desc: "I wasn't there. I didn't know you yet. But that day — it quietly set everything in motion.", color: '#c084fc', timer: 'born', gradient: 'linear-gradient(135deg,#7c3aed,#db2777)' },
    { label: "Nov 27, 2021", title: "The first time I saw you", desc: "I was scared and I didn't know why. I understand now.", color: '#60a5fa', timer: 'firstSaw', gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
    { label: "Dec 20, 2021", title: "When we became friends", desc: "Slowly, without me realising — talking to you became the best part of every day.", color: '#f472b6', timer: 'becameFriends', gradient: 'linear-gradient(135deg,#ec4899,#f97316)' },
    { label: "Jan 10, 2022", title: "When I started loving you", desc: "Not a decision. Not a single moment. It just happened — quietly, completely, the way things do when they're real.", color: '#f87171', timer: 'startedLoving', gradient: 'linear-gradient(135deg,#ef4444,#f97316)' },
    { label: "Dec 25, 2022", title: "When you changed my life", desc: "You didn't know it then. But by this day, I was already a different person — because of you.", color: '#34d399', timer: 'changedLife', gradient: 'linear-gradient(135deg,#059669,#0284c7)' },
  ]

  return (
    <div style={{ fontFamily: "'Lato',sans-serif", background: '#0f0a14', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes softPulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes gentleFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes breathe{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.05);opacity:1}}
        .music-btn:hover{transform:scale(1.1) rotate(10deg) !important}
        .enter-btn:hover{transform:scale(1.04) !important;box-shadow:0 0 60px rgba(219,39,119,0.35) !important}
        img{border-radius:16px}
      `}</style>
      <audio ref={audioRef} loop><source src="/music/birthday-song.mp3" type="audio/mpeg" /></audio>

      {/* ENTRY */}
      {!showContent && !isTransitioning && (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <PetalCanvas />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("/bg2.png")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45) saturate(1.2)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(139,92,246,0.2) 0%,rgba(15,10,20,0.7) 70%)' }} />
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px', animation: 'fadeInUp 1.5s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right,transparent,rgba(249,168,212,0.7))' }} />
              <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>✦</span>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left,transparent,rgba(249,168,212,0.7))' }} />
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1rem,3vw,1.25rem)', color: 'rgba(249,168,212,0.9)', fontStyle: 'italic', letterSpacing: '0.04em', lineHeight: 2, maxWidth: '500px', margin: '0 auto 16px' }}>"Hey… I made something for you."</p>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1rem,3vw,1.25rem)', color: 'rgba(196,181,253,0.75)', fontStyle: 'italic', letterSpacing: '0.04em', maxWidth: '500px', margin: '0 auto 52px', lineHeight: 1.9 }}>It's not much. But it carries everything what i want to say.</p>
            <button className="enter-btn" onClick={handleEnter} style={{ padding: '16px 48px', background: 'linear-gradient(135deg,rgba(219,39,119,0.85),rgba(139,92,246,0.85))', color: '#fff', border: '1px solid rgba(249,168,212,0.3)', borderRadius: '100px', fontSize: '0.95rem', fontFamily: "'Lato',sans-serif", fontWeight: 300, letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.4s ease', backdropFilter: 'blur(10px)', boxShadow: '0 0 40px rgba(219,39,119,0.2)' }}>open ✦</button>
          </div>
        </div>
      )}

      {/* TRANSITION */}
      {isTransitioning && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0f0a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} autoPlay muted playsInline>
            <source src="/transition.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: 'fadeInUp 1s ease forwards' }}>
            <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.8rem,5vw,3rem)', color: 'rgba(249,168,212,0.9)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.05em', animation: 'breathe 2s ease-in-out infinite' }}>loading the feelings…</div>
          </div>
        </div>
      )}

      {/* MAIN */}
      {showContent && (
        <div style={{ position: 'relative' }}>
          <PetalCanvas />
          <button className="music-btn" onClick={toggleMusic} style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 200, width: '48px', height: '48px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', color: musicPlaying ? '#f9a8d4' : '#888', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {musicPlaying ? '🎵' : '🔇'}
          </button>

          {/* S1: HERO */}
          <section style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1a0a2e 0%,#2d1040 40%,#1a0520 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(219,39,119,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ flex: '1 1 340px', maxWidth: '520px', animation: 'fadeInUp 1s ease forwards' }}>
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.8rem,2vw,0.95rem)', color: 'rgba(249,168,212,0.6)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '20px' }}>April 7</p>
                <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2.2rem,7vw,4.5rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '24px', background: 'linear-gradient(135deg,#f9a8d4,#c084fc,#f9a8d4)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
                  Many many happy returns of the day,<br /><em style={{ fontSize: '1.2em' }}>Naana ✨</em>
                </h1>
                <div style={{ height: '1px', background: 'linear-gradient(to right,rgba(249,168,212,0.5),transparent)', marginBottom: '32px' }} />
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1rem,2.5vw,1.3rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.9, fontStyle: 'italic', marginBottom: '20px' }}>"Ee birthday ki pakana levu ani am cheyaalo idea raaka ela plan chesa —<br />naak edhi thapa am vachu 😁😅"</p>
                <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 'clamp(0.9rem,2vw,1.05rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, fontWeight: 300, marginBottom: '16px' }}>You changed my life without even trying to.</p>
                <p style={{ fontFamily: "'Lato',sans-serif", fontSize: 'clamp(0.9rem,2vw,1.05rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, fontWeight: 300, marginBottom: '16px' }}>May your day be filled with every bit of happiness you quietly bring into everyone else's life.</p>
                <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.95rem,2.2vw,1.15rem)', color: 'rgba(249,168,212,0.8)', lineHeight: 1.9, fontStyle: 'italic' }}>ninu chusina prathi sari andhuko theleyadhu kaani — kothaga first time chusthunatu undhi.</p>
              </div>
              <div style={{ flex: '1 1 320px', maxWidth: '480px', animation: 'scaleIn 1.2s ease forwards' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'repeat(3,270px)', gap: '8px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(249,168,212,0.15)' }}>
                  {[{ src: '/images/1.jpg', style: { gridColumn: '1', gridRow: '1/3' } }, { src: '/images/2.jpeg', style: { gridColumn: '2', gridRow: '1' } }, { src: '/images/3.jpg', style: { gridColumn: '2', gridRow: '2' } }, { src: '/images/4.jpg', style: { gridColumn: '1', gridRow: '3' } }, { src: '/images/5.jpg', style: { gridColumn: '2', gridRow: '3' } }].map((img, i) => (
                    <div key={i} style={{ ...img.style, overflow: 'hidden', position: 'relative' }}>
                      <img src={img.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.6s ease', borderRadius: 0, display: 'block' }} onMouseEnter={e => e.target.style.transform = 'scale(1.08)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(139,92,246,0.2),transparent)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* S2: LETTER */}
          <section style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#1a0520 0%,#0d0a1a 50%,#150a25 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'serif', fontSize: '18rem', color: 'rgba(219,39,119,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>❝</div>
            <div style={{ maxWidth: '720px', width: '100%', position: 'relative', zIndex: 2 }}>
              <Reveal><p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.75rem,1.8vw,0.85rem)', color: 'rgba(249,168,212,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '48px' }}>a letter I never sent you</p></Reveal>
              <Reveal delay={0.2}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,168,212,0.12)', borderRadius: '24px', padding: 'clamp(32px,6vw,64px)' }}>
                  {[
                    { text: "I don't know how to say this. I've tried a hundred times in my head." },
                    { text: "You are the kind of person who makes the world look different. Softer. More worth it." },
                    { text: "Every time I see you — I feel lucky in a way I can't explain. Like I'm looking at something rare that most people just walk past." },
                    { text: "You never asked for any of this. You just existed — and somehow, that alone was enough to change everything about how I see every ordinary day." },
                    { text: "I'm not going to say more. Some things are heavier when they stay unsaid." },
                    { text: "But I want you to know — this page, these seconds, every timer counting up here — they're all just my way of saying:\nyou matter. More than you know.", pre: true },
                    { text: "Happy birthday, Naana. 🌸", accent: true },
                  ].map((p, i) => <p key={i} style={{ fontFamily: p.accent ? "'Cormorant Garamond',Georgia,serif" : "'Lato',sans-serif", fontSize: p.accent ? 'clamp(1.1rem,3vw,1.4rem)' : 'clamp(0.9rem,2.2vw,1.05rem)', fontWeight: p.accent ? 400 : 300, fontStyle: p.accent ? 'italic' : 'normal', color: p.accent ? 'rgba(249,168,212,0.9)' : 'rgba(255,255,255,0.7)', lineHeight: 1.95, marginBottom: i < 6 ? '28px' : 0, whiteSpace: p.pre ? 'pre-line' : 'normal' }}>{p.text}</p>)}
                </div>
              </Reveal>
            </div>
          </section>

          {/* S3: FLIP CARDS */}
          <section style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#150a25 0%,#200d35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
            <div style={{ maxWidth: '960px', width: '100%' }}>
              <Reveal>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300, color: 'rgba(255,255,255,0.85)', marginBottom: '16px' }}>Things I never said to you…</h2>
                  <p style={{ fontFamily: "'Lato',sans-serif", fontSize: '0.85rem', color: 'rgba(249,168,212,0.4)', letterSpacing: '0.15em', fontWeight: 300 }}>tap each card</p>
                </div>
              </Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
                {reasons.map((r, i) => <Reveal key={i} delay={i * 0.1}><FlipCard front={r.front} back={r.back} accent="#db2777" /></Reveal>)}
              </div>
            </div>
          </section>

          {/* S4: TIMELINE */}
          <section style={{ background: 'linear-gradient(180deg,#200d35 0%,#0a0514 100%)', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <Reveal><h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '80px' }}>Our story, in time</h2></Reveal>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom,transparent,rgba(249,168,212,0.3),rgba(139,92,246,0.3),transparent)', transform: 'translateX(-50%)' }} />
                {timelineEvents.map((ev, i) => (
                  <Reveal key={i} delay={i * 0.15}>
                    <div style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: '40px', alignItems: 'flex-start', marginBottom: '80px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '50%', top: '20px', transform: 'translate(-50%,0)', width: '14px', height: '14px', borderRadius: '50%', background: ev.color, boxShadow: `0 0 20px ${ev.color}80`, zIndex: 3 }} />
                      <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left', paddingRight: i % 2 === 0 ? '40px' : 0, paddingLeft: i % 2 === 1 ? '40px' : 0 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: '0.8rem', color: ev.color, letterSpacing: '0.15em', marginBottom: '8px', opacity: 0.8 }}>{ev.label}</p>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 400, color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>{ev.title}</h3>
                        <p style={{ fontFamily: "'Lato',sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300, fontStyle: 'italic' }}>{ev.desc}</p>
                      </div>
                      <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'left' : 'right', paddingLeft: i % 2 === 0 ? '40px' : 0, paddingRight: i % 2 === 1 ? '40px' : 0 }}>
                        <TimerBlock timer={timers[ev.timer]} gradient={ev.gradient} />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* S5: MEMORIES */}
          <section style={{ background: 'linear-gradient(180deg,#0a0514 0%,#130820 50%,#0a0514 100%)', padding: '100px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '30%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(219,39,119,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <Reveal>
                <div style={{ textAlign: 'center', marginBottom: '100px' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(0.75rem,1.8vw,0.85rem)', color: 'rgba(249,168,212,0.45)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>none of it was planned</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 'clamp(2rem,5.5vw,3.2rem)', fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3, fontStyle: 'italic' }}>And that's what made every moment with you everything.</h2>
                  <div style={{ height: '1px', background: 'linear-gradient(to right,transparent,rgba(249,168,212,0.3),transparent)', maxWidth: '200px', margin: '28px auto 0' }} />
                </div>
              </Reveal>

              <Reveal><MemoryCard number="01" label="the first time" accent="#c084fc" title="Your voice came out of my phone." media={<VoiceNote src="./music/first_audio.ogg" />} mediaCaption="your first voice note — the one I still have" lines={["I am a hosteller. You are a day scholar.", "The distance between our worlds felt wider than just the commute.", "But the first time your voice came through my phone — something shifted.", "I didn't expect it. I never expected anything about you."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="02" label="saved" accent="#f472b6" title="The first photo with you officially." media={<MemoryImage src="./images/first_pic.jpg" />} mediaCaption="the first one I saved — still there" lines={["There's a specific kind of feeling when you save someone's photo for the first time.", "You tell yourself it's nothing.", "But you save it anyway."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="03" label="one whole year of waiting" accent="#818cf8" title="I just wanted to see you outside." lines={["You were a day scholar. I was a hosteller.", "The only world I ever saw you in was class and the corridor.", "I wished — just once — to see you somewhere else. Somewhere outside all of that.", "An entire year passed like that.", "Then one day at the bus stop — there you were.", "One year of waiting. And I felt like the luckiest person alive."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="04" label="3rd year, b.tech" accent="#fb7185" media={<MemoryImage src="./images/auto.jpg" />} title="The auto ride I'd wished for." lines={["I had wished for it quietly — never said it out loud, not even to myself.", "Just once — to share an auto with you. Even if you were in the front and I was in the back.", "Even that felt like too much to hope for.", "Then in my third year — it happened.", "Same auto. Same moment.", "I didn't need to say a word."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="05" label="the same day" accent="#fbbf24" media={<MemoryImage src="./images/fed.png" />}title="You fed me with your own hands." highlight lines={["Same day as the auto. My friends were there too — everything was unplanned.", "And then you fed me. With your own hands.", "Something so small. Something I will never forget as long as I live.", "In that moment I understood something I still struggle to put into words:", "the importance you give me — I don't know if I'm even eligible for it.", "But you gave it anyway. That's just who you are."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="06" label="4-2 semester, b.tech" accent="#34d399" title="Just the two of us. Outside. First time."media={<MemoryImage src="./images/bus.png" />} mediaCaption="outside the interview — just us" lines={["An interview. Just you and me — no one else this time.", "We shared food.", "After it was done, I dropped you home.", "Two hours one way. Two hours back alone.", "And I enjoyed every single second of all of it."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="07" label="that one night" accent="#60a5fa" media={<MemoryImage src="./images/first_ride.jpeg" />} title="The bike ride. The night. The roads." lines={["I don't know how to explain what a night ride feels like when you're next to the right person.", "Everything is different — the air, the silence, the spaces between words.", "It wasn't planned. Nothing with you ever was.", "But that night stayed with me.", "Some nights I can still feel exactly what it felt like."]} /></Reveal>
              <MemoryDivider />
              <Reveal><MemoryCard number="08" label="all these years" accent="#c084fc" media={<MemoryImage src="./images/fights.jpg" />}title="The fights that made us real." lines={["We fought. Many times. Over many things.", "And every single fight — every patch-up after — only made this bond heavier.", "More real. More ours.", "That's how you know something matters:", "you fight for it. Even when you're fighting with each other."]} /></Reveal>
              <MemoryDivider />
              <Reveal><ConfessionBox /></Reveal>
            </div>
          </section>

          {/* ── S6: ENDING — POLAROID SCATTER ────────────────────────────────── */}
          <section style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#07040f',
          }}>

            {/* All her photos — scattered polaroids floating in background */}
            <PolaroidScatter images={ALL_HER_IMAGES} />

            {/* Vignette: darkens edges, keeps center readable */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 60% 60% at center, rgba(7,4,15,0.65) 0%, rgba(7,4,15,0.25) 55%, rgba(7,4,15,0.08) 100%)',
            }} />

            {/* Pink glow at center */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', zIndex: 3,
              transform: 'translate(-50%,-50%)',
              width: '700px', height: '700px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(219,39,119,0.14) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            {/* Center text — the final words */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', width: '100%', textAlign: 'center', padding: '60px 24px' }}>

              <Reveal>
                <p style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 'clamp(0.72rem,1.6vw,0.82rem)',
                  color: 'rgba(249,168,212,0.4)',
                  letterSpacing: '0.32em', textTransform: 'uppercase',
                  marginBottom: '44px',
                }}>every photo. every moment. every memory.</p>
              </Reveal>

              <Reveal delay={0.25}>
                <p style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 'clamp(2rem,5.5vw,3.5rem)', fontWeight: 300,
                  color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 1.35,
                  marginBottom: '24px',
                  textShadow: '0 2px 48px rgba(0,0,0,0.95), 0 0 100px rgba(0,0,0,0.6)',
                }}>And after all this time…</p>
              </Reveal>

              <Reveal delay={0.5}>
                <p style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 'clamp(1.6rem,4.5vw,2.8rem)', fontWeight: 300,
                  color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: 1.4,
                  marginBottom: '44px',
                  textShadow: '0 2px 40px rgba(0,0,0,0.95)',
                }}>I still feel the same about you.</p>
              </Reveal>

              <Reveal delay={0.75}>
                <div style={{ height: '1px', background: 'linear-gradient(to right,transparent,rgba(249,168,212,0.5),transparent)', margin: '0 auto 44px', maxWidth: '240px' }} />
              </Reveal>

              <Reveal delay={1.0}>
                <p style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 'clamp(1.2rem,3.2vw,1.9rem)', fontWeight: 300,
                  color: 'rgba(249,168,212,0.88)', fontStyle: 'italic', lineHeight: 1.7,
                  marginBottom: '52px',
                  textShadow: '0 2px 32px rgba(0,0,0,0.9)',
                }}>And this will never stop.</p>
              </Reveal>

              <Reveal delay={1.3}>
                <div style={{
                  fontSize: 'clamp(3rem,8vw,5rem)',
                  animation: 'gentleFloat 3s ease-in-out infinite',
                  display: 'inline-block',
                  filter: 'drop-shadow(0 0 40px rgba(219,39,119,0.7))',
                  marginBottom: '52px',
                }}>❤️</div>
              </Reveal>

              <Reveal delay={1.6}>
                <p style={{
                  fontFamily: "'Cormorant Garamond',Georgia,serif",
                  fontSize: 'clamp(0.75rem,1.6vw,0.88rem)',
                  color: 'rgba(252, 252, 252, 1)', letterSpacing: '0.22em',
                  fontStyle: 'italic',
                  textShadow: '0 1px 20px rgba(255, 255, 255, 1)',
                }}>made with everything I couldn't say to you ✦</p>
              </Reveal>

            </div>
          </section>

        </div>
      )}
    </div>
  )
}

export default BirthdayExperience
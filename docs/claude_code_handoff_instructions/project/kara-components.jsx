// Kara — shared UI primitives & icons
// All Lucide-style stroke icons inlined as SVG (1.75 stroke, no fill unless active)

const KaraIcon = ({ name, size = 22, stroke = 1.75, color = 'currentColor', filled = false }) => {
  const s = stroke;
  const paths = {
    home: <><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20v-9.5z"/><path d="M9 21.5V12h6v9.5"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chat: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    sliders: <><line x1="4" y1="6" x2="11" y2="6"/><line x1="15" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/><line x1="18" y1="18" x2="20" y2="18"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></>,
    chevronLeft: <><path d="m15 18-6-6 6-6"/></>,
    chevronRight: <><path d="m9 18 6-6-6-6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>,
    messageCircle: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    mapPin: <><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    smile: <><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></>,
    arrowLeft: <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
    arrowRight: <><path d="M5 12h14M12 5l7 7-7 7"/></>,
    x: <><path d="M18 6 6 18M6 6l12 12"/></>,
    check: <><path d="M20 6 9 17l-5-5"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    car: <><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></>,
    bike: <><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></>,
    truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    van: <><path d="M3 17V7a2 2 0 0 1 2-2h11l5 6v6"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/></>,
    bicycle: <><circle cx="6" cy="17" r="4"/><circle cx="18" cy="17" r="4"/><path d="M6 17l4-9h4l4 9M10 8h4"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M19 14l.7 2 2 .8-2 .7-.7 2-.7-2-2-.7 2-.8.7-2z"/></>,
    flag: <><path d="M4 21V4a1 1 0 0 1 1-1h12l-3 4 3 4H5a1 1 0 0 1-1-1z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    moreH: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    plusCircle: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>,
    google: <><path d="M21.35 11.1H12v3.2h5.35c-.5 2.4-2.6 4.1-5.35 4.1-3.2 0-5.85-2.6-5.85-5.85S8.8 6.7 12 6.7c1.5 0 2.85.55 3.9 1.45l2.4-2.4C16.65 4.05 14.4 3.1 12 3.1 6.5 3.1 2 7.6 2 13.1s4.5 10 10 10c5.75 0 9.55-4 9.55-9.7 0-.8-.05-1.5-.2-2.3z" fill="currentColor" stroke="none"/></>,
    apple: <><path d="M16.5 2c.7 1.4.4 3.2-.5 4.4-1 1.3-2.5 2.3-4 2.2-.2-1.6.6-3.2 1.5-4.3 1-1.2 2.5-2 3-2.3zM20.5 17.4c-.5 1.2-1.1 2.3-1.9 3.3-1.1 1.4-2.7 2.3-4.5 2.3-1.7 0-2.2-1-4.2-1s-2.6 1-4.2 1c-1.8 0-3.4-1-4.5-2.4-2.4-3.1-3.7-7.7-1.5-11.2 1.1-1.7 3-2.8 5-2.9 1.7 0 3.3 1.1 4.2 1.1s2.9-1.4 5-1.2c.9.05 3.5.4 5.1 2.8-4.5 2.5-3.8 8.7.5 8.2z" fill="currentColor" stroke="none"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></>,
    tune: <><path d="M3 7h18M3 12h18M3 17h18"/><circle cx="8" cy="7" r="2.5" fill="currentColor"/><circle cx="16" cy="12" r="2.5" fill="currentColor"/><circle cx="11" cy="17" r="2.5" fill="currentColor"/></>,
  };
  const path = paths[name];
  if (!path) return null;
  const fill = filled ? color : 'none';
  const strokeColor = filled && (name === 'heart' || name === 'bookmark' || name === 'star') ? color : color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={strokeColor} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
};

// Tag pill (e.g. #JDM)
const KaraTag = ({ children, active = false, onClick }) => (
  <button onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 12px',
    borderRadius: 999,
    background: active ? 'var(--kara-primary)' : 'rgba(255,255,255,0.06)',
    border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.12)'}`,
    color: active ? '#fff' : 'var(--kara-text)',
    fontFamily: 'var(--kara-font-body)', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
    transition: 'all 200ms var(--kara-ease)',
  }}>{children}</button>
);

// Country / type badge
const KaraBadge = ({ children, tone = 'glass' }) => {
  const styles = {
    glass: { background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' },
    purple: { background: 'var(--kara-primary)', color: '#fff', border: '1px solid transparent' },
    outline: { background: 'transparent', color: 'var(--kara-text)', border: '1px solid var(--kara-border-strong)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 10px',
      borderRadius: 999, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em',
      fontFamily: 'var(--kara-font-body)',
      ...styles[tone],
    }}>{children}</span>
  );
};

// Primary button
const KaraButton = ({ children, variant = 'primary', size = 'md', onClick, full = false, icon }) => {
  const sizes = { sm: { h: 36, p: '0 14px', fs: 13 }, md: { h: 48, p: '0 20px', fs: 15 }, lg: { h: 56, p: '0 24px', fs: 16 } };
  const sz = sizes[size];
  const variants = {
    primary: { bg: 'var(--kara-primary)', fg: '#fff', border: '1px solid transparent', shadow: '0 4px 16px rgba(124,58,237,0.4)' },
    outline: { bg: 'transparent', fg: 'var(--kara-text)', border: '1px solid var(--kara-primary)', shadow: 'none' },
    secondary: { bg: 'rgba(255,255,255,0.06)', fg: 'var(--kara-text)', border: '1px solid rgba(255,255,255,0.1)', shadow: 'none' },
    ghost: { bg: 'transparent', fg: 'var(--kara-text)', border: '1px solid transparent', shadow: 'none' },
    danger: { bg: 'var(--kara-danger)', fg: '#fff', border: '1px solid transparent', shadow: 'none' },
    light: { bg: '#fff', fg: '#0a0a0f', border: '1px solid transparent', shadow: 'none' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      height: sz.h, padding: sz.p, width: full ? '100%' : 'auto',
      background: v.bg, color: v.fg, border: v.border, borderRadius: 999,
      boxShadow: v.shadow,
      fontFamily: 'var(--kara-font-body)', fontSize: sz.fs, fontWeight: 600,
      cursor: 'pointer', transition: 'all 200ms var(--kara-ease)',
      letterSpacing: '-0.01em',
    }}>
      {icon}
      {children}
    </button>
  );
};

// Avatar with optional vehicle photo background
const KaraAvatar = ({ size = 36, tone = 'violet-dusk', initial = 'K', online = false }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    position: 'relative', flexShrink: 0,
    border: '1.5px solid rgba(255,255,255,0.1)',
    overflow: 'hidden',
  }}>
    <div className="kara-photo" data-tone={tone} style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--kara-font-display)', fontWeight: 700,
      color: 'rgba(255,255,255,0.85)', fontSize: size * 0.36,
    }}>{initial}</div>
    {online && <div style={{
      position: 'absolute', bottom: 0, right: 0,
      width: size * 0.28, height: size * 0.28, borderRadius: '50%',
      background: 'var(--kara-primary)', border: '2px solid var(--kara-bg)',
    }} />}
  </div>
);

// Real Unsplash imagery mapped to each tone (curated automotive shots)
const KARA_PHOTOS = {
  'cyan-tokyo':     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80', // night sports car neon
  'amber-stance':   'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=80', // golden hour rs
  'track-magenta':  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80',   // track / drift
  'crimson-rwd':    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80', // red sport
  'violet-dusk':    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80', // bmw dusk
  'garage-night':   'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80', // garage night
  'emerald-build':  'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=900&q=80', // green build
};

// Photo with real image + dark overlay for legibility
const KaraPhoto = ({ tone = 'violet-dusk', label, style = {}, children, className = '', src }) => {
  const url = src || KARA_PHOTOS[tone];
  return (
    <div className={`kara-photo ${className}`} data-tone={tone} style={{
      ...style,
      backgroundImage: url ? `url("${url}")` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {label && <div className="kara-photo-label" style={{ background: 'rgba(0,0,0,0.45)', padding: '4px 8px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>{label}</div>}
      {children}
    </div>
  );
};

// Bottom Tab Bar (the canonical 5-tab nav)
const KaraTabBar = ({ active = 'discover', onChange = () => {} }) => {
  const tabs = [
    { id: 'discover', icon: 'home', label: 'Discover' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'post', icon: 'plus', label: '', fab: true },
    { id: 'chat', icon: 'chat', label: 'Chat', badge: true },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      paddingBottom: 22, paddingTop: 8,
      background: 'linear-gradient(to top, var(--kara-bg) 70%, rgba(10,10,15,0.5) 100%, transparent)',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
        height: 60, padding: '0 8px', alignItems: 'center',
      }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          if (t.fab) {
            return (
              <button key={t.id} onClick={() => onChange(t.id)} style={{
                margin: '0 auto', width: 52, height: 52, borderRadius: 16,
                background: 'var(--kara-primary)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(124,58,237,0.45)',
                cursor: 'pointer', transform: 'translateY(-6px)',
              }}>
                <KaraIcon name="plus" size={26} color="#fff" stroke={2.25} />
              </button>
            );
          }
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '8px 0', position: 'relative',
              color: isActive ? 'var(--kara-primary)' : 'var(--kara-text-faint)',
            }}>
              <div style={{ position: 'relative' }}>
                <KaraIcon name={t.icon} size={24} filled={isActive} />
                {t.badge && (
                  <div style={{
                    position: 'absolute', top: -2, right: -3,
                    width: 9, height: 9, borderRadius: '50%',
                    background: 'var(--kara-danger)', border: '2px solid var(--kara-bg)',
                  }} />
                )}
              </div>
              {isActive && <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
                fontFamily: 'var(--kara-font-body)',
              }}>{t.label}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { KaraIcon, KaraTag, KaraBadge, KaraButton, KaraAvatar, KaraPhoto, KaraTabBar });

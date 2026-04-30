// Kara — Onboarding (3 slides + Auth) + Discover feed

const KaraOnboarding = ({ slide = 0, onAdvance = () => {}, onAuth = () => {} }) => {
  const slides = [
    { tone: 'cyan-tokyo', label: 'NIGHT MEET · TOKYO', kicker: 'Communauté', title: 'Trouve ta\u00a0communauté', sub: 'Suis les builds, les owners et les meets de ta région. JDM, stance, custom, daily — tout y passe.' },
    { tone: 'track-magenta', label: 'TRACK DAY · DRIFT', kicker: 'Échange', title: 'Échange avec les passionnés', sub: 'DM directs, conseils, pièces, spots. Ta tribu motorisée à portée de main.' },
    { tone: 'amber-stance', label: 'EVENTS · MARKETPLACE', kicker: 'Bientôt', title: 'Events & Marketplace', sub: 'Billets, annonces, rencontres officielles. Le réseau s\'agrandit.' },
  ];
  const s = slides[slide];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
      <KaraPhoto tone={s.tone} label={s.label} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.7) 40%, rgba(10,10,15,0.2) 70%, rgba(10,10,15,0.4) 100%)' }} />
      {/* logo top */}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
        <KaraWordmark size={28} color="#fff" />
      </div>
      {/* skip top right */}
      <button style={{
        position: 'absolute', top: 70, right: 20, zIndex: 5,
        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.65)',
        fontFamily: 'var(--kara-font-body)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
      }}>Passer</button>

      {/* content bottom */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 28px 50px', zIndex: 5 }}>
        <div className="kara-label" style={{ color: 'var(--kara-accent)', marginBottom: 14, fontSize: 11 }}>
          0{slide + 1} — {s.kicker}
        </div>
        <h1 className="kara-display" style={{ color: '#fff', fontSize: 44, lineHeight: 1.02, margin: 0, marginBottom: 14, textWrap: 'balance' }}>
          {s.title}
        </h1>
        <p style={{ color: 'rgba(241,240,255,0.78)', fontSize: 15, lineHeight: 1.5, margin: 0, marginBottom: 32, fontFamily: 'var(--kara-font-body)', maxWidth: 320 }}>
          {s.sub}
        </p>

        {/* dots + cta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                height: 6, width: i === slide ? 22 : 6, borderRadius: 3,
                background: i === slide ? 'var(--kara-primary)' : 'rgba(255,255,255,0.25)',
                transition: 'all 300ms var(--kara-ease)',
              }} />
            ))}
          </div>
          <div style={{ flex: 1 }} />
          {slide < 2 ? (
            <button onClick={() => onAdvance(slide + 1)} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--kara-primary)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(124,58,237,0.5)', cursor: 'pointer',
            }}>
              <KaraIcon name="arrowRight" size={24} color="#fff" stroke={2.25} />
            </button>
          ) : (
            <KaraButton variant="primary" size="lg" onClick={onAuth}>
              Commencer <KaraIcon name="arrowRight" size={18} color="#fff" stroke={2.25} />
            </KaraButton>
          )}
        </div>
      </div>
    </div>
  );
};

const KaraAuth = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden' }}>
    <KaraPhoto tone="garage-night" label="GARAGE · BUILD HERO" style={{ position: 'absolute', inset: 0 }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.98) 30%, rgba(10,10,15,0.85) 55%, rgba(10,10,15,0.4) 100%)' }} />

    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '110px 28px 50px', zIndex: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <KaraLogoMark size={64} color="#fff" />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <KaraWordmark size={32} color="#fff" />
      </div>
      <p style={{ color: 'rgba(241,240,255,0.7)', textAlign: 'center', fontSize: 14, fontFamily: 'var(--kara-font-body)', margin: 0, maxWidth: 280, marginInline: 'auto' }}>
        Le réseau social des passionnés d'auto.
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button style={{
          height: 54, borderRadius: 16, border: 'none',
          background: '#fff', color: '#0a0a0f',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--kara-font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          <KaraIcon name="apple" size={20} color="#0a0a0f" stroke={0} />
          Continuer avec Apple
        </button>
        <button style={{
          height: 54, borderRadius: 16,
          background: 'transparent', color: '#fff',
          border: '1.5px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'var(--kara-font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          <KaraIcon name="google" size={20} color="#fff" stroke={0} />
          Continuer avec Google
        </button>
        <button style={{
          height: 44, background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--kara-font-body)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <KaraIcon name="mail" size={16} stroke={1.5} />
          Continuer avec email
        </button>
      </div>

      <p style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11,
        fontFamily: 'var(--kara-font-body)', marginTop: 18, lineHeight: 1.5,
      }}>
        En continuant, tu acceptes les <span style={{ color: 'var(--kara-accent)' }}>CGU</span> et la <span style={{ color: 'var(--kara-accent)' }}>politique de confidentialité</span>.
      </p>
    </div>
  </div>
);

// Wordmark + logo mark — drawn from primitives, no fancy SVG
const KaraWordmark = ({ size = 28, color = '#fff' }) => (
  <div style={{
    fontFamily: 'var(--kara-font-display)', fontWeight: 700, fontSize: size,
    letterSpacing: '-0.04em', color, display: 'flex', alignItems: 'center', gap: size * 0.25,
  }}>
    <KaraLogoMark size={size * 0.95} color={color} />
    <span>kara</span>
  </div>
);
const KaraLogoMark = ({ size = 32, color = 'var(--kara-primary)', bg = false }) => {
  const inner = (
    <img src="assets/logo-kara.svg" alt="Kara" style={{
      width: bg ? size * 0.62 : size,
      height: bg ? size * 0.62 : size,
      filter: color === '#fff' || color === 'white'
        ? 'brightness(0) invert(1)'
        : color === 'var(--kara-primary)'
          ? 'brightness(0) saturate(100%) invert(28%) sepia(78%) saturate(3400%) hue-rotate(255deg) brightness(95%) contrast(95%)'
          : 'none',
      display: 'block',
    }} />
  );
  if (!bg) return <div style={{ width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{inner}</div>;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: 'var(--kara-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
      flexShrink: 0,
    }}>{inner}</div>
  );
};

// ─────────────────────────────────────────────────────────────
// Discover Feed
// ─────────────────────────────────────────────────────────────
const VEHICLE_DATA = [
  { id: 1, owner: 'aki_drift', city: 'Lyon, 69', name: 'Nissan Silvia S15', specs: 'SR20DET · 280ch · RWD', tags: ['#JDM','#Turbo','#Stance','#Drift'], type: 'Voiture', tone: 'cyan-tokyo', label: '', country: '🇯🇵', photos: 6, photoIdx: 1, online: true, src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1000&q=80' },
  { id: 2, owner: 'maxprt_rs', city: 'Marseille, 13', name: 'Audi RS3 8V', specs: '2.5 TFSI · 400ch · AWD', tags: ['#Stance','#Daily','#OEM+','#Track'], type: 'Voiture', tone: 'amber-stance', label: '', country: '🇩🇪', photos: 4, photoIdx: 1, src: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1000&q=80' },
  { id: 3, owner: 'duc_panigale', city: 'Nice, 06', name: 'Ducati Panigale V4', specs: '1103cc · 214ch · 198kg', tags: ['#Track','#Italian','#V4','#Akrapovic'], type: 'Moto', tone: 'crimson-rwd', label: '', country: '🇮🇹', photos: 5, photoIdx: 2, src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1000&q=80' },
];

const KaraDiscover = ({ onTab = () => {} }) => {
  const [active, setActive] = React.useState(0);
  const [following, setFollowing] = React.useState({});
  const [photoIdx, setPhotoIdx] = React.useState({});

  const toggleFollow = (id) => setFollowing(f => ({ ...f, [id]: !f[id] }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 50, left: 0, right: 0, zIndex: 20,
        padding: '8px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(10,10,15,0.7), transparent)',
      }}>
        <KaraWordmark size={22} color="#fff" />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KaraIcon name="bell" size={18} color="#fff" />
          </div>
          <div className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KaraIcon name="tune" size={18} color="#fff" stroke={1.6} />
          </div>
        </div>
      </div>

      {/* Snap feed */}
      <div className="kara-noscroll" style={{
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
      }}>
        {VEHICLE_DATA.map((v, i) => (
          <div key={v.id} style={{
            height: '100%', minHeight: '100%',
            scrollSnapAlign: 'start', position: 'relative',
            padding: '0 12px',
            paddingTop: 100, paddingBottom: 100,
          }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: 28, overflow: 'hidden', position: 'relative',
              border: '1px solid var(--kara-border)',
            }}>
              <KaraPhoto tone={v.tone} src={v.src} style={{ position: 'absolute', inset: 0 }} />

              {/* Top corners */}
              <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
                <KaraBadge tone="glass">
                  <KaraIcon name={v.type === 'Moto' ? 'bike' : 'car'} size={12} color="#fff" stroke={2}/>
                  {v.type}
                </KaraBadge>
                <div className="kara-glass" style={{
                  height: 26, padding: '0 10px', borderRadius: 999,
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--kara-font-mono)', fontSize: 11, color: '#fff',
                }}>
                  <span style={{ fontSize: 12 }}>{v.country}</span>
                  · {v.photoIdx}/{v.photos}
                </div>
              </div>

              {/* Photo dots */}
              <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4, zIndex: 4 }}>
                {Array.from({length: v.photos}).map((_, idx) => (
                  <div key={idx} style={{
                    width: idx === v.photoIdx - 1 ? 18 : 4, height: 3, borderRadius: 2,
                    background: idx === v.photoIdx - 1 ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 200ms',
                  }} />
                ))}
              </div>

              {/* Side action rail */}
              <div style={{ position: 'absolute', right: 14, bottom: 200, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', zIndex: 4 }}>
                {['heart','messageCircle','bookmark','share'].map((n, k) => (
                  <button key={n} style={{
                    width: 44, height: 44, borderRadius: '50%', border: 'none',
                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: '#fff',
                  }}>
                    <KaraIcon name={n} size={20} color="#fff" />
                  </button>
                ))}
                <div style={{ fontFamily: 'var(--kara-font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                  {[1245, 234, 89, 12][i % 4]}
                </div>
              </div>

              {/* Bottom info */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: '120px 18px 22px',
                background: 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.8) 40%, transparent 100%)',
                zIndex: 3,
              }}>
                {/* owner row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <KaraAvatar size={36} tone={v.tone} initial={v.owner[0].toUpperCase()} online={v.online} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 14 }}>
                      @{v.owner}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--kara-font-body)' }}>
                      <KaraIcon name="mapPin" size={11} stroke={1.6} />
                      {v.city}
                    </div>
                  </div>
                </div>

                <div className="kara-display" style={{ color: '#fff', fontSize: 26, lineHeight: 1.05, marginBottom: 4 }}>
                  {v.name}
                </div>
                <div className="kara-mono" style={{ color: 'var(--kara-accent)', fontSize: 11, marginBottom: 14, letterSpacing: '0.06em' }}>
                  {v.specs}
                </div>

                <div className="kara-noscroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, marginInline: -18, padding: '0 18px' }}>
                  {v.tags.map(t => <KaraTag key={t}>{t}</KaraTag>)}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <KaraButton
                    variant={following[v.id] ? 'secondary' : 'primary'}
                    size="md"
                    full
                    onClick={() => toggleFollow(v.id)}
                  >
                    {following[v.id] ? '✓ Abonné' : 'Suivre'}
                  </KaraButton>
                  <button style={{
                    width: 48, height: 48, borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
                  }}>
                    <KaraIcon name="messageCircle" size={20} color="#fff" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <KaraTabBar active="discover" onChange={onTab} />
    </div>
  );
};

Object.assign(window, { KaraOnboarding, KaraAuth, KaraDiscover, KaraWordmark, KaraLogoMark, VEHICLE_DATA });

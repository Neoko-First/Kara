// Kara — Search & Post screens

const CATEGORIES = [
  { id: 'cars', label: 'Voitures', icon: 'car', count: '12.4k' },
  { id: 'motos', label: 'Motos', icon: 'bike', count: '8.1k' },
  { id: 'vans', label: 'Vans', icon: 'van', count: '1.2k' },
  { id: 'trucks', label: 'Camions', icon: 'truck', count: '643' },
  { id: 'bikes', label: 'Vélos', icon: 'bicycle', count: '2.8k' },
  { id: 'classics', label: 'Classics', icon: 'sparkles', count: '3.5k' },
];

const TRENDING_TAGS = ['#S15','#AE86','#R34','#Ducati','#Stance','#Drift','#OEM+','#JDM','#Cafe','#K20'];

const NEAR_CARS = [
  { name: 'BMW E36 M3', owner: '@flo_e36', city: 'Paris 15e', tone: 'violet-dusk', label: 'BMW E36 · DUSK' },
  { name: 'Mazda RX-7 FD', owner: '@rotary_kev', city: 'Versailles', tone: 'crimson-rwd', label: 'RX-7 · ROTARY' },
  { name: 'Honda Civic EK9', owner: '@b16_lou', city: 'Boulogne', tone: 'emerald-build', label: 'EK9 · TYPE R' },
];

const KaraSearch = ({ onTab = () => {} }) => {
  const [activeCat, setActiveCat] = React.useState(null);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
      {/* Status spacer */}
      <div style={{ height: 60 }} />

      <div className="kara-noscroll" style={{ height: 'calc(100% - 60px)', overflowY: 'auto', paddingBottom: 110 }}>
        {/* Sticky search */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--kara-bg)', padding: '8px 18px 14px',
        }}>
          <h1 className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 28, marginBottom: 14 }}>
            Explorer
          </h1>
          <div style={{
            height: 48, borderRadius: 16, background: 'var(--kara-surface)',
            border: '1px solid var(--kara-border)',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
          }}>
            <KaraIcon name="search" size={18} color="var(--kara-text-muted)" stroke={1.75} />
            <span style={{ color: 'var(--kara-text-faint)', fontFamily: 'var(--kara-font-body)', fontSize: 14 }}>
              Marque, modèle, #tag…
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--kara-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KaraIcon name="tune" size={14} color="#fff" stroke={1.6} />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ padding: '4px 18px 22px' }}>
          <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 12 }}>Catégories</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                position: 'relative', height: 88, borderRadius: 18,
                background: activeCat === c.id ? 'var(--kara-primary)' : 'var(--kara-surface)',
                border: `1px solid ${activeCat === c.id ? 'transparent' : 'var(--kara-border)'}`,
                padding: 14, textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                color: activeCat === c.id ? '#fff' : 'var(--kara-text)',
              }}>
                <KaraIcon name={c.icon} size={26} color={activeCat === c.id ? '#fff' : 'var(--kara-accent)'} stroke={1.75} />
                <div style={{ marginTop: 8, fontFamily: 'var(--kara-font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'var(--kara-font-mono)', fontSize: 10, color: activeCat === c.id ? 'rgba(255,255,255,0.7)' : 'var(--kara-text-faint)' }}>
                  {c.count} builds
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div style={{ padding: '0 0 22px' }}>
          <div className="kara-label" style={{ color: 'var(--kara-text-muted)', padding: '0 18px', marginBottom: 12 }}>Tendances</div>
          <div className="kara-noscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 18px' }}>
            {TRENDING_TAGS.map((t, i) => <KaraTag key={t} active={i === 0}>{t}</KaraTag>)}
          </div>
        </div>

        {/* Near you */}
        <div style={{ padding: '0 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', marginBottom: 12 }}>
            <div className="kara-label" style={{ color: 'var(--kara-text-muted)' }}>Près de toi</div>
            <button style={{ background: 'none', border: 'none', color: 'var(--kara-accent)', fontSize: 12, fontFamily: 'var(--kara-font-body)', fontWeight: 600, cursor: 'pointer' }}>
              Voir tout
            </button>
          </div>
          <div className="kara-noscroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 18px' }}>
            {NEAR_CARS.map(c => (
              <div key={c.name} style={{
                flexShrink: 0, width: 200, borderRadius: 18, overflow: 'hidden',
                background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
              }}>
                <KaraPhoto tone={c.tone} label={c.label} style={{ width: '100%', height: 112 }} />
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontFamily: 'var(--kara-font-display)', fontWeight: 700, fontSize: 14, color: 'var(--kara-text)' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--kara-text-muted)', fontFamily: 'var(--kara-font-body)', marginTop: 2 }}>
                    {c.owner} · {c.city}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent builds list */}
        <div style={{ padding: '0 18px' }}>
          <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 12 }}>Builds récents</div>
          {[
            { name: 'Toyota AE86 Trueno', owner: '@hachiroku.fr', tag: '#JDM #Drift', tone: 'cyan-tokyo', label: 'AE86 · TRUENO' },
            { name: 'Porsche 964 Carrera', owner: '@air_cooled', tag: '#Aircooled #Classic', tone: 'amber-stance', label: '964 · BACKDATE' },
            { name: 'Yamaha R1 2009', owner: '@r1_paul', tag: '#Track #Crossplane', tone: 'crimson-rwd', label: 'R1 · CROSSPLANE' },
          ].map(c => (
            <div key={c.name} style={{
              display: 'flex', gap: 12, padding: '10px 0',
              borderBottom: '1px solid var(--kara-border)', alignItems: 'center',
            }}>
              <KaraPhoto tone={c.tone} label={c.label} style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--kara-font-display)', fontWeight: 600, fontSize: 14, color: 'var(--kara-text)' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--kara-text-muted)', fontFamily: 'var(--kara-font-body)' }}>
                  {c.owner}
                </div>
                <div style={{ fontSize: 11, color: 'var(--kara-accent)', fontFamily: 'var(--kara-font-mono)', marginTop: 2, letterSpacing: '0.04em' }}>
                  {c.tag}
                </div>
              </div>
              <KaraIcon name="chevronRight" size={18} color="var(--kara-text-faint)" />
            </div>
          ))}
        </div>
      </div>

      <KaraTabBar active="search" onChange={onTab} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Post (4-step creator)
// ─────────────────────────────────────────────────────────────
const KaraPost = ({ step = 2, onTab = () => {}, onStep = () => {} }) => {
  const steps = ['Photos', 'Type & Specs', 'Description', 'Localisation'];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px 16px' }}>
        <button style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--kara-text)' }}>
          <KaraIcon name="x" size={18} />
        </button>
        <div className="kara-mono" style={{ color: 'var(--kara-text-muted)', fontSize: 11, letterSpacing: '0.1em' }}>
          {String(step + 1).padStart(2, '0')} / 04
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--kara-text-muted)', fontFamily: 'var(--kara-font-body)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Brouillon
        </button>
      </div>

      {/* Stepper */}
      <div style={{ padding: '0 18px 18px', display: 'flex', gap: 6 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--kara-primary)' : 'var(--kara-border)',
            transition: 'all 200ms',
          }} />
        ))}
      </div>

      <div style={{ padding: '0 18px 12px' }}>
        <div className="kara-label" style={{ color: 'var(--kara-accent)', marginBottom: 6 }}>
          Étape {step + 1}
        </div>
        <h1 className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 28, marginBottom: 4 }}>
          {step === 0 && 'Ajoute tes photos'}
          {step === 1 && 'Type & caractéristiques'}
          {step === 2 && 'Décris ton build'}
          {step === 3 && 'Où est garé ce véhicule\u00a0?'}
        </h1>
        <p style={{ color: 'var(--kara-text-muted)', fontSize: 13, fontFamily: 'var(--kara-font-body)', margin: 0 }}>
          {step === 0 && 'Min. 1 photo, max. 10. La 1ʳᵉ devient la principale.'}
          {step === 1 && 'On utilise ces infos pour suggérer des tags.'}
          {step === 2 && 'Texte libre, 300 caractères max. Ajoute des tags.'}
          {step === 3 && 'On affiche la ville. La position précise reste optionnelle.'}
        </p>
      </div>

      <div className="kara-noscroll" style={{ flex: 1, height: 'calc(100% - 280px)', overflowY: 'auto', padding: '12px 18px 100px' }}>
        {step === 0 && <PostStepPhotos />}
        {step === 1 && <PostStepSpecs />}
        {step === 2 && <PostStepDescription />}
        {step === 3 && <PostStepLocation />}
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 18px 30px',
        background: 'linear-gradient(to top, var(--kara-bg) 70%, rgba(10,10,15,0.6) 100%, transparent)',
        display: 'flex', gap: 10,
      }}>
        {step > 0 && (
          <button onClick={() => onStep(step - 1)} style={{
            height: 52, padding: '0 22px', borderRadius: 999,
            background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
            color: 'var(--kara-text)', fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>
            Retour
          </button>
        )}
        <button onClick={() => onStep(Math.min(step + 1, 3))} style={{
          flex: 1, height: 52, borderRadius: 999, border: 'none',
          background: 'var(--kara-primary)', color: '#fff',
          fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {step === 3 ? 'Publier le build' : 'Continuer'}
          <KaraIcon name="arrowRight" size={18} color="#fff" stroke={2.25} />
        </button>
      </div>
    </div>
  );
};

const PostStepPhotos = () => (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {/* Hero photo */}
      <div style={{ gridColumn: 'span 2', borderRadius: 18, overflow: 'hidden', position: 'relative', height: 220 }}>
        <KaraPhoto tone="cyan-tokyo" label="PHOTO 01 · HERO" style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <KaraBadge tone="purple">Photo principale</KaraBadge>
        </div>
        <button style={{ position: 'absolute', top: 12, right: 12, width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
          <KaraIcon name="x" size={14} />
        </button>
      </div>
      {[
        { tone: 'amber-stance', label: '02' },
        { tone: 'track-magenta', label: '03' },
        { tone: 'garage-night', label: '04' },
      ].map((p, i) => (
        <div key={i} style={{ borderRadius: 14, overflow: 'hidden', height: 100, position: 'relative' }}>
          <KaraPhoto tone={p.tone} label={p.label} style={{ width: '100%', height: '100%' }} />
        </div>
      ))}
      {/* Add photo cell */}
      <button style={{
        height: 100, borderRadius: 14, border: '1.5px dashed var(--kara-border-strong)',
        background: 'var(--kara-surface)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--kara-text-muted)', cursor: 'pointer',
      }}>
        <KaraIcon name="plus" size={20} />
        <span style={{ fontFamily: 'var(--kara-font-body)', fontSize: 11 }}>Ajouter</span>
      </button>
    </div>
    <div className="kara-mono" style={{ color: 'var(--kara-text-faint)', fontSize: 10, marginTop: 14, letterSpacing: '0.05em' }}>
      4 / 10 PHOTOS · GLISSE POUR RÉORDONNER
    </div>
  </div>
);

const PostStepSpecs = () => {
  const [type, setType] = React.useState('car');
  const types = [
    { id: 'car', label: 'Voiture', icon: 'car' },
    { id: 'bike', label: 'Moto', icon: 'bike' },
    { id: 'van', label: 'Van', icon: 'van' },
    { id: 'truck', label: 'Camion', icon: 'truck' },
    { id: 'bicycle', label: 'Vélo', icon: 'bicycle' },
    { id: 'classic', label: 'Classic', icon: 'sparkles' },
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            height: 78, borderRadius: 14,
            background: type === t.id ? 'rgba(124,58,237,0.15)' : 'var(--kara-surface)',
            border: `1px solid ${type === t.id ? 'var(--kara-primary)' : 'var(--kara-border)'}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            cursor: 'pointer', color: type === t.id ? 'var(--kara-accent)' : 'var(--kara-text)',
          }}>
            <KaraIcon name={t.icon} size={22} stroke={1.75} />
            <span style={{ fontFamily: 'var(--kara-font-body)', fontSize: 12, fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
      </div>

      {[
        { label: 'Marque', value: 'Nissan', placeholder: 'ex. Nissan' },
        { label: 'Modèle', value: 'Silvia S15', placeholder: 'ex. Silvia S15' },
        { label: 'Année', value: '2001', placeholder: '2001' },
        { label: 'Cylindrée', value: '2.0L Turbo', placeholder: '' },
        { label: 'Puissance', value: '280 ch', placeholder: '' },
        { label: 'Plaque (optionnel)', value: '', placeholder: 'Pour le badge pays' },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: 14 }}>
          <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 6, fontSize: 10 }}>{f.label}</div>
          <div style={{
            height: 48, borderRadius: 14, padding: '0 16px',
            background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
            display: 'flex', alignItems: 'center',
            color: f.value ? 'var(--kara-text)' : 'var(--kara-text-faint)',
            fontFamily: 'var(--kara-font-body)', fontSize: 14,
          }}>{f.value || f.placeholder}</div>
        </div>
      ))}
    </div>
  );
};

const PostStepDescription = () => {
  const desc = "Build daily-track. Suspension Ohlins, échappement Tomei, kit BN Sports. 280ch sur banc. Spotté à Lurcy-Lévis le mois dernier.";
  return (
    <div>
      <div style={{
        minHeight: 140, borderRadius: 16, padding: 16,
        background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
        color: 'var(--kara-text)', fontFamily: 'var(--kara-font-body)', fontSize: 14, lineHeight: 1.5,
        position: 'relative',
      }}>
        {desc}
        <div className="kara-mono" style={{ position: 'absolute', bottom: 10, right: 14, color: 'var(--kara-text-faint)', fontSize: 10 }}>
          {desc.length} / 300
        </div>
      </div>

      <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginTop: 22, marginBottom: 10 }}>Tags</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['#JDM','#Turbo','#SR20','#Drift','#BNSports'].map(t => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 12px',
            borderRadius: 999, background: 'rgba(124,58,237,0.18)',
            color: 'var(--kara-accent)', fontFamily: 'var(--kara-font-body)', fontSize: 13, fontWeight: 500,
            border: '1px solid rgba(124,58,237,0.35)',
          }}>
            {t}
            <KaraIcon name="x" size={12} stroke={2} />
          </span>
        ))}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 12px',
          borderRadius: 999, background: 'transparent', color: 'var(--kara-text-faint)',
          border: '1px dashed var(--kara-border-strong)', fontFamily: 'var(--kara-font-body)', fontSize: 13,
        }}>+ Ajouter</span>
      </div>

      <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginTop: 22, marginBottom: 10 }}>Suggestions</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['#Stance','#Track','#Daily','#OEM+','#Rotary','#Akrapovic'].map(t => <KaraTag key={t}>{t}</KaraTag>)}
      </div>
    </div>
  );
};

const PostStepLocation = () => (
  <div>
    <div style={{
      borderRadius: 18, overflow: 'hidden', height: 200, position: 'relative',
      background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--kara-primary)', boxShadow: '0 0 16px rgba(124,58,237,0.7)' }} />
        </div>
      </div>
      <div className="kara-mono" style={{ position: 'absolute', bottom: 12, left: 14, color: 'var(--kara-text-muted)', fontSize: 10 }}>
        45.764 N · 4.835 E
      </div>
    </div>

    <div style={{ marginTop: 16 }}>
      <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 6, fontSize: 10 }}>Ville de rattachement</div>
      <div style={{
        height: 48, borderRadius: 14, padding: '0 16px',
        background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
        display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--kara-text)', fontFamily: 'var(--kara-font-body)', fontSize: 14,
      }}>
        <KaraIcon name="mapPin" size={16} color="var(--kara-accent)" />
        Lyon, 69
      </div>
    </div>

    <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--kara-font-body)', fontSize: 14, fontWeight: 600, color: 'var(--kara-text)' }}>
            Position précise
          </div>
          <div style={{ fontSize: 12, color: 'var(--kara-text-muted)', marginTop: 2, fontFamily: 'var(--kara-font-body)' }}>
            Visible à 200m près sur la map
          </div>
        </div>
        <div style={{
          width: 48, height: 28, borderRadius: 999, background: 'var(--kara-border-strong)',
          padding: 3, display: 'flex', alignItems: 'center', cursor: 'pointer',
        }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff' }} />
        </div>
      </div>
    </div>

    <div style={{ marginTop: 18 }}>
      <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 10 }}>Aperçu de la card</div>
      <div style={{
        borderRadius: 18, overflow: 'hidden', position: 'relative', height: 180,
        border: '1px solid var(--kara-border)',
      }}>
        <KaraPhoto tone="cyan-tokyo" label="NISSAN S15 · MIDNIGHT" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.92), transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 }}>
          <div className="kara-display" style={{ color: '#fff', fontSize: 18 }}>Nissan Silvia S15</div>
          <div className="kara-mono" style={{ color: 'var(--kara-accent)', fontSize: 10, letterSpacing: '0.06em' }}>
            2001 · 2.0T · 280CH · LYON 69
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { KaraSearch, KaraPost });

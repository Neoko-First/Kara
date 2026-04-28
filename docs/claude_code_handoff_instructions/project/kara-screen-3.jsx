// Kara — Chat (list + conversation), Profile, Vehicle Detail

const CONVERSATIONS = [
  { id: 1, name: 'aki_drift', vehicle: 'Nissan Silvia S15', tone: 'cyan-tokyo', last: 'Stp t\'as les coords du carrossier ?', time: '14:32', unread: 2 },
  { id: 2, name: 'maxprt_rs', vehicle: 'Audi RS3 8V', tone: 'amber-stance', last: 'Yes je viens samedi 100%', time: '12:08', unread: 0 },
  { id: 3, name: 'duc_panigale', vehicle: 'Ducati V4', tone: 'crimson-rwd', last: '🔥🔥', time: 'Hier', unread: 1 },
  { id: 4, name: 'flo_e36', vehicle: 'BMW E36 M3', tone: 'violet-dusk', last: 'Tu peux passer demain ? J\'ai une session libre', time: 'Hier', unread: 0 },
  { id: 5, name: 'rotary_kev', vehicle: 'Mazda RX-7 FD', tone: 'crimson-rwd', last: 'OK ça marche, à samedi', time: 'Lun.', unread: 0 },
  { id: 6, name: 'b16_lou', vehicle: 'Civic EK9', tone: 'emerald-build', last: 'Photo qui claque mec', time: 'Lun.', unread: 0 },
];

const KaraChatList = ({ onTab = () => {}, onOpenConv = () => {} }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
    <div style={{ height: 60 }} />
    <div className="kara-noscroll" style={{ height: 'calc(100% - 60px)', overflowY: 'auto', paddingBottom: 110 }}>
      <div style={{ padding: '8px 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 30 }}>Messages</h1>
        <button style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--kara-text)' }}>
          <KaraIcon name="edit" size={16} />
        </button>
      </div>
      <div style={{ padding: '0 18px 16px' }}>
        <div style={{ height: 44, borderRadius: 14, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
          <KaraIcon name="search" size={16} color="var(--kara-text-muted)" />
          <span style={{ color: 'var(--kara-text-faint)', fontFamily: 'var(--kara-font-body)', fontSize: 13 }}>Filtrer les conversations…</span>
        </div>
      </div>

      {CONVERSATIONS.map((c, i) => (
        <button key={c.id} onClick={() => onOpenConv(c)} style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '12px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}>
          <div style={{ position: 'relative' }}>
            <KaraPhoto tone={c.tone} label="" style={{ width: 52, height: 52, borderRadius: '50%' }} />
            {i % 3 === 0 && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: 'var(--kara-primary)', border: '2px solid var(--kara-bg)' }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 14, color: 'var(--kara-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  @{c.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--kara-text-faint)', fontFamily: 'var(--kara-font-mono)', whiteSpace: 'nowrap' }}>
                  · {c.vehicle}
                </div>
              </div>
              <div style={{ fontSize: 11, color: c.unread ? 'var(--kara-accent)' : 'var(--kara-text-faint)', fontFamily: 'var(--kara-font-body)', fontWeight: c.unread ? 600 : 400, flexShrink: 0 }}>
                {c.time}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 3 }}>
              <div style={{
                fontSize: 13, color: c.unread ? 'var(--kara-text)' : 'var(--kara-text-muted)',
                fontFamily: 'var(--kara-font-body)', fontWeight: c.unread ? 500 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {c.last}
              </div>
              {c.unread > 0 && (
                <div style={{
                  minWidth: 20, height: 20, borderRadius: 999, background: 'var(--kara-primary)',
                  color: '#fff', fontSize: 11, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                  fontFamily: 'var(--kara-font-body)',
                }}>
                  {c.unread}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
    <KaraTabBar active="chat" onChange={onTab} />
  </div>
);

const KaraConversation = ({ conv = CONVERSATIONS[0], onBack = () => {} }) => {
  const messages = [
    { from: 'them', text: 'Yo, j\'ai vu tes photos du build, ça claque', time: '14:20' },
    { from: 'me', text: 'Merci frérot 🙏', time: '14:22' },
    { from: 'them', text: 'T\'as quoi comme suspension ?', time: '14:23' },
    { from: 'me', text: 'Ohlins DFV + bras BN Sports, le combo est cher mais ça vaut le coup', time: '14:25' },
    { from: 'them', text: 'Stp t\'as les coords du carrossier ?', time: '14:32' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
      <div style={{ height: 60 }} />

      {/* Header */}
      <div className="kara-glass" style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px 12px',
        borderBottom: '1px solid var(--kara-border)', background: 'var(--kara-bg)',
      }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--kara-surface)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--kara-text)' }}>
          <KaraIcon name="chevronLeft" size={18} />
        </button>
        <KaraPhoto tone={conv.tone} style={{ width: 38, height: 38, borderRadius: '50%' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 14, color: 'var(--kara-text)' }}>@{conv.name}</div>
          <div style={{ fontSize: 11, color: 'var(--kara-accent)', fontFamily: 'var(--kara-font-mono)', letterSpacing: '0.04em' }}>
            {conv.vehicle.toUpperCase()}
          </div>
        </div>
        <button style={{ height: 32, padding: '0 12px', borderRadius: 999, background: 'transparent', border: '1px solid var(--kara-border-strong)', color: 'var(--kara-text)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--kara-font-body)', cursor: 'pointer' }}>
          Voir profil
        </button>
      </div>

      {/* Messages */}
      <div className="kara-noscroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 14px 100px', display: 'flex', flexDirection: 'column', gap: 8, height: 'calc(100% - 180px)' }}>
        <div style={{ textAlign: 'center', color: 'var(--kara-text-faint)', fontSize: 11, fontFamily: 'var(--kara-font-mono)', letterSpacing: '0.08em', margin: '8px 0' }}>
          AUJOURD'HUI · 14:20
        </div>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%',
              padding: '10px 14px',
              borderRadius: m.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.from === 'me' ? 'var(--kara-primary)' : 'var(--kara-surface)',
              border: m.from === 'me' ? 'none' : '1px solid var(--kara-border)',
              color: m.from === 'me' ? '#fff' : 'var(--kara-text)',
              fontFamily: 'var(--kara-font-body)', fontSize: 14, lineHeight: 1.4,
            }}>
              {m.text}
              <div style={{ fontSize: 9.5, opacity: 0.6, marginTop: 3, fontFamily: 'var(--kara-font-mono)' }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 4 }}>
          <div style={{ background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--kara-text-faint)' }} />)}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 28px',
        background: 'var(--kara-bg)',
        borderTop: '1px solid var(--kara-border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--kara-text)', flexShrink: 0 }}>
          <KaraIcon name="image" size={18} />
        </button>
        <div style={{
          flex: 1, height: 44, borderRadius: 22, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)',
          display: 'flex', alignItems: 'center', padding: '0 16px',
          color: 'var(--kara-text-faint)', fontFamily: 'var(--kara-font-body)', fontSize: 14,
        }}>
          Écris un message…
        </div>
        <button style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--kara-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', boxShadow: '0 4px 14px rgba(124,58,237,0.4)', flexShrink: 0 }}>
          <KaraIcon name="send" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// User Profile
// ─────────────────────────────────────────────────────────────
const KaraProfile = ({ onTab = () => {}, isMine = true }) => {
  const [tab, setTab] = React.useState('vehicles');
  const grid = [
    { tone: 'cyan-tokyo', label: 'S15' },
    { tone: 'amber-stance', label: 'RS3' },
    { tone: 'crimson-rwd', label: 'EK9' },
    { tone: 'violet-dusk', label: 'E36' },
    { tone: 'track-magenta', label: 'V4' },
    { tone: 'emerald-build', label: 'AE86' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
      <div className="kara-noscroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
        {/* Cover */}
        <div style={{ position: 'relative', height: 230 }}>
          <KaraPhoto tone="cyan-tokyo" label="NISSAN S15 · COVER" style={{ position: 'absolute', inset: 0 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, transparent 30%, var(--kara-bg) 100%)' }} />
          {/* Top buttons */}
          <div style={{ position: 'absolute', top: 56, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
            <button className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <KaraIcon name="chevronLeft" size={18} color="#fff" />
            </button>
            <button className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <KaraIcon name={isMine ? 'settings' : 'moreH'} size={18} color="#fff" />
            </button>
          </div>
        </div>

        {/* Avatar + identity */}
        <div style={{ marginTop: -56, padding: '0 20px', position: 'relative', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', border: '3px solid var(--kara-bg)', overflow: 'hidden', flexShrink: 0 }}>
              <KaraPhoto tone="track-magenta" style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ flex: 1, paddingBottom: 4 }}>
              {!isMine && (
                <KaraButton variant="primary" size="sm" full>Suivre</KaraButton>
              )}
              {isMine && (
                <KaraButton variant="secondary" size="sm" full>Modifier</KaraButton>
              )}
            </div>
          </div>

          <h1 className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 26, marginTop: 14, marginBottom: 2 }}>
            Aki — JDM Build
          </h1>
          <div style={{ color: 'var(--kara-text-muted)', fontSize: 13, fontFamily: 'var(--kara-font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>@aki_drift</span>
            <span>·</span>
            <KaraIcon name="mapPin" size={11} stroke={1.6} />
            <span>Lyon, 69</span>
          </div>

          <p style={{ marginTop: 12, color: 'var(--kara-text)', fontSize: 14, lineHeight: 1.55, fontFamily: 'var(--kara-font-body)' }}>
            Daily-track team. Silvia S15 + Hachiroku project. Spotté tous les samedis à Tarare.
          </p>

          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {['#JDM','#Drift','#Lyon69'].map(t => <KaraTag key={t}>{t}</KaraTag>)}
          </div>

          {/* Stats */}
          <div style={{
            marginTop: 18, padding: '14px 0',
            borderTop: '1px solid var(--kara-border)', borderBottom: '1px solid var(--kara-border)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          }}>
            {[
              { v: '6', l: 'Véhicules' },
              { v: '2.4k', l: 'Abonnés' },
              { v: '312', l: 'Abonnements' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid var(--kara-border)' : 'none' }}>
                <div className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 22 }}>{s.v}</div>
                <div className="kara-label" style={{ color: 'var(--kara-text-muted)', fontSize: 9.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 20px 12px' }}>
          {[
            { id: 'vehicles', label: 'Véhicules', icon: 'grid' },
            { id: 'favs', label: 'Favoris', icon: 'bookmark' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, height: 40, borderRadius: 12,
              background: tab === t.id ? 'var(--kara-surface)' : 'transparent',
              border: `1px solid ${tab === t.id ? 'var(--kara-border-strong)' : 'transparent'}`,
              color: tab === t.id ? 'var(--kara-text)' : 'var(--kara-text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'var(--kara-font-body)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <KaraIcon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {grid.map((g, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 6, overflow: 'hidden' }}>
              <KaraPhoto tone={g.tone} style={{ width: '100%', height: '100%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div className="kara-mono" style={{ position: 'absolute', bottom: 6, left: 8, color: '#fff', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em' }}>
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <KaraTabBar active="profile" onChange={onTab} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Vehicle Detail
// ─────────────────────────────────────────────────────────────
const KaraVehicleDetail = ({ onBack = () => {} }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'hidden' }}>
    <div className="kara-noscroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
      {/* Hero carousel */}
      <div style={{ position: 'relative', height: 380 }}>
        <KaraPhoto tone="cyan-tokyo" label="NISSAN SILVIA S15 · 1/6" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, transparent 25%, transparent 75%, var(--kara-bg) 100%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 56, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 4 }}>
          <button onClick={onBack} className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <KaraIcon name="chevronLeft" size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <KaraIcon name="share" size={16} color="#fff" />
            </button>
            <button className="kara-glass" style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
              <KaraIcon name="moreH" size={18} color="#fff" />
            </button>
          </div>
        </div>

        {/* Photo dots */}
        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4, zIndex: 4 }}>
          {Array.from({length: 6}).map((_, idx) => (
            <div key={idx} style={{
              width: idx === 0 ? 18 : 4, height: 3, borderRadius: 2,
              background: idx === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
            }} />
          ))}
        </div>

        {/* Type + country pills */}
        <div style={{ position: 'absolute', top: 110, left: 14, display: 'flex', gap: 6, zIndex: 4 }}>
          <KaraBadge tone="glass">
            <KaraIcon name="car" size={12} color="#fff" stroke={2}/> Voiture
          </KaraBadge>
          <KaraBadge tone="glass">🇯🇵 JP</KaraBadge>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0 20px', marginTop: -50, position: 'relative', zIndex: 3 }}>
        <h1 className="kara-display" style={{ color: '#fff', fontSize: 32, lineHeight: 1.05, marginBottom: 6 }}>
          Nissan Silvia S15 — Spec R
        </h1>
        <div className="kara-mono" style={{ color: 'var(--kara-accent)', fontSize: 12, letterSpacing: '0.06em', marginBottom: 16 }}>
          2001 · 2.0L TURBO · 280CH · RWD
        </div>

        <div className="kara-noscroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 18, marginInline: -20, padding: '0 20px' }}>
          {['#JDM','#Turbo','#Stance','#Drift','#BNSports','#Ohlins'].map(t => <KaraTag key={t}>{t}</KaraTag>)}
        </div>

        <p style={{ color: 'var(--kara-text)', fontSize: 14, lineHeight: 1.55, fontFamily: 'var(--kara-font-body)', marginBottom: 22 }}>
          Build daily-track. Suspension Ohlins DFV, échappement Tomei, kit BN Sports. 280ch sur banc. Spotté à Lurcy-Lévis le mois dernier — la suite arrive.
        </p>

        {/* Specs grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22 }}>
          {[
            { l: 'Année', v: '2001' },
            { l: 'Cylindrée', v: '1998 cc' },
            { l: 'Puissance', v: '280 ch' },
            { l: 'Couple', v: '350 Nm' },
            { l: 'Transmission', v: '6 vit. man.' },
            { l: 'Poids', v: '1240 kg' },
          ].map(s => (
            <div key={s.l} style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)' }}>
              <div className="kara-label" style={{ color: 'var(--kara-text-muted)', fontSize: 9.5, marginBottom: 4 }}>{s.l}</div>
              <div className="kara-display" style={{ color: 'var(--kara-text)', fontSize: 16 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Owner card */}
        <div style={{
          padding: '12px 14px', borderRadius: 16, background: 'var(--kara-surface)',
          border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
        }}>
          <KaraAvatar size={44} tone="cyan-tokyo" initial="A" online />
          <div style={{ flex: 1 }}>
            <div className="kara-label" style={{ color: 'var(--kara-text-muted)', fontSize: 9.5, marginBottom: 2 }}>Propriétaire</div>
            <div style={{ fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 14, color: 'var(--kara-text)' }}>@aki_drift</div>
            <div style={{ fontSize: 11, color: 'var(--kara-text-muted)', fontFamily: 'var(--kara-font-body)' }}>2.4k abonnés · Lyon, 69</div>
          </div>
          <KaraIcon name="chevronRight" size={18} color="var(--kara-text-faint)" />
        </div>

        {/* Comments preview */}
        <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 10 }}>Commentaires · 89</div>
        {[
          { who: '@maxprt_rs', txt: 'La caisse est crémeuse, les jantes !', tone: 'amber-stance' },
          { who: '@flo_e36', txt: 'On se croise à Tarare samedi ?', tone: 'violet-dusk' },
        ].map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <KaraPhoto tone={c.tone} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', borderRadius: 14, padding: '8px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kara-text)', fontFamily: 'var(--kara-font-body)' }}>{c.who}</div>
              <div style={{ fontSize: 13, color: 'var(--kara-text)', fontFamily: 'var(--kara-font-body)', marginTop: 2 }}>{c.txt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Sticky bottom action */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '14px 18px 30px',
      background: 'linear-gradient(to top, var(--kara-bg) 70%, rgba(10,10,15,0.7) 100%, transparent)',
      display: 'flex', gap: 10,
    }}>
      <KaraButton variant="primary" size="md" full>
        <KaraIcon name="plus" size={16} color="#fff" stroke={2.25} />
        Suivre ce véhicule
      </KaraButton>
      <button style={{
        width: 52, height: 48, borderRadius: 999,
        background: 'var(--kara-surface)', border: '1px solid var(--kara-border-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--kara-text)',
        flexShrink: 0,
      }}>
        <KaraIcon name="messageCircle" size={18} />
      </button>
    </div>
  </div>
);

Object.assign(window, { KaraChatList, KaraConversation, KaraProfile, KaraVehicleDetail, CONVERSATIONS });

// Kara — Design System preview page (tokens, type, colors, components)

const KaraDesignSystem = () => (
  <div style={{ width: '100%', height: '100%', background: 'var(--kara-bg)', overflow: 'auto', color: 'var(--kara-text)' }}>
    <div style={{ padding: '60px 28px 40px', maxWidth: 390, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <KaraLogoMark size={48} />
      </div>
      <h1 className="kara-display" style={{ fontSize: 42, marginBottom: 4 }}>Design System</h1>
      <div className="kara-mono" style={{ color: 'var(--kara-accent)', fontSize: 11, letterSpacing: '0.08em', marginBottom: 8 }}>
        v0.1 · APRIL 2026
      </div>
      <p style={{ color: 'var(--kara-text-muted)', fontSize: 14, fontFamily: 'var(--kara-font-body)', lineHeight: 1.5 }}>
        L'esthétique Kara : magazine auto underground × réseau social moderne. Énergique, contrasté, streetwear.
      </p>

      {/* Colors */}
      <Section title="Couleurs" sub="Violet électrique sur fond quasi-noir.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Swatch hex="#7C3AED" name="Primaire" sub="purple-600" />
          <Swatch hex="#A78BFA" name="Accent" sub="purple-400" />
          <Swatch hex="#0A0A0F" name="Background" sub="quasi-noir" border />
          <Swatch hex="#111118" name="Surface" sub="cards/modals" border />
          <Swatch hex="#1E1E2E" name="Border" sub="dividers" border />
          <Swatch hex="#EF4444" name="Danger" sub="unfollow/erreur" />
          <Swatch hex="#F1F0FF" name="Texte dark" sub="quasi-blanc" border />
          <Swatch hex="#9594B5" name="Texte muet" sub="meta" />
        </div>
      </Section>

      {/* Type */}
      <Section title="Typographie" sub="Space Grotesk × Inter.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TypeRow name="Display 44" font="display" size={44} weight={700}>Trouve ta tribu</TypeRow>
          <TypeRow name="Display 28" font="display" size={28} weight={700}>Nissan Silvia S15</TypeRow>
          <TypeRow name="H3 / Title 18" font="display" size={18} weight={600}>Mon profil</TypeRow>
          <TypeRow name="Body 14" font="body" size={14} weight={400}>Build daily-track. Suspension Ohlins, échappement Tomei.</TypeRow>
          <TypeRow name="Caption 12" font="body" size={12} weight={500}>@aki_drift · Lyon, 69</TypeRow>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--kara-surface)', border: '1px solid var(--kara-border)' }}>
            <div className="kara-label" style={{ color: 'var(--kara-text-muted)', marginBottom: 4 }}>Label · 11px caps</div>
            <div className="kara-mono" style={{ color: 'var(--kara-accent)', fontSize: 11, letterSpacing: '0.08em' }}>2001 · 2.0T · 280CH · RWD</div>
          </div>
        </div>
      </Section>

      {/* Radii / Elevation */}
      <Section title="Radii & ombres" sub="Coins arrondis généreux.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { r: 8, l: 'sm' },
            { r: 12, l: 'md' },
            { r: 16, l: 'lg' },
            { r: 24, l: '2xl' },
          ].map(s => (
            <div key={s.l} style={{ aspectRatio: '1', background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', borderRadius: s.r, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 8 }}>
              <div className="kara-mono" style={{ fontSize: 10, color: 'var(--kara-text-muted)' }}>{s.r}px · {s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <div style={{ flex: 1, height: 70, background: 'var(--kara-surface)', borderRadius: 16, boxShadow: 'var(--kara-shadow-card)', border: '1px solid var(--kara-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="kara-mono" style={{ fontSize: 10, color: 'var(--kara-text-muted)' }}>shadow-card</div>
          </div>
          <div style={{ flex: 1, height: 70, background: 'var(--kara-primary)', borderRadius: 16, boxShadow: 'var(--kara-shadow-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="kara-mono" style={{ fontSize: 10, color: '#fff' }}>shadow-purple</div>
          </div>
        </div>
      </Section>

      {/* Components */}
      <Section title="Composants" sub="Boutons, tags, badges, avatar.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <KaraButton variant="primary">Suivre</KaraButton>
            <KaraButton variant="outline">Détails</KaraButton>
            <KaraButton variant="secondary">Brouillon</KaraButton>
            <KaraButton variant="danger" size="sm">Désabonner</KaraButton>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <KaraTag active>#JDM</KaraTag>
            <KaraTag>#Stance</KaraTag>
            <KaraTag>#Drift</KaraTag>
            <KaraTag>#OEM+</KaraTag>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <KaraBadge tone="purple">Photo principale</KaraBadge>
            <KaraBadge tone="glass">🇯🇵 1/6</KaraBadge>
            <KaraBadge tone="outline">Voiture</KaraBadge>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <KaraAvatar size={40} tone="cyan-tokyo" initial="A" online />
            <KaraAvatar size={40} tone="amber-stance" initial="M" />
            <KaraAvatar size={40} tone="crimson-rwd" initial="D" online />
            <KaraAvatar size={40} tone="violet-dusk" initial="F" />
          </div>
        </div>
      </Section>

      {/* Iconography */}
      <Section title="Iconographie" sub="Lucide-style · stroke 1.75.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {['home','search','plus','chat','user','heart','bookmark','share','mapPin','car','bike','sparkles'].map(n => (
            <div key={n} style={{ aspectRatio: '1', background: 'var(--kara-surface)', border: '1px solid var(--kara-border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--kara-text)' }}>
              <KaraIcon name={n} size={20} />
            </div>
          ))}
        </div>
      </Section>

      {/* Photo tones */}
      <Section title="Photo tones" sub="Placeholders en attendant les vrais shoots.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {['cyan-tokyo','amber-stance','track-magenta','crimson-rwd','violet-dusk','emerald-build'].map(t => (
            <KaraPhoto key={t} tone={t} label={t.toUpperCase()} style={{ height: 80, borderRadius: 12 }} />
          ))}
        </div>
      </Section>
    </div>
  </div>
);

const Section = ({ title, sub, children }) => (
  <div style={{ marginTop: 36 }}>
    <div className="kara-label" style={{ color: 'var(--kara-accent)', marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--kara-text-muted)', fontFamily: 'var(--kara-font-body)', marginBottom: 14 }}>{sub}</div>
    {children}
  </div>
);

const Swatch = ({ hex, name, sub, border }) => (
  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--kara-border)' }}>
    <div style={{ height: 56, background: hex, borderBottom: border ? '1px solid var(--kara-border)' : 'none' }} />
    <div style={{ padding: '8px 10px', background: 'var(--kara-surface)' }}>
      <div style={{ fontFamily: 'var(--kara-font-body)', fontWeight: 600, fontSize: 12, color: 'var(--kara-text)' }}>{name}</div>
      <div className="kara-mono" style={{ fontSize: 10, color: 'var(--kara-text-muted)', marginTop: 1 }}>{hex} · {sub}</div>
    </div>
  </div>
);

const TypeRow = ({ name, font, size, weight, children }) => (
  <div style={{ borderTop: '1px solid var(--kara-border)', paddingTop: 10 }}>
    <div className="kara-mono" style={{ fontSize: 10, color: 'var(--kara-text-muted)', marginBottom: 4 }}>{name}</div>
    <div style={{
      fontFamily: font === 'display' ? 'var(--kara-font-display)' : 'var(--kara-font-body)',
      fontSize: size, fontWeight: weight, lineHeight: 1.2, letterSpacing: font === 'display' ? '-0.02em' : 0,
      color: 'var(--kara-text)',
    }}>{children}</div>
  </div>
);

Object.assign(window, { KaraDesignSystem });

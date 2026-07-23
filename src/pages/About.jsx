import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineUserGroup,
  HiOutlineHeart,
  HiOutlineEye,
  HiOutlineBadgeCheck,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
} from 'react-icons/hi'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './About.css'

// Placeholder ekip isimleri kaldırıldı (bkz. CONTENT_REQUIRED.md). Yalnızca
// doğrulanabilir kurucu; gerçek ekip admin/content'ten gelir.
const defaultTeam = [
  { name: 'Kadir Demir', roleTr: 'Kurucu & CEO', roleEn: 'Founder & CEO', color: '#eac321', avatar: '/kadir.jpg' },
]

const defaultStats = { experience: '—', teamSize: '—', clients: '—' }

export default function About() {
  const { t, lang } = useLanguage()
  const team = defaultTeam
  const stats = defaultStats
  const storyP1 = t('about.storyP1')
  const storyP2 = t('about.storyP2')
  useSEO({
    title: 'Kade New Media Hakkında | New Media Ajansı İstanbul',
    description: 'Kade New Media, İstanbul merkezli bir new media ve dijital pazarlama ajansı — Kademedia ve Kadenewmedia adlarıyla da aranıyoruz.',
    keywords: 'kade media, kade, kademedia, kade new media, kadenewmedia, new media ajansı, medya ajansı istanbul, dijital ajans',
    path: '/hakkimizda',
  })

  const values = [
    { icon: HiOutlineLightBulb, title: t('about.creativity'), desc: t('about.creativityDesc') },
    { icon: HiOutlineEye, title: t('about.transparency'), desc: t('about.transparencyDesc') },
    { icon: HiOutlineBadgeCheck, title: t('about.quality'), desc: t('about.qualityDesc') },
    { icon: HiOutlineHeart, title: t('about.passion'), desc: t('about.passionDesc') },
    { icon: HiOutlineUserGroup, title: t('about.teamwork'), desc: t('about.teamworkDesc') },
    { icon: HiOutlineShieldCheck, title: t('about.reliability'), desc: t('about.reliabilityDesc') },
  ]

  return (
    <PageTransition>
      {/* Hero — editoryal desen (bkz. Home.jsx / Services.jsx) */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {t('about.badge')}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="editorial-lead">
              {t('about.title')} {t('about.titleHighlight')} {t('about.titleEnd')}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">
              {t('about.subtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <section className="section about-story">
        <div className="container">
          <div className="story-grid">
            <FadeIn direction="left" className="story-content">
              <h2>{t('about.storyTitle')}</h2>
              <p>{storyP1}</p>
              <p>{storyP2}</p>
              <div className="story-stats">
                <div className="story-stat">
                  <span className="story-stat-number">{stats.experience}</span>
                  <span className="story-stat-label">{t('about.experience')}</span>
                </div>
                <div className="story-stat">
                  <span className="story-stat-number">{stats.teamSize}</span>
                  <span className="story-stat-label">{t('about.team')}</span>
                </div>
                <div className="story-stat">
                  <span className="story-stat-number">{stats.clients}</span>
                  <span className="story-stat-label">{t('about.happyClients')}</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right" className="story-visual">
              <div className="visual-card glass-card">
                <div className="lightning-container">
                  {/* Dış parlama halkaları */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="lightning-ring"
                      animate={{
                        scale: [1, 1.8 + i * 0.4, 1],
                        opacity: [0.25 - i * 0.06, 0, 0.25 - i * 0.06],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.6,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                  {/* Logo — gerçek dosyadan yükleniyor */}
                  <motion.div
                    className="lightning-bolt-wrapper"
                    animate={{
                      filter: [
                        'drop-shadow(0 0 12px #eac321) drop-shadow(0 0 30px rgba(234,195,33,0.3))',
                        'drop-shadow(0 0 28px #eac321) drop-shadow(0 0 60px rgba(234,195,33,0.5))',
                        'drop-shadow(0 0 12px #eac321) drop-shadow(0 0 30px rgba(234,195,33,0.3))',
                      ],
                      scale: [1, 1.04, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.img
                      src="/logo-icon.svg"
                      alt="Kade New Media Logo"
                      className="lightning-svg"
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      draggable={false}
                    />
                  </motion.div>
                  <motion.div
                    className="lightning-label"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span>kade</span>media
                  </motion.div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values — kart yerine editoryal liste */}
      <section className="editorial-section section" style={{ borderTop: 'none' }}>
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {t('about.valuesBadge')}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="editorial-lead" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)' }}>
              {t('about.valuesTitle')} {t('about.valuesTitleHighlight')} {t('about.valuesTitleEnd')}
            </p>
          </FadeIn>

          <ul className="editorial-list">
            {values.map((value) => (
              <li key={value.title}>
                <div className="editorial-list-row">
                  <span className="editorial-list-idx">
                    <value.icon size={18} />
                  </span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{value.title}</span>
                    <span className="editorial-list-desc">{value.desc}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team — editoryal liste, avatar ufak yuvarlak thumbnail */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {t('about.teamTitle')}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="editorial-subtitle">
              {t('about.teamSubtitle')}
            </p>
          </FadeIn>

          <ul className="editorial-list">
            {team.map((member) => (
              <li key={member.name}>
                <div className="editorial-list-row">
                  <span
                    className="editorial-list-idx"
                    style={{
                      width: 30, height: 30, borderRadius: '50%', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `linear-gradient(135deg, ${member.color}40, ${member.color}10)`,
                    }}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: member.color }}>{member.name.charAt(0)}</span>
                    )}
                  </span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{member.name}</span>
                    <span className="editorial-list-desc">
                      {lang === 'en' ? (member.roleEn || member.roleTr) : (member.roleTr || member.roleEn)}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <FadeIn delay={0.3}>
            <div style={{ marginTop: '32px' }}>
              <Link to="/ekip" className="editorial-btn editorial-btn-ghost">
                {lang === 'en' ? 'Meet the Full Team' : 'Tüm Ekibi Tanıyın'} <HiOutlineArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </PageTransition>
  )
}

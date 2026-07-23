import { FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { useLanguage } from '../i18n/LanguageContext'
import { useSEO } from '../hooks/useSEO'
import PageTransition from '../components/PageTransition'
import { FadeIn } from '../components/Animations'
import './Team.css'

// Yalnızca doğrulanmış gerçek kişi. Placeholder isimler kaldırıldı; ekip
// büyüdükçe (veya admin panelinden) buraya gerçek üyeler eklenir. Gerçek veri
// yoksa uydurma isim gösterilmez — bunun yerine açık pozisyonlar / roller sunulur.
const defaultTeam = [
  {
    name: 'Kadir Demir',
    roleTr: 'Kurucu & CEO',
    roleEn: 'Founder & CEO',
    bioTr: 'Dijital pazarlama ve sosyal medya stratejisi üzerine çalışıyor; müşteri ilişkileri ve ajansın genel gidişatı da onun sorumluluğunda.',
    bioEn: 'Focused on digital marketing and social media strategy. Drives client growth and agency vision.',
    image: '/kadir.jpg',
    social: {},
    color: '#eac321',
  },
]

const socialIcons = { linkedin: FaLinkedinIn, instagram: FaInstagram }

export default function Team() {
  const { lang } = useLanguage()

  useSEO({
    title: lang === 'tr' ? 'Kade New Media Ekibi | İstanbul Dijital Pazarlama Ajansı' : 'Our Team | Kade New Media',
    description: lang === 'tr'
      ? 'Sosyal medya, içerik üretimi, reklam ve dijital projelerde birlikte çalıştığımız İstanbul merkezli ekibimizle tanışın.'
      : 'Meet the Kade New Media team. Passionate and experienced digital marketing professionals.',
    path: '/ekip',
  })

  const team = defaultTeam

  return (
    <PageTransition>
      {/* Hero — editoryal desen */}
      <section className="editorial-section section">
        <div className="container">
          <FadeIn>
            <span className="editorial-eyebrow">— {lang === 'tr' ? 'Ekibimiz' : 'Our Team'}</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="editorial-lead">
              {lang === 'tr' ? 'Ekibimizle Tanışın' : 'Meet Our Passionate Team'}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="editorial-subtitle">
              {lang === 'tr'
                ? 'Markanızı dijital dünyada büyütmek için birlikte çalışıyoruz.'
                : 'Our experienced and creative team works to take your brand to the top in the digital world.'}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ul className="editorial-list">
            {team.map((member) => (
              <li key={member.name}>
                <div className="editorial-list-row">
                  <span
                    className="editorial-list-idx"
                    style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `1px solid ${member.color}40`, background: `${member.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: member.color }}>{member.name.split(' ').map(n => n[0]).join('')}</span>
                    )}
                  </span>
                  <span className="editorial-list-body">
                    <span className="editorial-list-label">{member.name}</span>
                    <span className="editorial-list-desc" style={{ color: member.color, fontWeight: 600 }}>
                      {lang === 'tr' ? member.roleTr : member.roleEn}
                    </span>
                    <span className="editorial-list-desc">
                      {lang === 'tr' ? (member.bioTr || '') : (member.bioEn || '')}
                    </span>
                    {member.social && (
                      <span className="editorial-list-tags">
                        {Object.entries(member.social).map(([platform, url]) => {
                          const Icon = socialIcons[platform]
                          if (!Icon || !url || url === '#') return null
                          return (
                            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="editorial-list-tag" aria-label={platform} style={{ display: 'inline-flex', alignItems: 'center' }}>
                              <Icon size={12} />
                            </a>
                          )
                        })}
                      </span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  )
}

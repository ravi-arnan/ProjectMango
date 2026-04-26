import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import BlurText from '../components/reactbits/BlurText'

export default function AuditLogs() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl">
      {/* Header */}
      <SpotlightCard
        spotlightColor="rgba(0, 100, 124, 0.15)"
        className="bg-gradient-to-br from-surface-container-low via-white to-primary-fixed/30 rounded-[2rem] p-8 border border-stone-200/60"
      >
        <Link
          to="/app/admin"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-widest hover:underline"
        >
          <Icon name="arrow_back" size="14px" />
          {lang === 'en' ? 'Back to Admin' : 'Kembali ke Admin'}
        </Link>
        <div className="flex items-start gap-3 mt-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Icon name="receipt_long" size="24px" />
          </div>
          <div className="flex-1">
            <BlurText
              text={lang === 'en' ? 'Audit Logs' : 'Audit Logs'}
              as="h1"
              animateBy="letters"
              delay={50}
              className="text-3xl lg:text-4xl font-extrabold text-on-surface font-headline"
            />
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              {lang === 'en'
                ? 'Trail of every admin action — settings changes, role grants, content moderation, AI key rotation.'
                : 'Jejak semua aksi admin — perubahan setting, pemberian role, moderasi konten, rotasi API key AI.'}
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Coming soon state */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <SpotlightCard
          spotlightColor="rgba(0, 100, 124, 0.1)"
          className="bg-surface-container-lowest rounded-3xl p-10 border border-stone-100 shadow-sm flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Icon name="construction" size="32px" className="text-primary" />
          </div>
          <h2 className="text-xl font-extrabold font-headline text-on-surface">
            {lang === 'en' ? 'Coming soon' : 'Akan segera hadir'}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md">
            {lang === 'en'
              ? 'Audit Logs will record every admin action — who changed the system prompt, who rotated the API key, who granted admin to whom — with timestamp, IP, and a diff for each change.'
              : 'Audit Logs akan mencatat setiap aksi admin — siapa mengubah system prompt, siapa rotate API key, siapa memberikan admin ke siapa — dengan timestamp, IP, dan diff per perubahan.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 w-full max-w-2xl">
            {[
              {
                icon: 'settings_suggest',
                title: lang === 'en' ? 'Settings changes' : 'Perubahan setting',
              },
              {
                icon: 'shield_person',
                title: lang === 'en' ? 'Role grants' : 'Pemberian role',
              },
              {
                icon: 'history',
                title: lang === 'en' ? 'Diff per change' : 'Diff per perubahan',
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-surface-container-low/60 rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name={feat.icon} size="20px" className="text-primary" />
                </div>
                <span className="text-xs font-semibold text-on-surface">{feat.title}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}

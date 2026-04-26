import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SpotlightCard from '../components/reactbits/SpotlightCard'
import BlurText from '../components/reactbits/BlurText'
import { supabase } from '../lib/supabase'
import { showToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

interface AdminUser {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  last_sign_in_at: string | null
  is_admin: boolean
  is_anonymous: boolean
}

function initialsOf(u: AdminUser): string {
  if (u.is_anonymous) return 'G'
  if (u.full_name) {
    const parts = u.full_name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : u.full_name.slice(0, 2).toUpperCase()
  }
  return (u.email?.slice(0, 2) || 'U').toUpperCase()
}

function formatDate(s: string | null): string {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function UserManagement() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) {
      setError(error.message)
      setUsers([])
    } else {
      setUsers((data as AdminUser[]) ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleGrant(target: AdminUser) {
    setBusyId(target.id)
    const { error } = await supabase.rpc('admin_grant_admin', { target: target.id })
    setBusyId(null)
    if (error) {
      showToast(error.message, 'error')
      return
    }
    showToast(
      lang === 'en'
        ? `${target.email ?? 'User'} is now an admin`
        : `${target.email ?? 'User'} sekarang admin`,
      'success'
    )
    load()
  }

  async function handleRevoke(target: AdminUser) {
    if (target.id === currentUser?.id) return
    setBusyId(target.id)
    const { error } = await supabase.rpc('admin_revoke_admin', { target: target.id })
    setBusyId(null)
    if (error) {
      showToast(error.message, 'error')
      return
    }
    showToast(
      lang === 'en'
        ? `Admin role revoked from ${target.email ?? 'user'}`
        : `Role admin dicabut dari ${target.email ?? 'user'}`,
      'success'
    )
    load()
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q)
    )
  }, [users, search])

  const adminCount = users.filter((u) => u.is_admin).length

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
            <Icon name="manage_accounts" size="24px" />
          </div>
          <div className="flex-1">
            <BlurText
              text={lang === 'en' ? 'User Management' : 'Manajemen User'}
              as="h1"
              animateBy="letters"
              delay={50}
              className="text-3xl lg:text-4xl font-extrabold text-on-surface font-headline"
            />
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              {lang === 'en'
                ? 'Browse registered users and grant or revoke the admin role.'
                : 'Lihat user terdaftar dan beri atau cabut role admin.'}
            </p>
          </div>
        </div>
      </SpotlightCard>

      {/* Stats + search */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          <span className="bg-surface-container-low rounded-full px-4 py-2 text-xs font-semibold text-on-surface">
            {users.length} {lang === 'en' ? 'users' : 'user'}
          </span>
          <span className="bg-primary/10 text-primary rounded-full px-4 py-2 text-xs font-semibold">
            {adminCount} {lang === 'en' ? 'admins' : 'admin'}
          </span>
        </div>
        <div className="relative md:w-80">
          <Icon
            name="search"
            size="18px"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === 'en' ? 'Search by email or name…' : 'Cari email atau nama…'}
            className="w-full bg-surface-container-low rounded-full pl-10 pr-4 py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <SpotlightCard
          spotlightColor="rgba(0, 100, 124, 0.08)"
          className="bg-surface-container-lowest rounded-3xl p-10 border border-stone-100 flex items-center justify-center gap-3"
        >
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-on-surface-variant">
            {lang === 'en' ? 'Loading users…' : 'Memuat user…'}
          </span>
        </SpotlightCard>
      ) : error ? (
        <SpotlightCard
          spotlightColor="rgba(220, 38, 38, 0.1)"
          className="bg-error/5 rounded-3xl p-6 border border-error/20"
        >
          <div className="flex items-start gap-3">
            <Icon name="error" size="22px" className="text-error shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-error">
                {lang === 'en' ? 'Failed to load users' : 'Gagal memuat user'}
              </p>
              <p className="text-xs text-on-surface-variant mt-1 break-all">{error}</p>
              <button
                onClick={load}
                className="mt-3 bg-error text-on-primary text-xs font-bold px-4 py-2 rounded-full"
              >
                {lang === 'en' ? 'Retry' : 'Coba lagi'}
              </button>
            </div>
          </div>
        </SpotlightCard>
      ) : filtered.length === 0 ? (
        <SpotlightCard
          spotlightColor="rgba(0, 100, 124, 0.08)"
          className="bg-surface-container-lowest rounded-3xl p-10 border border-stone-100 text-center"
        >
          <Icon name="group_off" size="32px" className="text-on-surface-variant/50 mb-2" />
          <p className="text-sm font-semibold text-on-surface-variant">
            {lang === 'en' ? 'No users match your search.' : 'Tidak ada user yang cocok.'}
          </p>
        </SpotlightCard>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((u, i) => {
            const isSelf = u.id === currentUser?.id
            const isBusy = busyId === u.id
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="bg-surface-container-lowest rounded-2xl p-4 border border-stone-100 flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                  {initialsOf(u)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-on-surface truncate">
                      {u.full_name || u.email || (u.is_anonymous ? (lang === 'en' ? 'Guest' : 'Tamu') : 'Unnamed')}
                    </p>
                    {u.is_admin && (
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ADMIN
                      </span>
                    )}
                    {u.is_anonymous && (
                      <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        GUEST
                      </span>
                    )}
                    {isSelf && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {lang === 'en' ? 'YOU' : 'KAMU'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant truncate">{u.email || '—'}</p>
                  <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                    {lang === 'en' ? 'Joined' : 'Bergabung'} {formatDate(u.created_at)}
                    {' · '}
                    {lang === 'en' ? 'Last seen' : 'Terakhir aktif'} {formatDate(u.last_sign_in_at)}
                  </p>
                </div>
                <div className="shrink-0">
                  {u.is_admin ? (
                    <button
                      onClick={() => handleRevoke(u)}
                      disabled={isSelf || isBusy || u.is_anonymous}
                      className="text-xs font-bold px-3 py-2 rounded-full bg-error/10 text-error hover:bg-error/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title={isSelf ? (lang === 'en' ? "Can't revoke yourself" : 'Tidak bisa cabut diri sendiri') : ''}
                    >
                      {isBusy ? '…' : lang === 'en' ? 'Revoke admin' : 'Cabut admin'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGrant(u)}
                      disabled={isBusy || u.is_anonymous}
                      className="text-xs font-bold px-3 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title={u.is_anonymous ? (lang === 'en' ? 'Cannot promote a guest' : 'Tidak bisa promote tamu') : ''}
                    >
                      {isBusy ? '…' : lang === 'en' ? 'Grant admin' : 'Beri admin'}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Icon from '../components/Icon';

type Tab = 'login' | 'signup';

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    resetFields();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (authError) throw authError;
      setSuccess('Akun berhasil dibuat! Silakan cek email untuk verifikasi.');
      handleTabSwitch('login');
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;
      navigate('/app');
    } catch {
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupClass = 'bg-surface-container-low rounded-xl px-4 py-3 flex items-center gap-3';
  const inputClass = 'bg-transparent flex-1 text-sm outline-none placeholder:text-on-surface-variant/50 text-on-surface font-body';
  const buttonClass = `w-full bg-primary text-on-primary rounded-xl py-3 font-bold font-headline text-sm tracking-wide transition-opacity ${loading ? 'opacity-70 pointer-events-none' : ''}`;
  const guestButtonClass = `w-full border border-outline-variant text-on-surface rounded-xl py-3 font-headline text-sm tracking-wide flex items-center justify-center gap-2 transition-opacity ${loading ? 'opacity-70 pointer-events-none' : ''}`;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-surface to-surface-container-low flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[420px] md:bg-surface-container-lowest md:shadow-xl md:rounded-[2rem] md:p-8 p-2 flex flex-col gap-6">
        {/* Branding */}
        <div className="flex flex-col items-center gap-1 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <Icon name="travel_explore" filled className="text-primary" size="32px" />
            <span className="font-headline text-2xl font-bold text-on-surface">Mango</span>
          </div>
          <span className="font-body text-xs text-on-surface-variant tracking-widest uppercase">
            Smart Tourism Platform
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="bg-surface-container-low rounded-xl p-1 flex">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2.5 text-sm font-headline font-semibold rounded-xl transition-colors ${
              activeTab === 'login'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-2.5 text-sm font-headline font-semibold rounded-xl transition-colors ${
              activeTab === 'signup'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Messages */}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 rounded-xl p-3 text-sm font-body">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-3 text-sm font-body">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className={inputGroupClass}>
              <Icon name="mail" className="text-on-surface-variant" size="20px" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className={inputGroupClass}>
              <Icon name="lock" className="text-on-surface-variant" size="20px" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-on-surface-variant"
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="20px" />
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError('Masukkan email terlebih dahulu untuk reset kata sandi.');
                  return;
                }
                setLoading(true);
                try {
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
                  if (resetError) throw resetError;
                  setResetSent(true);
                  setError('');
                } catch (err: any) {
                  setError(err.message || 'Gagal mengirim email reset.');
                } finally {
                  setLoading(false);
                }
              }}
              className="text-primary text-xs font-body self-end -mt-1"
            >
              {resetSent ? 'Email reset terkirim!' : 'Lupa kata sandi?'}
            </button>

            <button type="submit" className={buttonClass}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-outline-variant/40" />
              <span className="text-xs text-on-surface-variant/60 font-body">atau</span>
              <div className="flex-1 h-px bg-outline-variant/40" />
            </div>

            <button type="button" onClick={handleGuestLogin} className={guestButtonClass}>
              <Icon name="person_outline" size="20px" />
              Masuk sebagai Tamu
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className={inputGroupClass}>
              <Icon name="person" className="text-on-surface-variant" size="20px" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className={inputGroupClass}>
              <Icon name="mail" className="text-on-surface-variant" size="20px" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className={inputGroupClass}>
              <Icon name="lock" className="text-on-surface-variant" size="20px" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-on-surface-variant"
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="20px" />
              </button>
            </div>

            <div className={inputGroupClass}>
              <Icon name="lock" className="text-on-surface-variant" size="20px" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Kata Sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-on-surface-variant"
              >
                <Icon name={showConfirmPassword ? 'visibility_off' : 'visibility'} size="20px" />
              </button>
            </div>

            <button type="submit" className={buttonClass}>
              {loading ? 'Memproses...' : 'Daftar'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-outline-variant/40" />
              <span className="text-xs text-on-surface-variant/60 font-body">atau</span>
              <div className="flex-1 h-px bg-outline-variant/40" />
            </div>

            <button type="button" onClick={handleGuestLogin} className={guestButtonClass}>
              <Icon name="person_outline" size="20px" />
              Masuk sebagai Tamu
            </button>
          </form>
        )}

        {/* Bottom legal text */}
        <p className="text-[11px] text-on-surface-variant/60 text-center font-body pb-4">
          Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
        </p>
      </div>
    </div>
  );
}

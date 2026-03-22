import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PasswordChangeForm() {
  const { updatePassword } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    const res = await updatePassword(form.currentPassword, form.newPassword);
    setLoading(false);
    if (res.success) {
      toast.success('Mot de passe modifié avec succès');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.error || 'Erreur lors du changement de mot de passe');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-[#faf8f5] border border-[#e8e2d9] rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Lock size={15} className="text-[#C9A84C]" />
        <span className="font-serif text-[#2C2C2C] font-semibold">Changer le mot de passe</span>
      </div>
      <input
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        required
        placeholder="Mot de passe actuel"
        className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
      />
      <input
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        required
        minLength={8}
        placeholder="Nouveau mot de passe"
        className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
      />
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        required
        minLength={8}
        placeholder="Confirmer le nouveau mot de passe"
        className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (<><Loader2 size={16} className="animate-spin" /> Modification...</>) : 'Changer le mot de passe'}
      </button>
    </form>
  );
}

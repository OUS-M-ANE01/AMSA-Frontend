import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Plus,
  Edit2,
  Trash2,
  Star,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Testimonial {
  _id: string;
  text: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    role: 'Cliente vérifiée',
    avatar: '',
    rating: 5,
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getTestimonials();
      setTestimonials(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        text: testimonial.text,
        author: testimonial.author,
        role: testimonial.role,
        avatar: testimonial.avatar,
        rating: testimonial.rating,
        isActive: testimonial.isActive,
        order: testimonial.order
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        text: '',
        author: '',
        role: 'Cliente vérifiée',
        avatar: '',
        rating: 5,
        isActive: true,
        order: testimonials.length
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTestimonial) {
        await adminAPI.updateTestimonial(editingTestimonial._id, formData);
        toast.success('Témoignage mis à jour');
      } else {
        await adminAPI.createTestimonial(formData);
        toast.success('Témoignage créé');
      }
      fetchTestimonials();
      handleCloseModal();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) return;
    
    try {
      await adminAPI.deleteTestimonial(id);
      toast.success('Témoignage supprimé');
      fetchTestimonials();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      await adminAPI.updateTestimonial(testimonial._id, {
        ...testimonial,
        isActive: !testimonial.isActive
      });
      toast.success(testimonial.isActive ? 'Témoignage désactivé' : 'Témoignage activé');
      fetchTestimonials();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Témoignages Clients</h1>
          <p className="text-[#6B6B6B] mt-1">{testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors"
        >
          <Plus size={20} />
          Ajouter un témoignage
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className={`bg-white rounded-2xl p-6 border-2 transition-all shadow-sm ${
              testimonial.isActive ? 'border-[#8B7355]' : 'border-[#E8E0D5] opacity-60'
            }`}
          >
            {/* Avatar & Author */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#8B7355]"
              />
              <div className="flex-1">
                <h3 className="font-medium text-[#3A3A3A]">{testimonial.author}</h3>
                <p className="text-xs text-[#6B6B6B]">{testimonial.role}</p>
              </div>
              <button
                onClick={() => toggleActive(testimonial)}
                className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                title={testimonial.isActive ? 'Désactiver' : 'Activer'}
              >
                {testimonial.isActive ? (
                  <Eye size={18} className="text-[#8B7355]" />
                ) : (
                  <EyeOff size={18} className="text-[#6B6B6B]" />
                )}
              </button>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={14} fill="#8B7355" className="text-[#8B7355]" />
              ))}
            </div>

            {/* Text */}
            <p className="text-sm text-[#6B6B6B] italic leading-relaxed mb-4 line-clamp-4">
              "{testimonial.text}"
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
              <span className="text-xs text-[#6B6B6B]">Ordre: {testimonial.order}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <Edit2 size={16} className="text-[#8B7355]" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="p-2 hover:bg-[#FDECEA] rounded-lg transition-colors"
                >
                  <Trash2 size={16} className="text-[#C53030]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3A3A3A]">
                {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Texte du témoignage *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  placeholder="La robe midi est absolument magnifique..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Auteur *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    placeholder="Sophie M."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Rôle</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    placeholder="Cliente fidèle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">URL de l'avatar *</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  placeholder="https://..."
                />
                {formData.avatar && (
                  <img
                    src={formData.avatar}
                    alt="Aperçu"
                    className="mt-2 w-16 h-16 rounded-full object-cover border-2 border-[#8B7355]"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Note</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} étoile{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    min="0"
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-[#8B7355] rounded"
                />
                <label htmlFor="isActive" className="text-sm text-[#3A3A3A]">
                  Actif (visible sur le site)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-[#E8E0D5] text-[#3A3A3A] rounded-xl font-medium hover:bg-[#D1C7B7] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#8B7355] text-white rounded-xl font-medium hover:bg-[#6D5942] transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingTestimonial ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

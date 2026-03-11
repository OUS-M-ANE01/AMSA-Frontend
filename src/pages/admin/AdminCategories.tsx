import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../../components/admin/ImageUploader';

interface CategoryForm {
  id: string;        // slug ex. "robes"
  name: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

const emptyForm: CategoryForm = {
  id: '',
  name: '',
  description: '',
  image: '',
  order: 0,
  isActive: true,
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CategoryForm>(emptyForm);

  // -------------------------------------------------------
  //  Chargement
  // -------------------------------------------------------
  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesAPI.getAll();
      const data = res.data?.data || res.data || [];
      // Trier par order, puis par name
      const sorted = [...data].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      setCategories(sorted);
    } catch {
      toast.error('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  // -------------------------------------------------------
  //  Helpers form
  // -------------------------------------------------------
  const openCreate = () => {
    setFormData(emptyForm);
    setEditMode(false);
    setEditingId(null);
    setShowFormModal(true);
  };

  const openEdit = (cat: any) => {
    setFormData({
      id: cat.id || '',
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order ?? 0,
      isActive: cat.isActive !== false,
    });
    setEditMode(true);
    setEditingId(cat._id);
    setShowFormModal(true);
  };

  const handleNameChange = (val: string) => {
    setFormData(f => ({
      ...f,
      name: val,
      // Auto-fill slug uniquement en création
      ...(editMode ? {} : { id: slugify(val) }),
    }));
  };

  // -------------------------------------------------------
  //  Soumission
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Le nom est requis');
    if (!formData.image.trim()) return toast.error("L'image est requise");
    if (!editMode && !formData.id.trim()) return toast.error('Le slug est requis');

    setSubmitting(true);
    try {
      const payload = {
        id: formData.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim(),
        order: formData.order,
        isActive: formData.isActive,
      };

      if (editMode && editingId) {
        await categoriesAPI.update(editingId, payload);
        toast.success('Catégorie mise à jour');
      } else {
        await categoriesAPI.create(payload);
        toast.success('Catégorie créée');
      }
      setShowFormModal(false);
      loadCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Erreur lors de la sauvegarde';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------
  //  Toggle actif
  // -------------------------------------------------------
  const handleToggleActive = async (cat: any) => {
    try {
      await categoriesAPI.update(cat._id, { isActive: !cat.isActive });
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, isActive: !c.isActive } : c));
      toast.success(cat.isActive ? 'Catégorie désactivée' : 'Catégorie activée');
    } catch {
      toast.error('Erreur lors du changement de statut');
    }
  };

  // -------------------------------------------------------
  //  Suppression
  // -------------------------------------------------------
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoriesAPI.delete(categoryToDelete);
      toast.success('Catégorie supprimée');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Impossible de supprimer cette catégorie';
      toast.error(msg);
      setShowDeleteModal(false);
    }
  };

  // -------------------------------------------------------
  //  Réordonnancement rapide
  // -------------------------------------------------------
  const moveOrder = async (cat: any, dir: 'up' | 'down') => {
    try {
      const newOrder = dir === 'up' ? cat.order - 1 : cat.order + 1;
      await categoriesAPI.update(cat._id, { order: newOrder });
      loadCategories();
    } catch {
      toast.error('Erreur de réordonnancement');
    }
  };

  // -------------------------------------------------------
  //  Filtrage
  // -------------------------------------------------------
  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -------------------------------------------------------
  //  Render
  // -------------------------------------------------------
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#3A3A3A]">Gestion des Catégories</h1>
          <p className="text-sm text-[#6B6B6B] mt-1">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#3A3A3A] text-white rounded-lg hover:bg-[#8B7355] transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" size={18} />
        <input
          type="text"
          placeholder="Rechercher une catégorie…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-[#E5E3DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-sm bg-white"
        />
      </div>

      {/* Grille catégories */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#8B7355]" size={36} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#6B6B6B]">
          <Tag size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Aucune catégorie trouvée</p>
          <button onClick={openCreate} className="mt-4 text-sm text-[#8B7355] underline">
            Créer la première catégorie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(cat => (
            <div
              key={cat._id}
              className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-opacity ${cat.isActive ? 'border-[#E5E3DF]' : 'border-[#E5E3DF] opacity-60'}`}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F3F0]">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=60'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={32} className="text-[#C4B8A8]" />
                  </div>
                )}
                {/* Badge statut */}
                <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {cat.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {/* Infos */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="font-semibold text-[#3A3A3A] text-sm leading-tight">{cat.name}</h3>
                    <p className="text-[10px] text-[#9B8E7E] font-mono mt-0.5">/{cat.id}</p>
                  </div>
                  <span className="text-xs text-[#8B7355] bg-[#F5F3F0] px-2 py-0.5 rounded-full whitespace-nowrap">
                    {cat.count ?? 0} produit{(cat.count ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-2">{cat.description}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EDE8]">
                  {/* Ordre */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(cat, 'up')}
                      className="p-1 text-[#6B6B6B] hover:text-[#3A3A3A] transition-colors"
                      title="Monter"
                    >
                      <MoveUp size={15} />
                    </button>
                    <span className="text-xs text-[#9B8E7E] w-4 text-center">{cat.order}</span>
                    <button
                      onClick={() => moveOrder(cat, 'down')}
                      className="p-1 text-[#6B6B6B] hover:text-[#3A3A3A] transition-colors"
                      title="Descendre"
                    >
                      <MoveDown size={15} />
                    </button>
                  </div>

                  {/* Autres actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className="p-1.5 rounded hover:bg-[#F5F3F0] transition-colors"
                      title={cat.isActive ? 'Désactiver' : 'Activer'}
                    >
                      {cat.isActive
                        ? <ToggleRight size={18} className="text-green-600" />
                        : <ToggleLeft size={18} className="text-[#6B6B6B]" />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded hover:bg-[#F5F3F0] text-[#6B6B6B] hover:text-[#8B7355] transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => { setCategoryToDelete(cat._id); setShowDeleteModal(true); }}
                      className="p-1.5 rounded hover:bg-red-50 text-[#6B6B6B] hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== MODAL FORMULAIRE ==================== */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E3DF] flex-shrink-0">
              <h2 className="text-lg font-bold text-[#3A3A3A]">
                {editMode ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="p-2 hover:bg-[#F5F3F0] rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Corps modal */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Ex: Robes & Jupes"
                  className="w-full px-3 py-2.5 border border-[#E5E3DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-sm"
                  required
                />
              </div>

              {/* Slug (id) */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Slug (identifiant URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={e => setFormData(f => ({ ...f, id: slugify(e.target.value) }))}
                  placeholder="Ex: robes-jupes"
                  className="w-full px-3 py-2.5 border border-[#E5E3DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-sm font-mono"
                  required
                  readOnly={editMode}
                />
                {editMode && (
                  <p className="text-xs text-[#9B8E7E] mt-1">Le slug ne peut pas être modifié après création.</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description courte de la catégorie…"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-[#E5E3DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-sm resize-none"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                  Image <span className="text-red-500">*</span>
                </label>
                <ImageUploader
                  currentImage={formData.image}
                  onImageSelect={(url: string) => setFormData(f => ({ ...f, image: url }))}
                />
              </div>

              {/* Ordre + Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Ordre d'affichage</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={e => setFormData(f => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-[#E5E3DF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Statut</label>
                  <button
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, isActive: !f.isActive }))}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      formData.isActive
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {formData.isActive
                      ? <><ToggleRight size={18} /> Actif</>
                      : <><ToggleLeft size={18} /> Inactif</>
                    }
                  </button>
                </div>
              </div>
            </form>

            {/* Footer modal */}
            <div className="flex gap-3 p-5 border-t border-[#E5E3DF] flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#E5E3DF] text-[#3A3A3A] rounded-lg hover:bg-[#F5F3F0] transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 bg-[#3A3A3A] text-white rounded-lg hover:bg-[#8B7355] transition-colors text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {editMode ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL SUPPRESSION ==================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#3A3A3A]">Supprimer la catégorie</h3>
                <p className="text-sm text-[#6B6B6B] mt-1">
                  Cette action est irréversible. La catégorie ne peut être supprimée que si elle ne contient aucun produit.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}
                className="flex-1 px-4 py-2.5 border border-[#E5E3DF] text-[#3A3A3A] rounded-lg hover:bg-[#F5F3F0] transition-colors text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

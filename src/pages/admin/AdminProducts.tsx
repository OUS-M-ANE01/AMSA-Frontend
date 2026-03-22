import { useState, useMemo } from 'react';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { productsAPI } from '../../services/api';
import { useProductsStore } from '../../stores/productsStore';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  X,
 Grid3x3,
  List,
  Tag,
  Percent
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../../components/admin/ImageUploader';

interface ProductForm {
  name: string;
  brand?: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  badge?: 'new' | 'sale' | 'bestseller' | '' | undefined;
}

export default function AdminProducts() {
  const { products, isLoading: loading, refetch } = useProducts();
  const { categories: apiCategories } = useCategories();
  const { removeProduct: removeFromStore, addProduct: addToStore, updateProduct: updateInStore } = useProductsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleTarget, setSaleTarget] = useState<any>(null);
  const [saleData, setSaleData] = useState({ oldPrice: 0, price: 0 });
  const [filterSale, setFilterSale] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    brand: '',
    price: 0,
    oldPrice: undefined,
    image: '',
    category: '',
    description: '',
    stock: 0,
    badge: undefined
  });

  // Filtrage client-side
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const catName = typeof p.category === 'string' ? p.category : (p.category as any)?.name || '';
      const catId = typeof p.category === 'string' ? p.category : (p.category as any)?._id || '';
      const matchCat = !selectedCategory || catId === selectedCategory || catName.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSale = !filterSale || p.badge === 'sale';
      return matchCat && matchSearch && matchSale;
    });
  }, [products, selectedCategory, searchTerm, filterSale]);

  // Fonctions CRUD avec API directe
  const handleSearch = () => {
    // Le hook useProducts gère déjà le chargement
    refetch();
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await productsAPI.delete(productToDelete);
      removeFromStore(productToDelete);
      toast.success('Produit supprimé avec succès');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({
      name: '',
      brand: '',
      price: 0,
      oldPrice: undefined,
      image: '',
      category: '',
      description: '',
      stock: 0,
      badge: undefined
    });
    setShowFormModal(true);
  };

  const openEditModal = (product: any) => {
    setEditMode(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: typeof product.category === 'string' ? product.category : product.category?._id || '',
      description: product.description || '',
      stock: product.stock,
      badge: product.badge ?? undefined
    });
    setShowFormModal(true);
  };

  const openSaleModal = (product: any) => {
    setSaleTarget(product);
    setSaleData({ oldPrice: product.oldPrice || product.price, price: product.price });
    setShowSaleModal(true);
  };

  const handleToggleSale = async () => {
    if (!saleTarget) return;
    const isCurrentlySale = saleTarget.badge === 'sale';
    try {
      const updatePayload = isCurrentlySale
        ? { badge: null, oldPrice: null }
        : { badge: 'sale', oldPrice: saleData.oldPrice, price: saleData.price };
      const response = await productsAPI.update(saleTarget._id, updatePayload);
      updateInStore(saleTarget._id, response.data.data);
      toast.success(isCurrentlySale ? 'Produit retiré des soldes' : 'Produit mis en soldes !');
      setShowSaleModal(false);
      setSaleTarget(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const saleDiscount = saleData.oldPrice > 0
    ? Math.round((1 - saleData.price / saleData.oldPrice) * 100)
    : 0;

  const openDetailModal = (product: any) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const productData = {
      ...formData,
      badge: formData.badge || null,
      oldPrice: formData.oldPrice || undefined
    };

    try {
      if (editMode && selectedProduct) {
        const response = await productsAPI.update(selectedProduct._id, productData);
        updateInStore(selectedProduct._id, response.data.data);
        toast.success('Produit modifié avec succès');
      } else {
        const response = await productsAPI.create(productData);
        addToStore(response.data.data);
        toast.success('Produit créé avec succès');
      }
      setShowFormModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
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
    <div className="p-6 space-y-0">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Package className="text-[#8B7355]" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-[#3A3A3A]">Produits</h1>
            <p className="text-[#6B6B6B] mt-1">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle View */}
          <div className="flex items-center gap-1 bg-[#F5F1ED] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#8B7355] text-white'
                  : 'text-[#6B6B6B] hover:text-[#8B7355]'
              }`}
              title="Vue grille"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#8B7355] text-white'
                  : 'text-[#6B6B6B] hover:text-[#8B7355]'
              }`}
              title="Vue liste"
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-colors"
          >
            <Plus size={20} />
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* Bandeau soldes actifs */}
      {(() => { const saleCount = products.filter(p => p.badge === 'sale').length; return saleCount > 0 ? (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
          <Tag className="text-red-500 flex-shrink-0" size={20} />
          <p className="text-red-700 text-sm font-medium">{saleCount} produit{saleCount > 1 ? 's' : ''} actuellement en soldes</p>
          <button onClick={() => setFilterSale(true)} className="ml-auto text-xs text-red-600 underline hover:text-red-800">Voir uniquement</button>
        </div>
      ) : null; })()}

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E0D5]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            {apiCategories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={() => setFilterSale(!filterSale)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              filterSale
                ? 'bg-red-500 text-white border-red-500'
                : 'border-[#D4C4B0] text-[#6B6B6B] hover:border-red-400 hover:text-red-500'
            }`}
          >
            <Tag size={16} />
            {filterSale ? 'En soldes ✓' : 'En soldes'}
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Vue Grille */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-[#E8E0D5] overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-[#FAF8F5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-[#8B7355] text-white text-xs font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openSaleModal(product)}
                    className={`p-1.5 rounded-lg transition-colors shadow-sm ${
                      product.badge === 'sale'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 hover:bg-white text-[#6B6B6B] hover:text-red-500'
                    }`}
                    title={product.badge === 'sale' ? 'Gérer le solde' : 'Mettre en soldes'}
                  >
                    <Tag size={14} />
                  </button>
                  <button
                    onClick={() => openDetailModal(product)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Voir"
                  >
                    <Eye size={14} className="text-[#8B7355]" />
                  </button>
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Modifier"
                  >
                    <Edit size={14} className="text-[#8B7355]" />
                  </button>
                  <button
                    onClick={() => confirmDelete(product._id)}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Supprimer"
                  >
                    <Trash2 size={14} className="text-[#C53030]" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-[#3A3A3A] text-sm mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-[#6B6B6B] mb-2">{typeof product.category === 'string' ? product.category : product.category?.name || 'Sans catégorie'}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-base font-bold text-[#8B7355]">
                      {product.price.toLocaleString()} F
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <>
                        <span className="text-xs text-[#9B9B9B] line-through ml-1">{product.oldPrice.toLocaleString()} F</span>
                        <span className="ml-1 text-xs text-red-500 font-bold">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                      </>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.stock < 10
                        ? 'bg-[#FDECEA] text-[#C53030]'
                        : product.stock < 30
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#D1FAE5] text-[#065F46]'
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span>Ventes: {product.sales || 0}</span>
                  <span
                    className={`${
                      product.isActive ? 'text-[#065F46]' : 'text-[#6B7280]'
                    }`}
                  >
                    {product.isActive ? '✓ Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vue Liste (Tableau) */
        <div className="bg-white rounded-xl shadow-sm border border-[#E8E0D5] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F1ED] border-b border-[#E8E0D5]">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Produit</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Catégorie</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Prix</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Stock</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Ventes</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Statut</th>
                  <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-[#E8E0D5] hover:bg-[#FAF8F5]">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-[#3A3A3A] text-sm">{product.name}</p>
                          {product.badge && (
                            <span className={`text-xs font-medium ${product.badge === 'sale' ? 'text-red-500' : 'text-[#8B7355]'}`}>{product.badge === 'sale' ? '🏷️ En soldes' : product.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[#6B6B6B] text-xs">
                      {typeof product.category === 'string' ? product.category : product.category?.name || 'Sans catégorie'}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <span className="font-semibold text-[#8B7355]">{product.price.toLocaleString()} F</span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <><br /><span className="text-xs text-[#9B9B9B] line-through">{product.oldPrice.toLocaleString()} F</span>
                        <span className="ml-1 text-xs text-red-500 font-bold">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stock < 10
                            ? 'bg-[#FDECEA] text-[#C53030]'
                            : product.stock < 30
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#D1FAE5] text-[#065F46]'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#6B6B6B] text-xs">{product.sales || 0}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-[#D1FAE5] text-[#065F46]'
                            : 'bg-[#F3F4F6] text-[#6B7280]'
                        }`}
                      >
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openSaleModal(product)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            product.badge === 'sale'
                              ? 'bg-red-100 text-red-500 hover:bg-red-200'
                              : 'text-[#6B6B6B] hover:bg-[#F5F1ED] hover:text-red-500'
                          }`}
                          title={product.badge === 'sale' ? 'Gérer le solde' : 'Mettre en soldes'}
                        >
                          <Tag size={14} />
                        </button>
                        <button
                          onClick={() => openDetailModal(product)}
                          className="p-1.5 text-[#8B7355] hover:bg-[#F5F1ED] rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-[#8B7355] hover:bg-[#F5F1ED] rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="p-1.5 text-[#C53030] hover:bg-[#FDECEA] rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Formulaire */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 bg-white rounded-t-xl px-6 py-4 border-b border-[#E8E0D5] flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#3A3A3A]">
                {editMode ? 'Modifier le produit' : 'Nouveau produit'}
              </h3>
              <button 
                type="button"
                onClick={() => setShowFormModal(false)} 
                className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#6B6B6B]" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-[#3A3A3A] flex items-center gap-2">
                    <Package size={20} className="text-[#8B7355]" />
                    Informations du produit
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                        Nom * <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        placeholder="Ex: Robe élégante"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Marque</label>
                      <input 
                        type="text" 
                        value={formData.brand} 
                        onChange={(e) => setFormData({...formData, brand: e.target.value})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        placeholder="Ex: ASMA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                        Prix (FCFA) <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.price} 
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        placeholder="0"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Ancien prix</label>
                      <input 
                        type="number" 
                        value={formData.oldPrice || ''} 
                        onChange={(e) => setFormData({...formData, oldPrice: e.target.value ? Number(e.target.value) : undefined})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        required
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {apiCategories
                          .filter((cat: any) => cat.isActive !== false)
                          .map((cat: any) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number" 
                        value={formData.stock} 
                        onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} 
                        className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all" 
                        placeholder="0"
                        required 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Badge</label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, badge: undefined})}
                          className={`px-4 py-2.5 rounded-lg border transition-all ${
                            !formData.badge 
                              ? 'border-[#8B7355] bg-[#8B7355]/10 text-[#8B7355] font-medium' 
                              : 'border-[#D4C4B0] hover:border-[#8B7355]'
                          }`}
                        >
                          Aucun
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, badge: 'new'})}
                          className={`px-4 py-2.5 rounded-lg border transition-all ${
                            formData.badge === 'new' 
                              ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium' 
                              : 'border-[#D4C4B0] hover:border-blue-500'
                          }`}
                        >
                          Nouveau
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, badge: 'sale'})}
                          className={`px-4 py-2.5 rounded-lg border transition-all ${
                            formData.badge === 'sale' 
                              ? 'border-red-500 bg-red-50 text-red-600 font-medium' 
                              : 'border-[#D4C4B0] hover:border-red-500'
                          }`}
                        >
                          Promo
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, badge: 'bestseller'})}
                          className={`px-4 py-2.5 rounded-lg border transition-all ${
                            formData.badge === 'bestseller' 
                              ? 'border-green-500 bg-green-50 text-green-600 font-medium' 
                              : 'border-[#D4C4B0] hover:border-green-500'
                          }`}
                        >
                          Best seller
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Image */}
                <div className="space-y-4 border-t border-[#E8E0D5] pt-6">
                  <h4 className="text-lg font-semibold text-[#3A3A3A]">Image du produit</h4>
                  <ImageUploader 
                    currentImage={formData.image}
                    onImageSelect={(url) => setFormData({...formData, image: url})}
                  />
                </div>

                {/* Description */}
                <div className="space-y-4 border-t border-[#E8E0D5] pt-6">
                  <h4 className="text-lg font-semibold text-[#3A3A3A]">Description</h4>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none transition-all resize-none" 
                    rows={4}
                    placeholder="Décrivez le produit en détails..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                  <button 
                    type="button" 
                    onClick={() => setShowFormModal(false)} 
                    className="flex-1 px-6 py-3 border-2 border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED] font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] font-medium transition-colors shadow-lg"
                  >
                    {editMode ? '✓ Modifier' : '+ Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3A3A3A]">Détails du produit</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg">
                <X size={24} className="text-[#6B6B6B]" />
              </button>
            </div>
            <div className="space-y-0">
              <div className="flex gap-6">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-48 h-48 object-cover rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-[#3A3A3A]">{selectedProduct.name}</h4>
                    <p className="text-sm text-[#6B6B6B]">{selectedProduct.brand}</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-[#8B7355]">{selectedProduct.price.toLocaleString()} FCFA</span>
                    {selectedProduct.oldPrice && <span className="ml-2 text-lg text-[#9B9B9B] line-through">{selectedProduct.oldPrice.toLocaleString()} FCFA</span>}
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.badge && <span className="px-3 py-1 bg-[#8B7355] text-white text-sm rounded-full">{selectedProduct.badge}</span>}
                    <span className={`px-3 py-1 text-sm rounded-full ${selectedProduct.isActive ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>{selectedProduct.isActive ? 'Actif' : 'Inactif'}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E0D5]">
                <div><p className="text-sm text-[#6B6B6B]">Catégorie</p><p className="font-medium text-[#3A3A3A]">{typeof selectedProduct.category === 'string' ? selectedProduct.category : selectedProduct.category?.name || 'Sans catégorie'}</p></div>
                <div><p className="text-sm text-[#6B6B6B]">Stock</p><p className="font-medium text-[#3A3A3A]">{selectedProduct.stock} unités</p></div>
                <div><p className="text-sm text-[#6B6B6B]">Ventes</p><p className="font-medium text-[#3A3A3A]">{selectedProduct.sales || 0}</p></div>
                <div><p className="text-sm text-[#6B6B6B]">Vues</p><p className="font-medium text-[#3A3A3A]">{selectedProduct.views || 0}</p></div>
              </div>
              {selectedProduct.description && (
                <div className="pt-4 border-t border-[#E8E0D5]">
                  <p className="text-sm text-[#6B6B6B] mb-2">Description</p>
                  <p className="text-[#3A3A3A]">{selectedProduct.description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-6">
              <button onClick={() => {setShowDetailModal(false); openEditModal(selectedProduct);}} className="flex-1 px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942]">Modifier</button>
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]">Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Soldes */}
      {showSaleModal && saleTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-full"><Tag className="text-red-500" size={24} /></div>
                <div>
                  <h3 className="text-xl font-bold text-[#3A3A3A]">Gérer le solde</h3>
                  <p className="text-sm text-[#6B6B6B] truncate max-w-[200px]">{saleTarget.name}</p>
                </div>
              </div>
              <button onClick={() => setShowSaleModal(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg"><X size={20} className="text-[#6B6B6B]" /></button>
            </div>

            {saleTarget.badge === 'sale' ? (
              /* Produit déjà en soldes → proposition de retirer */
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 font-medium text-sm">Ce produit est actuellement en soldes</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-lg font-bold text-[#8B7355]">{saleTarget.price.toLocaleString()} F</span>
                    {saleTarget.oldPrice && <span className="text-[#9B9B9B] line-through">{saleTarget.oldPrice.toLocaleString()} F</span>}
                    {saleTarget.oldPrice && <span className="text-red-500 font-bold">-{Math.round((1 - saleTarget.price / saleTarget.oldPrice) * 100)}%</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowSaleModal(false)} className="flex-1 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]">Fermer</button>
                  <button onClick={handleToggleSale} className="flex-1 px-4 py-2 bg-[#6B7280] text-white rounded-lg hover:bg-[#4B5563]">Retirer des soldes</button>
                </div>
              </div>
            ) : (
              /* Mettre en soldes */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Prix original (avant réduction)</label>
                  <input
                    type="number"
                    value={saleData.oldPrice}
                    onChange={(e) => setSaleData({ ...saleData, oldPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                    placeholder="Ex: 25000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-1.5">Prix soldé (nouveau prix)</label>
                  <input
                    type="number"
                    value={saleData.price}
                    onChange={(e) => setSaleData({ ...saleData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                    placeholder="Ex: 18000"
                  />
                </div>
                {saleDiscount > 0 && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <Percent className="text-red-500" size={18} />
                    <span className="text-red-700 font-bold text-lg">-{saleDiscount}%</span>
                    <span className="text-red-600 text-sm">de réduction</span>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setShowSaleModal(false)} className="flex-1 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]">Annuler</button>
                  <button
                    onClick={handleToggleSale}
                    disabled={saleData.oldPrice <= 0 || saleData.price <= 0 || saleData.price >= saleData.oldPrice}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Mettre en soldes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FDECEA] rounded-full"><Trash2 className="text-[#C53030]" size={24} /></div>
              <h3 className="text-xl font-bold text-[#3A3A3A]">Supprimer le produit</h3>
            </div>
            <p className="text-[#6B6B6B] mb-6">Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => {setShowDeleteModal(false); setProductToDelete(null);}} className="flex-1 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]">Annuler</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-[#C53030] text-white rounded-lg hover:bg-[#991B1B]">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

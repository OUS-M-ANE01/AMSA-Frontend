import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { paymentAPI } from '../services/api';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard (3-5 jours)', price: 0, displayPrice: 'Gratuit' },
  { id: 'express', label: 'Express (1-2 jours)', price: 6500, displayPrice: '6 500 FCFA' },
  { id: 'premium', label: 'Premium (24h)', price: 9800, displayPrice: '9 800 FCFA' },
];

// Méthodes NabooPay
type NabooMethod = 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'EXPRESSO';

const PAYMENT_METHODS: { id: NabooMethod; label: string; color: string; logo: string }[] = [
  {
    id: 'WAVE',
    label: 'Wave',
    color: '#009ADE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Wave_money_logo.png/320px-Wave_money_logo.png',
  },
  {
    id: 'ORANGE_MONEY',
    label: 'Orange Money',
    color: '#FF6600',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Orange_Money_logo.png/320px-Orange_Money_logo.png',
  },
];

export default function Checkout({ onNavigate: _onNavigate }: CheckoutProps) {
  const { items: cartItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    prenom: '', nom: '', adresse: '', ville: '', telephone: '', email: '',
  });
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<NabooMethod>('WAVE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const deliveryCost = DELIVERY_OPTIONS[selectedDelivery].price;
  const total = totalPrice + deliveryCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    const required = ['prenom', 'nom', 'adresse', 'ville', 'telephone'];
    const missing = required.filter(k => !form[k as keyof typeof form].trim());
    if (missing.length > 0) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await paymentAPI.initNabooPay({
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })),
        shippingAddress: {
          prenom: form.prenom,
          nom: form.nom,
          adresse: form.adresse,
          ville: form.ville,
          telephone: form.telephone,
          email: form.email || undefined,
        },
        paymentMethods: [selectedPayment],
        deliveryCost,
      });

      const { checkoutUrl } = res.data;

      // Vider le panier (la commande est créée en DB) et rediriger
      clearCart();
      window.location.href = checkoutUrl;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Une erreur est survenue. Veuillez réessayer.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-18">
      {/* Hero */}
      <div className="relative h-[40vh] flex flex-col items-center justify-center bg-cream">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-charcoal">
          <em className="italic text-gold">Commande</em>
        </h1>
        <p className="mt-4 text-text-light text-base md:text-lg">Finalisez votre achat en toute sécurité</p>
      </div>

      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">

            {/* ── Formulaire ── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Informations de livraison */}
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-charcoal mb-6">
                  Informations de <em className="italic text-gold">livraison</em>
                </h2>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Prénom / Nom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Prénom *</label>
                      <input
                        type="text" name="prenom" value={form.prenom} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Nom *</label>
                      <input
                        type="text" name="nom" value={form.nom} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  {/* Adresse / Ville */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Adresse *</label>
                      <input
                        type="text" name="adresse" value={form.adresse} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="Rue / Quartier"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Ville *</label>
                      <input
                        type="text" name="ville" value={form.ville} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="Dakar"
                      />
                    </div>
                  </div>

                  {/* Téléphone / Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Téléphone *</label>
                      <input
                        type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="+221 77 000 00 00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-charcoal mb-2">Email <span className="text-text-light font-normal">(optionnel)</span></label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* ── Mode de livraison ── */}
              <div>
                <h2 className="font-serif text-2xl font-light text-charcoal mb-4">
                  Mode de <em className="italic text-gold">livraison</em>
                </h2>
                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((option, i) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                        selectedDelivery === i ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'
                      }`}
                      onClick={() => setSelectedDelivery(i)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedDelivery === i ? 'border-gold' : 'border-border'
                        }`}>
                          {selectedDelivery === i && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                        </div>
                        <span className="text-sm text-charcoal">{option.label}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal">{option.displayPrice}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Méthode de paiement NabooPay ── */}
              <div>
                <h2 className="font-serif text-2xl font-light text-charcoal mb-2">
                  Méthode de <em className="italic text-gold">paiement</em>
                </h2>
                <p className="text-text-light text-sm mb-5">
                  Paiement sécurisé via{' '}
                  <span className="font-semibold text-charcoal">NabooPay</span>
                  {' '}— votre opérateur mobile
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                        selectedPayment === method.id
                          ? 'border-gold bg-gold/5 shadow-sm'
                          : 'border-border hover:border-gold/50 bg-white'
                      }`}
                    >
                      {/* Indicateur sélection */}
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-gold' : 'border-border'
                      }`}>
                        {selectedPayment === method.id && <div className="w-2 h-2 bg-gold rounded-full" />}
                      </div>

                      {/* Logo ou pastille couleur */}
                      {method.logo ? (
                        <img
                          src={method.logo}
                          alt={method.label}
                          className="h-6 w-auto object-contain flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex-shrink-0"
                          style={{ backgroundColor: method.color }}
                        />
                      )}

                      <span className="text-sm font-medium text-charcoal leading-tight">{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Badge NabooPay */}
                <div className="mt-4 flex items-center gap-2 text-xs text-text-light">
                  <span>🔒</span>
                  <span>Paiement sécurisé et crypté via NabooPay</span>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>

            {/* ── Récapitulatif ── */}
            <div>
              <div className="bg-cream p-6 sticky top-24">
                <h3 className="font-serif text-xl font-light text-charcoal mb-6">Récapitulatif</h3>

                {cartItems.length > 0 ? (
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    {cartItems.map(item => (
                      <div key={item.productId} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal font-medium truncate">{item.name}</p>
                          <p className="text-xs text-text-light">x{item.quantity}</p>
                          <p className="text-sm font-medium text-charcoal">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-light mb-6 pb-6 border-b border-border">Panier vide</p>
                )}

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Sous-total</span>
                    <span className="text-charcoal font-medium">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Livraison</span>
                    <span className="text-charcoal font-medium">
                      {deliveryCost === 0 ? 'Gratuit' : `${deliveryCost.toLocaleString()} FCFA`}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mb-2">
                  <span className="font-medium text-charcoal">Total</span>
                  <span className="text-2xl font-serif text-charcoal">{total.toLocaleString()} FCFA</span>
                </div>

                {/* Rappel méthode choisie */}
                <p className="text-xs text-text-light mb-6">
                  via{' '}
                  <span className="font-medium text-charcoal">
                    {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.label}
                  </span>
                  {' '}(NabooPay)
                </p>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting || cartItems.length === 0}
                  className="w-full bg-charcoal text-white py-4 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Redirection…' : 'Payer maintenant'}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-light">
                  <span>🔒</span>
                  <span>Paiement 100% sécurisé via NabooPay</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

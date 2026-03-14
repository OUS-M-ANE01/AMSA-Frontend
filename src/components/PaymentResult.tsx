import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { paymentAPI } from '../services/api';

interface PaymentResultProps {
  status: 'success' | 'error';
  orderId: string;
  nabooId: string;
  onNavigate: (page: string) => void;
}

export default function PaymentResult({ status, orderId, nabooId, onNavigate }: PaymentResultProps) {
  const [verifying, setVerifying] = useState(status === 'success' && !!orderId);
  const [paid, setPaid] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    if (status !== 'success' || !orderId) return;

    let attempts = 0;
    const maxAttempts = 5;
    const delay = 2000; // 2s entre chaque tentative

    const tryVerify = () => {
      paymentAPI.verify(orderId, nabooId || '')
        .then(res => {
          if (res.data.paid) {
            setPaid(true);
            setVerifying(false);
          } else if (attempts < maxAttempts) {
            // Pas encore confirmé — réessayer (webhook peut arriver légèrement après)
            attempts++;
            setTimeout(tryVerify, delay);
          } else {
            setVerifying(false); // Affiche "en cours de traitement"
          }
        })
        .catch(() => {
          if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryVerify, delay);
          } else {
            setVerifyError('Impossible de vérifier le paiement. Contactez-nous si vous avez été débité.');
            setVerifying(false);
          }
        });
    };

    tryVerify();
  }, [status, orderId, nabooId]);

  if (verifying) {
    return (
      <div className="min-h-screen pt-18 flex flex-col items-center justify-center bg-warm-white px-4 gap-4">
        <Loader2 className="text-gold animate-spin" size={48} />
        <p className="text-text-light text-sm">Vérification du paiement…</p>
      </div>
    );
  }

  // Succès vérifié
  if (status === 'success' && paid) {
    return (
      <div className="min-h-screen pt-18 flex flex-col items-center justify-center bg-warm-white px-4 text-center">
        <CheckCircle className="text-gold mb-6" size={72} />
        <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-3">
          Paiement <em className="italic text-gold">confirmé</em> !
        </h1>
        <p className="text-text-light max-w-md mb-2">
          Votre commande a bien été enregistrée et votre paiement reçu. Vous serez contacté(e) pour la livraison.
        </p>
        {orderId && (
          <p className="text-xs text-text-light mb-8">Référence : <span className="font-mono text-charcoal">{orderId}</span></p>
        )}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => onNavigate('profil')}
            className="bg-charcoal text-white px-8 py-3 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
          >
            Mes commandes
          </button>
          <button
            onClick={() => onNavigate('accueil')}
            className="border border-border text-charcoal px-8 py-3 hover:border-gold transition-colors text-sm font-medium tracking-wider uppercase"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Retour "succès" mais paiement pas encore confirmé (PENDING côté NabooPay)
  if (status === 'success' && !paid && !verifyError) {
    return (
      <div className="min-h-screen pt-18 flex flex-col items-center justify-center bg-warm-white px-4 text-center">
        <Loader2 className="text-gold mb-6 animate-spin" size={56} />
        <h1 className="font-serif text-2xl font-light text-charcoal mb-3">
          Paiement en cours de traitement…
        </h1>
        <p className="text-text-light max-w-md mb-8 text-sm">
          Votre commande est enregistrée. Nous attendons la confirmation de votre opérateur. Vous recevrez une notification dès validation.
        </p>
        <button
          onClick={() => onNavigate('accueil')}
          className="bg-charcoal text-white px-8 py-3 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Erreur (redirection error NabooPay ou vérification échouée)
  return (
    <div className="min-h-screen pt-18 flex flex-col items-center justify-center bg-warm-white px-4 text-center">
      <XCircle className="text-red-400 mb-6" size={72} />
      <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-3">
        Paiement <em className="italic text-red-400">échoué</em>
      </h1>
      <p className="text-text-light max-w-md mb-2">
        {verifyError || 'Le paiement n\'a pas pu être complété. Aucun montant n\'a été débité.'}
      </p>
      <p className="text-xs text-text-light mb-8">Vous pouvez réessayer ou choisir une autre méthode.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => onNavigate('checkout')}
          className="bg-charcoal text-white px-8 py-3 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
        >
          Réessayer
        </button>
        <button
          onClick={() => onNavigate('accueil')}
          className="border border-border text-charcoal px-8 py-3 hover:border-gold transition-colors text-sm font-medium tracking-wider uppercase"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

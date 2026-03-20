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
          Votre commande a bien été enregistrée et votre paiement reçu. 
        </p>
        {orderId && (
          <p className="text-xs text-text-light mb-8">Référence : <span className="font-mono text-charcoal">{orderId}</span></p>
        )}
        <div className="flex gap-4 flex-wrap justify-center mb-8">
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

        {/* Message de contact pour livraison */}
        <div className="max-w-md mx-auto p-6 bg-gold/10 border border-gold/20 rounded-lg">
          <h3 className="font-serif text-lg font-medium text-charcoal mb-3">
            📦 Livraison & Récupération
          </h3>
          <p className="text-sm text-text-light mb-4">
            Pour la livraison ou la récupération de votre commande, contactez-nous :
          </p>
          <a
            href={`https://wa.me/221787965132?text=Bonjour,%20je%20souhaite%20organiser%20la%20livraison%20de%20ma%20commande%20%23${orderId || 'COMMANDE'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
            </svg>
            Contacter sur WhatsApp
          </a>
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
      <div className="flex gap-4 flex-wrap justify-center mb-8">
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

        {/* Message de contact pour livraison */}
        <div className="max-w-md mx-auto p-6 bg-gold/10 border border-gold/20 rounded-lg">
          <h3 className="font-serif text-lg font-medium text-charcoal mb-3">
            📦 Livraison & Récupération
          </h3>
          <p className="text-sm text-text-light mb-4">
            Pour la livraison ou la récupération de votre commande, contactez-nous :
          </p>
          <a
            href={`https://wa.me/221787965132?text=Bonjour,%20je%20souhaite%20organiser%20la%20livraison%20de%20ma%20commande%20%23${orderId || 'COMMANDE'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
            </svg>
            Contacter sur WhatsApp
          </a>
        </div>
    </div>
  );
}

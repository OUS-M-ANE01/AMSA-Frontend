import { Truck, ShieldCheck, RotateCcw, Gem } from 'lucide-react';

export default function TrustStrip() {
  const items = [
    { icon: Truck, text: 'Livraison offerte dès 52 000 FCFA' },
    { icon: ShieldCheck, text: 'Paiement 100% sécurisé' },
    { icon: RotateCcw, text: 'Retours gratuits 30 jours' },
    { icon: Gem, text: 'Matières sélectionnées' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-6 lg:gap-12 px-4 md:px-8 lg:px-14 py-4 md:py-6 lg:py-8 border-t border-b border-black bg-black">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] md:text-[13px] tracking-wider text-white">
          <item.icon size={18} className="text-gold flex-shrink-0" />
          <span className="whitespace-nowrap">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function Newsletter() {
  return (
    <section className="bg-charcoal text-center px-4 md:px-8 lg:px-14 py-16 md:py-24">
      <div>
        <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-3">
          Newsletter
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-white max-w-[600px] mx-auto mb-4">
          Restez dans la <em className="italic text-gold-light">Tendance</em>
        </h2>
        <p className="text-white/55 text-sm md:text-[15px] font-light mb-8 md:mb-10 max-w-[500px] mx-auto">
          Inscrivez-vous et recevez en avant-première nos nouvelles collections, offres exclusives et inspirations mode.
        </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.currentTarget.elements[0] as HTMLInputElement).value;
            if (email) {
              alert(`Merci ! Vous êtes maintenant inscrit avec ${email}`);
              e.currentTarget.reset();
            }
          }}
          className="flex flex-col sm:flex-row max-w-[460px] mx-auto border border-white/20 rounded-sm overflow-hidden gap-0"
        >
          <input 
            type="email" 
            placeholder="Votre adresse email..."
            className="flex-1 bg-transparent border-none px-4 md:px-5 py-3 md:py-4 text-white text-sm outline-none placeholder:text-white/35"
          />
          <button 
            type="submit"
            className="bg-gold px-6 md:px-7 py-3 md:py-4 text-charcoal text-xs font-semibold tracking-[0.12em] uppercase hover:bg-gold-light transition-colors"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </section>
  );
}

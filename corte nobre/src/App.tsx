import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  ChevronRight, 
  Star, 
  Menu, 
  X,
  MessageCircle,
  Gem,
  Award,
  Clock
} from 'lucide-react';

// --- Constants ---
const WHATSAPP_LINK = "https://wa.me/5500000000000?text=Olá! Gostaria de agendar um horário na Corte Nobre.";

const SERVICES = [
  { name: "Corte na Máquina", price: "R$ 40", desc: "Corte prático e rápido com acabamento impecável." },
  { name: "Corte Social / Degradê", price: "R$ 60", desc: "Nosso serviço mais procurado, com finalização premium." },
  { name: "Barba Completa", price: "R$ 45", desc: "Desenho da barba, toalha quente e óleos hidratantes." },
  { name: "Combo: Corte + Barba", price: "R$ 95", desc: "A experiência completa para o homem moderno." },
  { name: "Limpeza de Pele", price: "R$ 30", desc: "Remoção de impurezas e hidratação facial." },
  { name: "Pigmentação", price: "R$ 20", desc: "Realce o desenho da sua barba ou do seu corte." },
];

const DIFFERENTIALS = [
  { icon: <Gem className="w-8 h-8 text-gold" />, title: "Atendimento Premium", desc: "Foco total na sua experiência e cada detalhe do seu visual." },
  { icon: <Award className="w-8 h-8 text-gold" />, title: "Profissionais Expert", desc: "Barbeiros atualizados com as últimas tendências mundiais." },
  { icon: <Clock className="w-8 h-8 text-gold" />, title: "Pontualidade", desc: "Respeitamos o seu tempo com agendamentos precisos." },
  { icon: <MessageCircle className="w-8 h-8 text-gold" />, title: "Melhor Papo", desc: "Um ambiente onde você se sente entre amigos." },
];

const TESTIMONIALS = [
  { name: "Carlos Oliveira", text: "A melhor barbearia da região. O atendimento é diferenciado e o ambiente é fenomenal.", stars: 5 },
  { name: "Rodrigo Santos", text: "Profissionais de alto nível. Faço minha barba aqui há 2 anos e não troco por nada.", stars: 5 },
  { name: "André Luz", text: "Corte impecável. O café deles também é excelente!", stars: 5 },
];

// --- Components ---

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-12 text-center">
    {subtitle && <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">{subtitle}</span>}
    <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-4">
      {children}
    </h2>
    <div className="w-20 h-1 bg-gold mx-auto" />
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark-surface)] selection:bg-gold selection:text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            < Scissors className="text-gold w-8 h-8" />
            <span className="font-display font-black text-xl tracking-tighter uppercase italic">
              Corte <span className="text-gold">Nobre</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-display text-sm font-semibold uppercase tracking-widest">
            {["Sobre", "Serviços", "Diferenciais", "Depoimentos"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gold transition-colors">{item}</a>
            ))}
            <a 
              href={WHATSAPP_LINK}
              target="_blank" 
              rel="noreferrer"
              className="bg-gold text-black px-6 py-2.5 rounded-none hover:bg-gold-light transition-all transform hover:-translate-y-0.5 active:scale-95 font-bold"
            >
              Agendar Agora
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-black p-8 flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-8 right-8" onClick={() => setIsMenuOpen(false)}>
              <X className="w-10 h-10 text-gold" />
            </button>
            {["Sobre", "Serviços", "Diferenciais", "Depoimentos"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-display font-bold uppercase tracking-widest hover:text-gold transition-colors"
              >
                {item}
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK}
              className="mt-4 bg-gold text-black px-10 py-5 rounded-none text-xl font-bold uppercase tracking-widest text-center"
            >
              Agendar agora
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Barbearia background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[var(--color-dark-surface)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-display font-bold uppercase tracking-[0.5em] text-sm mb-4 block">
              Tradição & Estilo
            </span>
            <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none mb-8">
              Seu estilo <br/> <span className="text-gold drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">começa aqui</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Mais que um corte, uma experiência de alto nível para quem valoriza a imagem e o bem-estar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="group relative bg-gold text-black px-10 py-5 font-display font-extrabold uppercase tracking-widest transition-all hover:bg-gold-light overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Agendar via WhatsApp <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a 
                href="#serviços"
                className="px-10 py-5 border border-white/20 font-display font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-all"
              >
                Ver Serviços
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000" 
              alt="Sobre nós" 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl skew-y-1"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold opacity-50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold font-display font-bold uppercase tracking-widest text-sm mb-4 block">Nossa História</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-8">
              Excelência em <br/> <span className="text-gold">Cada Detalhe</span>
            </h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
              <p>
                A <strong>Corte Nobre Barbearia</strong> nasceu do desejo de resgatar a essência das barbearias clássicas, unindo técnica tradicional ao conforto contemporâneo.
              </p>
              <p>
                Nossos barberos não apenas cortam fios, eles esculpem imagens. Entendemos que seu visual é seu cartão de visitas, e por isso dedicamos o tempo necessário para que cada visita seja perfeita.
              </p>
              <p>
                Em um ambiente projetado para o homem moderno, oferecemos cerveja gelada, café gourmet e a melhor conversa da cidade.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="serviços" className="py-24 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 font-display">
          <SectionTitle subtitle="Menu Premium">Serviços & Preços</SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 bg-[var(--color-dark-card)] border border-white/5 hover:border-gold/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  < Scissors className="w-24 h-24 text-white -rotate-12" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h3 className="text-xl font-display font-bold uppercase tracking-wide group-hover:text-gold transition-colors">
                    {service.name}
                  </h3>
                  <span className="text-gold font-display font-bold text-lg">{service.price}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors font-sans">
                  {service.desc}
                </p>
                <div className="w-full h-[1px] bg-white/5 group-hover:bg-gold/30 transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-24 px-6 max-w-7xl mx-auto">
        <SectionTitle subtitle="Por que nos escolher">O Diferencial Nobre</SectionTitle>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DIFFERENTIALS.map((diff, index) => (
            <motion.div
              key={diff.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 bg-white/5 hover:bg-white/10 transition-colors border-t-2 border-transparent hover:border-gold"
            >
              <div className="inline-flex items-center justify-center mb-6 bg-black p-4 rounded-full border border-gold shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                {diff.icon}
              </div>
              <h3 className="text-xl font-display font-bold mb-4 uppercase tracking-wider">{diff.title}</h3>
              <p className="text-gray-400 text-sm font-sans">{diff.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 bg-black/40">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle subtitle="Clientes Satisfeitos">O Que Dizem de Nós</SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, index) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--color-dark-card)] p-8 border-l-4 border-gold shadow-xl"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="italic text-gray-300 mb-8 leading-relaxed font-sans">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                    {test.name.charAt(0)}
                  </div>
                  <span className="font-display font-bold text-sm uppercase tracking-widest">{test.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
              < Scissors className="text-gold w-8 h-8" />
              <span className="font-display font-black text-2xl tracking-tighter uppercase italic">
                Corte <span className="text-gold">Nobre</span>
              </span>
            </div>
            <p className="text-gray-500 mb-8 leading-relaxed font-sans">
              Elevando o conceito de estética masculina desde 2018. Sua melhor versão está apenas a um agendamento de distância.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all rounded-full"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all rounded-full"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-display font-bold uppercase tracking-widest text-lg mb-8 border-b border-gold w-fit mx-auto md:mx-0 pb-2">Contato</h4>
            <div className="flex items-start gap-4 text-gray-400 group cursor-default justify-center md:justify-start font-sans">
              <MapPin className="w-6 h-6 text-gold flex-shrink-0" />
              <span>Rua dos Nobres, 123 - Centro <br/> São Paulo - SP</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 group cursor-default justify-center md:justify-start font-sans">
              <Phone className="w-6 h-6 text-gold flex-shrink-0" />
              <span>(11) 99999-8888</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 group cursor-default justify-center md:justify-start font-sans">
              <Clock className="w-6 h-6 text-gold flex-shrink-0" />
              <span>Seg - Sáb: 09:00 - 20:00</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-lg mb-8 border-b border-gold w-fit mx-auto md:mx-0 pb-2">Links</h4>
            <ul className="space-y-4 font-display text-sm uppercase tracking-widest text-gray-500">
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#serviços" className="hover:text-white transition-colors">Nossos Serviços</a></li>
              <li><a href="#diferenciais" className="hover:text-white transition-colors">Diferenciais</a></li>
              <li><a href={WHATSAPP_LINK} className="hover:text-white transition-colors">Agendar Horário</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-xs uppercase tracking-widest">
          <p>© 2026 Corte Nobre Barbearia. Todos os direitos reservados.</p>
          <p>Desenvolvido com excelência</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href={WHATSAPP_LINK}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 overflow-hidden max-w-[60px] hover:max-w-[200px] duration-500"
      >
        <MessageCircle className="w-8 h-8 flex-shrink-0" />
        <span className="font-bold opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">Agendar Agora</span>
      </a>
    </div>
  );
}


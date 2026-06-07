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
  Clock,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  Lock,
  User,
  ExternalLink
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

// --- Types ---
interface Service {
  id: string;
  name: string;
  price: string;
  desc: string;
  created_at?: string;
}

// --- Constants ---
const DEFAULT_SERVICES: Service[] = [
  { id: '1', name: "Corte na Máquina", price: "R$ 40", desc: "Corte prático e rápido com acabamento impecável." },
  { id: '2', name: "Corte Social / Degradê", price: "R$ 60", desc: "Nosso serviço mais procurado, com finalização premium." },
  { id: '3', name: "Barba Completa", price: "R$ 45", desc: "Desenho da barba, toalha quente e óleos hidratantes." },
  { id: '4', name: "Combo: Corte + Barba", price: "R$ 95", desc: "A experiência completa para o homem moderno." },
  { id: '5', name: "Limpeza de Pele", price: "R$ 30", desc: "Remoção de impurezas e hidratação facial." },
  { id: '6', name: "Pigmentação", price: "R$ 20", desc: "Realce o desenho da sua barba ou do seu corte." },
];

const WHATSAPP_NUMBER = "5500000000000";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de agendar um horário na Corte Nobre.`;
const LOGIN_NOTICE = 'Modo demonstração ativo. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para liberar o painel administrativo.';

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

// --- Helper Components ---
const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="mb-12 text-center">
    {subtitle && <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">{subtitle}</span>}
    <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-4">
      {children}
    </h2>
    <div className="w-20 h-1 bg-gold mx-auto" />
  </div>
);

// --- Main Application Component ---
export default function App() {
  const [view, setView] = useState<'site' | 'login' | 'admin'>('site');
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin CRUD States
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({ name: '', price: '', desc: '' });

  const goToSite = () => {
    window.location.hash = 'site';
    setView('site');
  };

  const goToAdmin = () => {
    window.location.hash = 'admin';
    setView('login');
  };

  useEffect(() => {
    fetchServices();
    checkUser();

    // Listener para mudanças de hash na URL para navegação interna
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') setView('login');
      else if (hash === '#site') setView('site');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user && view === 'login') setView('admin');
  }

  async function fetchServices() {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) setServices(data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
      // Se falhar (ex: Supabase não configurado), usa os padrões
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    if (!isSupabaseConfigured) {
      setUser({ email: email || 'demo@cortenobre.com' });
      setView('admin');
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setView('admin');
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    goToSite();
  }

  // --- CRUD Functions ---
  async function addService() {
    if (!newService.name || !newService.price) return;
    if (!isSupabaseConfigured) {
      const localService: Service = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
        name: newService.name,
        price: newService.price,
        desc: newService.desc || '',
      };
      setServices([...services, localService]);
      setNewService({ name: '', price: '', desc: '' });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select();
      if (error) throw error;
      setServices([...services, data[0]]);
      setNewService({ name: '', price: '', desc: '' });
    } catch (err) {
      console.error("Erro ao adicionar:", err);
    }
  }

  async function updateService(id: string) {
    if (!editingService) return;
    if (!isSupabaseConfigured) {
      setServices(services.map(s => s.id === id ? { ...editingService, id } : s));
      setEditingService(null);
      return;
    }
    try {
      const { error } = await supabase
        .from('services')
        .update({ name: editingService.name, price: editingService.price, desc: editingService.desc })
        .eq('id', id);
      if (error) throw error;
      setServices(services.map(s => s.id === id ? editingService : s));
      setEditingService(null);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    if (!isSupabaseConfigured) {
      setServices(services.filter(s => s.id !== id));
      return;
    }
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  // --- Views ---

  const SiteView = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
      <div className="min-h-screen bg-[var(--color-dark-surface)] selection:bg-gold selection:text-black">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>

        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}
          aria-label="Navegação principal"
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              < Scissors className="text-gold w-8 h-8" />
              <span className="font-display font-black text-xl tracking-tighter uppercase italic">
                Corte <span className="text-gold">Nobre</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-display text-sm font-semibold uppercase tracking-widest text-white">
              {["Sobre", "Serviços", "Diferenciais", "Depoimentos"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMenu}
                  className="hover:text-gold transition-colors"
                >
                  {item}
                </a>
              ))}
              <a 
                href={WHATSAPP_LINK}
                target="_blank" 
                rel="noreferrer"
                className="bg-gold text-black px-6 py-2.5 rounded-none hover:bg-gold-light transition-all transform hover:-translate-y-0.5 active:scale-95 font-bold"
              >
                Agendar Agora
              </a>
              <button onClick={goToAdmin} className="ml-4 text-white/40 hover:text-gold transition-colors" aria-label="Abrir painel administrativo">
                <Lock className="w-4 h-4" />
              </button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menu"
            >
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
              className="fixed inset-0 z-[60] bg-black p-8 flex flex-col items-center justify-center gap-8 text-white"
              id="mobile-menu"
            >
              <button className="absolute top-8 right-8" onClick={closeMenu} aria-label="Fechar menu">
                <X className="w-10 h-10 text-gold" />
              </button>
              {["Sobre", "Serviços", "Diferenciais", "Depoimentos"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={closeMenu}
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
              <button onClick={() => { goToAdmin(); closeMenu(); }} className="text-white/40 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Área Administrativa
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section id="conteudo" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000" 
              alt="Interior de barbearia premium com iluminação acolhedora" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
              fetchPriority="high"
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
              <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter leading-none mb-8 italic">
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
        <section id="sobre" className="py-24 px-6 max-w-7xl mx-auto text-white">
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
                alt="Equipe da barbearia com visual elegante e postura profissional" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl skew-y-1"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
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
                  Nossos barbeiros não apenas cortam fios, eles esculpem imagens. Entendemos que seu visual é seu cartão de visitas, e por isso dedicamos o tempo necessário para que cada visita seja perfeita.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="serviços" className="py-24 bg-black/40 text-white">
          <div className="max-w-7xl mx-auto px-6 font-display">
            <SectionTitle subtitle="Menu Premium">Serviços & Preços</SectionTitle>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
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
                    <h3 className="text-xl font-display font-bold uppercase tracking-wide group-hover:text-gold transition-colors italic">
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
        <section id="diferenciais" className="py-24 px-6 max-w-7xl mx-auto text-white">
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
        <section id="depoimentos" className="py-24 bg-black/40 text-white">
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

        {/* Footer */}
        <footer className="bg-black py-20 px-6 border-t border-white/5 text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
            <div>
              <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                < Scissors className="text-gold w-8 h-8" />
                <span className="font-display font-black text-2xl tracking-tighter uppercase italic">
                  Corte <span className="text-gold">Nobre</span>
                </span>
              </div>
              <p className="text-gray-500 mb-8 leading-relaxed font-sans">
                Site institucional premium para barbearia com foco em agendamento por WhatsApp.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://www.instagram.com/cortenobrebarbearia/" target="_blank" rel="noreferrer" aria-label="Instagram da Corte Nobre" className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all rounded-full"><Instagram className="w-5 h-5" /></a>
                <a href="https://www.facebook.com/cortenobrebarbearia/" target="_blank" rel="noreferrer" aria-label="Facebook da Corte Nobre" className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all rounded-full"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-display font-bold uppercase tracking-widest text-lg mb-8 border-b border-gold w-fit mx-auto md:mx-0 pb-2 italic">Contato</h4>
              <div className="flex items-start gap-4 text-gray-400 justify-center md:justify-start font-sans">
                <MapPin className="w-6 h-6 text-gold flex-shrink-0" />
                <span>Rua dos Nobres, 123 - Centro <br/> São Paulo - SP</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400 justify-center md:justify-start font-sans">
                <Phone className="w-6 h-6 text-gold flex-shrink-0" />
                <span>(11) 99999-8888</span>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold uppercase tracking-widest text-lg mb-8 border-b border-gold w-fit mx-auto md:mx-0 pb-2 italic">Links</h4>
              <ul className="space-y-4 font-display text-sm uppercase tracking-widest text-gray-500">
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#serviços" className="hover:text-white transition-colors">Nossos Serviços</a></li>
                <li><a href={WHATSAPP_LINK} className="hover:text-white transition-colors">Agendar Horário</a></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 text-xs uppercase tracking-widest">
            <p>© 2026 Corte Nobre Barbearia. Todos os direitos reservados.</p>
            <p>Portfólio freelancer premium</p>
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
  };

  const LoginView = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[var(--color-dark-card)] p-10 border border-gold/20 shadow-2xl"
      >
        <div className="text-center mb-10">
          < Scissors className="text-gold w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-black uppercase tracking-tighter italic text-white">
            Painel <span className="text-gold">Admin</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">Acesso Restrito</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 border border-gold/20 bg-gold/10 p-4 text-sm leading-relaxed text-gold-light">
            {LOGIN_NOTICE}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">E-mail</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 px-12 py-4 text-white focus:border-gold outline-none transition-all font-sans"
                placeholder="admin@cortenobre.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gold mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 px-12 py-4 text-white focus:border-gold outline-none transition-all font-sans"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {authError && <p className="text-red-500 text-xs font-bold uppercase">{authError}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-black py-4 font-display font-black uppercase tracking-widest hover:bg-gold-light transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Entrando...' : isSupabaseConfigured ? 'Entrar no Sistema' : 'Modo demonstração'}
          </button>
        </form>

        <button 
          onClick={goToSite}
          className="w-full mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
        >
          Voltar para o site
        </button>
      </motion.div>
    </div>
  );

  const AdminView = () => (
    <div className="min-h-screen bg-[var(--color-dark-surface)] text-white font-sans">
      {/* Admin Nav */}
      <nav className="bg-black border-b border-white/5 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <Scissors className="text-gold w-6 h-6" />
             <h1 className="font-display font-black uppercase tracking-tighter italic text-xl">
               Dashboard <span className="text-gold">Nobre</span>
             </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-500">{user?.email}</span>
            <button onClick={handleLogout} className="text-white hover:text-gold transition-colors flex items-center gap-2 text-xs font-bold uppercase">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Gerenciar Serviços</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs mt-1">Controle de preços e catálogo</p>
          </div>
          <button 
            onClick={goToSite}
            className="flex items-center gap-2 text-gold border border-gold/30 px-4 py-2 hover:bg-gold hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
          >
            <ExternalLink className="w-4 h-4" /> Ver Site
          </button>
        </div>

        {/* New Service Form */}
        <div className="bg-[var(--color-dark-card)] p-8 border border-white/5 mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adicionar Novo Serviço
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <input 
              placeholder="Nome (Ex: Corte Social)" 
              value={newService.name}
              onChange={e => setNewService({...newService, name: e.target.value})}
              className="bg-black border border-white/10 p-4 outline-none focus:border-gold transition-all"
            />
            <input 
              placeholder="Preço (Ex: R$ 50)" 
              value={newService.price}
              onChange={e => setNewService({...newService, price: e.target.value})}
              className="bg-black border border-white/10 p-4 outline-none focus:border-gold transition-all"
            />
            <button 
              onClick={addService}
              className="bg-gold text-black font-bold uppercase tracking-widest hover:bg-gold-light transition-all h-full"
            >
              Adicionar
            </button>
            <div className="md:col-span-3">
               <textarea 
                placeholder="Descrição rápida do serviço..." 
                value={newService.desc}
                onChange={e => setNewService({...newService, desc: e.target.value})}
                className="w-full bg-black border border-white/10 p-4 outline-none focus:border-gold transition-all h-24"
              />
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-[var(--color-dark-card)] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/50 text-xs font-bold uppercase tracking-widest text-gold border-b border-white/5">
              <tr>
                <th className="p-6">Serviço</th>
                <th className="p-6">Preço</th>
                <th className="p-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    {editingService?.id === service.id ? (
                      <input 
                        value={editingService.name} 
                        onChange={e => setEditingService({...editingService, name: e.target.value})}
                        className="bg-black border border-gold/50 p-2 w-full outline-none"
                      />
                    ) : (
                      <div>
                        <p className="font-bold uppercase tracking-wide text-white italic">{service.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
                      </div>
                    )}
                  </td>
                  <td className="p-6">
                    {editingService?.id === service.id ? (
                      <input 
                        value={editingService.price} 
                        onChange={e => setEditingService({...editingService, price: e.target.value})}
                        className="bg-black border border-gold/50 p-2 w-full outline-none"
                      />
                    ) : (
                      <span className="text-gold font-bold">{service.price}</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      {editingService?.id === service.id ? (
                        <button 
                          onClick={() => updateService(service.id)}
                          className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => setEditingService(service)}
                          className="p-2 bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteService(service.id)}
                        className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="p-20 text-center text-gray-500 uppercase tracking-widest text-sm">
              Nenhum serviço cadastrado.
            </div>
          )}
        </div>
      </main>
    </div>
  );

  return (
    <>
      {view === 'site' && <SiteView />}
      {view === 'login' && <LoginView />}
      {view === 'admin' && <AdminView />}
    </>
  );
}

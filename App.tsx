import React, { useState, useEffect, useRef } from 'react';
import ImageAnalyzer from './components/ImageAnalyzer';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal';
import { User } from './types';
import { 
  SparklesIcon, CheckCircleIcon, ChevronDownIcon, LightBulbIcon, ShieldCheckIcon, 
  GlobeIcon, CubeIcon, TruckIcon, BrushIcon, TagIcon, UserIcon, LogOutIcon, 
  MagnifyingGlassIcon, WhatsAppIcon, DownloadIcon, FileTextIcon, StarIcon, BriefcaseIcon,
  SendIcon
} from './components/Icons';

// --- Sub-components ---

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">{question}</span>
        <div className={`p-1 rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 ${isOpen ? 'rotate-180 bg-blue-500/20 border-blue-500/50' : ''}`}>
           <ChevronDownIcon className="h-5 w-5 text-slate-300 group-hover:text-blue-200" />
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-400 leading-relaxed pr-8">{answer}</p>
      </div>
    </div>
  );
};

const BeforeAfterCard = ({ before, after, title, description }: { before: string, after: string, title: string, description: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
      setSliderPosition(percent);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-colors">
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
             <BrushIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-none">{title}</h3>
            <p className="text-slate-400 text-xs mt-1">{description}</p>
          </div>
       </div>
       
       <div 
         ref={containerRef}
         className="relative w-full h-64 rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-xl"
         onMouseMove={handleMouseMove}
         onTouchMove={handleTouchMove}
       >
         {/* After Image (Background) */}
         <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
         <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 tracking-wider">AFTER</div>

         {/* Before Image (Clipped) */}
         <div 
           className="absolute inset-0 overflow-hidden border-r border-white/20" 
           style={{ width: `${sliderPosition}%` }}
         >
           <img 
             src={before} 
             alt="Before" 
             className="absolute top-0 left-0 h-full max-w-none object-cover" 
             style={{ width: containerWidth || '100%' }} 
           />
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute top-3 left-3 bg-slate-800/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10 tracking-wider">BEFORE</div>
         </div>

         {/* Slider Handle */}
         <div 
           className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center pointer-events-none"
           style={{ left: `${sliderPosition}%` }}
         >
            <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center transform -translate-x-1/2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" className="rotate-90 origin-center" />
               </svg>
            </div>
         </div>
       </div>
       
       <div className="mt-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Drag slider to compare</p>
       </div>
    </div>
  )
}

// --- Main Component ---

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCatalogueFilter, setActiveCatalogueFilter] = useState("PPE");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [rotatingTextIndex, setRotatingTextIndex] = useState(0);
  
  // Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState<{status: string, message: string, step: number} | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Sourcing Form State
  const [sourcingForm, setSourcingForm] = useState({ item: '', qty: '', urgency: '', location: '' });

  // Rotating Tagline
  const taglines = ["We Source It.", "We Brand It.", "We Deliver It.", "Simayne Trading — Done Right."];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingTextIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for existing session in both localStorage and sessionStorage
    const storedUser = localStorage.getItem('simayne_user') || sessionStorage.getItem('simayne_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('simayne_user');
        sessionStorage.removeItem('simayne_user');
      }
    }
  }, []);

  const handleLogin = (newUser: User, rememberMe: boolean = false) => {
    setUser(newUser);
    if (rememberMe) {
        localStorage.setItem('simayne_user', JSON.stringify(newUser));
    } else {
        sessionStorage.setItem('simayne_user', JSON.stringify(newUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('simayne_user');
    sessionStorage.removeItem('simayne_user');
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const openWhatsApp = (msg: string) => {
    const phone = "27123456789"; // Replace with real number
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    setIsTracking(true);
    setTrackingResult(null);

    // Mock API simulation
    setTimeout(() => {
      setIsTracking(false);
      const id = trackId.toUpperCase();
      
      if (id.startsWith('SIM')) {
        setTrackingResult({
          status: 'In Transit',
          message: 'Your order is currently moving through our regional sorting hub.',
          step: 2
        });
      } else if (id.startsWith('DEL')) {
        setTrackingResult({
          status: 'Delivered',
          message: 'Package was successfully delivered and signed for.',
          step: 3
        });
      } else {
        setTrackingResult({
          status: 'Order Not Found',
          message: 'We could not locate this order ID. Please check the number and try again.',
          step: 0
        });
      }
    }, 1500);
  };

  const faqs = [
    { 
      question: "What types of products can Simayne Trading source?", 
      answer: "We source almost anything! From household essentials and bulk beverages to specialized packaging, FMCG, and general trade supplies. If you need it, we find it." 
    },
    { 
      question: "Do you offer custom branding services?", 
      answer: "Yes, we specialize in custom branding including engraved glassware, merchandise printing, and packaging customization for events, businesses, or retail." 
    },
    { 
      question: "Can I order in bulk for my business?", 
      answer: "Absolutely. We are B2B specialists capable of handling large wholesale orders, tenders, and supply contracts for hospitality, retail, and corporate clients." 
    }
  ];

  const categories = ["All", "Procurement & Supply", "Custom Branding", "Strategic Sourcing"];

  const services = [
    { 
      category: "Procurement & Supply", 
      title: "Bulk Beverages", 
      desc: "Supply of soft drinks, water, and juices for events, retail, and hospitality.",
      icon: <CubeIcon className="h-6 w-6" />
    },
    { 
      category: "Procurement & Supply", 
      title: "FMCG Distribution", 
      desc: "Reliable sourcing of fast-moving consumer goods and household essentials.",
      icon: <TruckIcon className="h-6 w-6" />
    },
    { 
      category: "Custom Branding", 
      title: "Engraved Glassware", 
      desc: "Premium custom engraving on glasses for gifts, events, or corporate branding.",
      icon: <BrushIcon className="h-6 w-6" />
    },
    { 
      category: "Strategic Sourcing", 
      title: "Hard-to-find Stock", 
      desc: "Specialized sourcing for rare or out-of-stock items using our network.",
      icon: <GlobeIcon className="h-6 w-6" />
    },
    { 
      category: "Strategic Sourcing", 
      title: "Tender Supply", 
      desc: "Professional procurement support for government and private tenders.",
      icon: <CheckCircleIcon className="h-6 w-6" />
    }
  ];

  const catalogueData = {
    "PPE": [
      { name: "Safety Helmets", img: "⛑️", desc: "Industrial grade hard hats, various colors." },
      { name: "Reflective Vests", img: "🦺", desc: "High-visibility vests with custom logo options." },
      { name: "Safety Boots", img: "🥾", desc: "Steel-toe cap boots for heavy duty work." },
    ],
    "Cleaning": [
      { name: "Industrial Sanitizer", img: "🧴", desc: "25L Bulk Sanitizer 70% Alcohol." },
      { name: "Paper Towels", img: "🧻", desc: "Bulk packs for office and industrial use." },
      { name: "Cleaning Chems", img: "🧪", desc: "Strong degreasers and multi-purpose cleaners." },
    ],
    "Branding": [
      { name: "Custom Glassware", img: "🥂", desc: "Laser engraved wine & whiskey glasses." },
      { name: "Branded T-Shirts", img: "👕", desc: "Screen printed corporate apparel." },
      { name: "Custom Caps", img: "🧢", desc: "Embroidered caps with your company logo." },
    ],
    "Beverages": [
      { name: "Bottled Water", img: "💧", desc: "Branded or unbranded bulk water supply." },
      { name: "Soft Drinks", img: "🥤", desc: "Wholesale crates of popular soft drinks." },
    ]
  };

  const filteredServices = activeCategory === "All" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#home" className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 relative">
                 <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                 <div className="relative h-full w-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-xl">
                    <SparklesIcon className="h-5 w-5 text-blue-400" />
                 </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">Simayne Trading</span>
            </a>
            
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-1">
                <a href="#home" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Home</a>
                <a href="#catalogue" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Catalogue</a>
                <a href="#services" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Services</a>
                <a href="#track" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Track</a>
                <a href="#vision" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">AI Tools</a>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">About</a>
                
                {/* User Auth Section */}
                {user ? (
                   <div className="flex items-center gap-4 pl-4 ml-2 border-l border-white/10">
                      <div className="flex items-center gap-2">
                         <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                           {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                         </div>
                         <span className="text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        title="Sign Out"
                      >
                         <LogOutIcon className="h-5 w-5" />
                      </button>
                   </div>
                ) : (
                  <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                    <button 
                      onClick={() => openAuth('login')}
                      className="text-slate-300 hover:text-white text-sm font-medium transition-colors hover:bg-white/5 px-3 py-2 rounded-lg"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => openAuth('signup')}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#catalogue" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Catalogue</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Services</a>
              <a href="#track" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Track Order</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
              
              <div className="border-t border-slate-800 mt-4 pt-4 pb-2">
                 {user ? (
                   <div className="px-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                             {user.name[0]}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                      </div>
                      <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm">Sign Out</button>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3 px-3">
                       <button 
                         onClick={() => { openAuth('login'); setMobileMenuOpen(false); }}
                         className="text-center py-2.5 text-slate-300 font-medium hover:bg-white/5 rounded-xl border border-white/10"
                       >
                         Log In
                       </button>
                       <button 
                         onClick={() => { openAuth('signup'); setMobileMenuOpen(false); }}
                         className="text-center py-2.5 bg-blue-600 text-white font-bold hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20"
                       >
                         Sign Up
                       </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={handleLogin}
        initialView={authMode}
      />

      {/* Hero Section */}
      <div id="home" className="relative pt-40 pb-20 sm:pt-48 sm:pb-32 overflow-hidden z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-8 backdrop-blur-md shadow-lg shadow-blue-900/20 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            Simayne Trading (Pty) Ltd
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight h-[1.2em]">
            <span key={rotatingTextIndex} className="block text-white drop-shadow-xl animate-fade-in">
              {taglines[rotatingTextIndex]}
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            Your reliable partner in multi-service procurement and supply. 
            From household essentials and bulk beverages to custom glass design and branded merchandise.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
             <button onClick={() => openWhatsApp("Hi, I would like to request stock availability.")} className="px-8 py-4 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#128C7E] transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2">
               <WhatsAppIcon className="w-5 h-5" />
               Request Stock
             </button>
             <a href="#catalogue" className="px-8 py-4 bg-slate-900/50 text-white border border-slate-700 hover:border-blue-500/50 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 backdrop-blur-md">
               View Catalogue
             </a>
          </div>

          {/* Live Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10">
              <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">876+</div>
                  <div className="text-sm text-slate-500">Items Supplied</div>
              </div>
              <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">22+</div>
                  <div className="text-sm text-slate-500">Businesses Served</div>
              </div>
              <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400 mb-1">14+</div>
                  <div className="text-sm text-slate-500">Branding Projects</div>
              </div>
              <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">100%</div>
                  <div className="text-sm text-slate-500">On-Time Delivery</div>
              </div>
          </div>
        </div>
      </div>

      {/* Product Catalogue */}
      <section id="catalogue" className="py-24 relative bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Product Catalogue</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Browse our most popular categories. Don't see what you need? Use the "We Can Source It" form below.</p>
           </div>

           {/* Tabs */}
           <div className="flex flex-wrap justify-center gap-2 mb-12">
               {Object.keys(catalogueData).map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setActiveCatalogueFilter(cat)}
                     className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCatalogueFilter === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                   >
                     {cat}
                   </button>
               ))}
           </div>

           {/* Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogueData[activeCatalogueFilter as keyof typeof catalogueData].map((item, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div className="text-6xl mb-6 text-center">{item.img}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-slate-400 text-sm mb-6">{item.desc}</p>
                      <button 
                        onClick={() => openWhatsApp(`Hi, I am interested in a quote for: ${item.name}`)}
                        className="w-full py-3 bg-slate-800 hover:bg-[#25D366] hover:text-white text-slate-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                         <WhatsAppIcon className="w-4 h-4" />
                         Request Quote
                      </button>
                  </div>
              ))}
           </div>
        </div>
      </section>

      {/* We Can Source It Form */}
      <section id="sourcing" className="py-24 relative">
          <div className="max-w-4xl mx-auto px-4">
              <div className="glass-panel rounded-[2.5rem] p-8 md:p-16 border border-blue-500/20 shadow-2xl shadow-blue-900/20 bg-gradient-to-br from-slate-900 to-slate-950">
                  <div className="text-center mb-10">
                      <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl mb-4">
                         <GlobeIcon className="w-8 h-8 text-blue-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">We Can Source It</h2>
                      <p className="text-slate-400">Can't find what you're looking for? Tell us what you need, and we'll find it for you.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Item Needed</label>
                          <input 
                            type="text" 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                            placeholder="e.g. 500x Branded Notebooks"
                            value={sourcingForm.item}
                            onChange={(e) => setSourcingForm({...sourcingForm, item: e.target.value})}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</label>
                          <input 
                             type="text" 
                             className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                             placeholder="e.g. 500 units"
                             value={sourcingForm.qty}
                             onChange={(e) => setSourcingForm({...sourcingForm, qty: e.target.value})}
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgency</label>
                          <select 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={sourcingForm.urgency}
                            onChange={(e) => setSourcingForm({...sourcingForm, urgency: e.target.value})}
                          >
                             <option value="">Select Urgency</option>
                             <option value="Standard">Standard (5-7 days)</option>
                             <option value="Urgent">Urgent (2-3 days)</option>
                             <option value="Immediate">Immediate (24hrs)</option>
                          </select>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Location</label>
                          <input 
                             type="text" 
                             className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                             placeholder="City / Area"
                             value={sourcingForm.location}
                             onChange={(e) => setSourcingForm({...sourcingForm, location: e.target.value})}
                          />
                      </div>
                  </div>
                  <button 
                    onClick={() => openWhatsApp(`Sourcing Request:\nItem: ${sourcingForm.item}\nQty: ${sourcingForm.qty}\nUrgency: ${sourcingForm.urgency}\nLocation: ${sourcingForm.location}`)}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                     <SendIcon className="w-5 h-5" />
                     Send Request via WhatsApp
                  </button>
              </div>
          </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Our Capabilities</h2>
                    <p className="text-slate-400">Comprehensive services tailored to your business.</p>
                 </div>
                 <div className="flex gap-2 mt-4 md:mt-0">
                    {categories.map((category) => (
                        <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                            activeCategory === category 
                            ? 'bg-white text-slate-900' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        >
                        {category}
                        </button>
                    ))}
                 </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-16">
               {filteredServices.map((service, i) => (
                 <div key={i} className="group relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:bg-slate-800/60 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="relative z-10">
                      <div className="h-12 w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 text-blue-400 group-hover:text-blue-300">
                        {service.icon}
                      </div>
                      <div className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">{service.category}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-slate-400 leading-relaxed text-sm">{service.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Before & After Branding Showcase */}
            <div className="mt-20">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-2">Branding Transformations</h2>
                  <p className="text-slate-400">See how we elevate standard products into premium branded assets.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <BeforeAfterCard 
                    title="Custom Glassware"
                    description="From simple clear glass to premium laser-engraved branding."
                    before="https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80"
                    after="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80"
                  />
                  <BeforeAfterCard 
                    title="Corporate Gifting"
                    description="Standard packaging vs customized corporate gift boxes."
                    before="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=600&q=80"
                    after="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
                  />
                  <BeforeAfterCard 
                    title="Apparel Branding"
                    description="Turning plain blanks into branded staff uniforms."
                    before="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80"
                    after="https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=600&q=80"
                  />
               </div>
            </div>
          </div>
      </section>

      {/* Pricing Estimates */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-white text-center mb-12">Price Estimates</h2>
           <div className="glass-panel overflow-hidden rounded-3xl">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                       <th className="p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Category</th>
                       <th className="p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Estimated Price</th>
                       <th className="p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <tr>
                       <td className="p-6 text-white font-medium">Custom Branded Glasses</td>
                       <td className="p-6 text-slate-400">R70 – R120 per unit</td>
                       <td className="p-6"><button onClick={() => openWhatsApp("Quote for Custom Glasses")} className="text-blue-400 hover:text-blue-300 text-sm font-bold">Get Quote →</button></td>
                    </tr>
                    <tr>
                       <td className="p-6 text-white font-medium">PPE Bulk Orders</td>
                       <td className="p-6 text-slate-400">Volume Based Discounts</td>
                       <td className="p-6"><button onClick={() => openWhatsApp("Quote for PPE")} className="text-blue-400 hover:text-blue-300 text-sm font-bold">Get Quote →</button></td>
                    </tr>
                    <tr>
                       <td className="p-6 text-white font-medium">Beverage Labeling</td>
                       <td className="p-6 text-slate-400">Custom (Design Dependent)</td>
                       <td className="p-6"><button onClick={() => openWhatsApp("Quote for Beverage Labeling")} className="text-blue-400 hover:text-blue-300 text-sm font-bold">Get Quote →</button></td>
                    </tr>
                    <tr>
                       <td className="p-6 text-white font-medium">Household Wholesale</td>
                       <td className="p-6 text-slate-400">Wholesale Pricing</td>
                       <td className="p-6"><button onClick={() => openWhatsApp("Quote for Household Wholesale")} className="text-blue-400 hover:text-blue-300 text-sm font-bold">Get Quote →</button></td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* Reviews Wall */}
      <section className="py-24 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted by Businesses</h2>
            <div className="flex justify-center gap-1">
               {[1,2,3,4,5].map(s => <StarIcon key={s} className="w-5 h-5 text-yellow-500" />)}
            </div>
         </div>
         
         <div className="flex gap-6 overflow-x-auto pb-8 px-4 snap-x mx-auto max-w-7xl scrollbar-hide">
            {[
              { name: "Thabo M.", role: "Event Organizer", text: "Sourced 200 custom glasses for our wedding. Delivered on time and looked amazing!" },
              { name: "Sarah L.", role: "Restaurant Owner", text: "Best supplier for bulk beverages. Good prices and they actually deliver when they say they will." },
              { name: "Sipho K.", role: "Construction Manager", text: "We get all our PPE from Simayne now. The quality of the safety boots is top tier." },
              { name: "James D.", role: "Small Business", text: "Helped me brand my first batch of sauces. They made the process so easy." }
            ].map((review, i) => (
               <div key={i} className="min-w-[300px] bg-slate-900 border border-white/5 p-6 rounded-2xl snap-center">
                  <p className="text-slate-300 italic mb-4">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">{review.name[0]}</div>
                     <div>
                        <div className="text-white font-bold text-sm">{review.name}</div>
                        <div className="text-slate-500 text-xs">{review.role}</div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-900/50">
         <div className="max-w-3xl mx-auto px-4">
             <h2 className="text-3xl font-bold text-white text-center mb-16">Our Journey</h2>
             <div className="relative border-l-2 border-slate-800 ml-4 md:ml-0 md:pl-0 space-y-12">
                 {[
                   { year: "2024", title: "Started Sourcing", desc: "Began as a small sourcing side hustle finding hard-to-get items." },
                   { year: "2025", title: "Expansion", desc: "Expanded into custom branding, white-labeling, and wholesale supply." },
                   { year: "2026", title: "National Supply", desc: "Vision to supply businesses nationwide with a fully integrated logistics network." }
                 ].map((item, i) => (
                    <div key={i} className="relative pl-8 md:pl-12">
                       <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900 shadow-lg shadow-blue-500/50"></div>
                       <div className="text-blue-400 font-bold mb-1">{item.year}</div>
                       <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                       <p className="text-slate-400">{item.desc}</p>
                    </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Downloads Section */}
      <section className="py-24">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Company Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {["Company Profile", "BBBEE Certificate", "Tax Clearance", "Bank Letter"].map((doc, i) => (
                  <button key={i} className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-white/5 hover:border-blue-500 rounded-2xl transition-all group">
                     <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <FileTextIcon className="w-6 h-6 text-slate-400 group-hover:text-white" />
                     </div>
                     <span className="text-sm font-medium text-slate-300 group-hover:text-white mb-2">{doc}</span>
                     <span className="text-xs text-slate-500 flex items-center gap-1">
                        <DownloadIcon className="w-3 h-3" /> PDF
                     </span>
                  </button>
               ))}
            </div>
         </div>
      </section>

      {/* Track Order Section */}
      <section id="track" className="relative py-16 z-10 bg-slate-900/30 border-y border-white/5">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Track Your Shipment</h2>
                <p className="text-slate-400">Enter your order ID below to check the current status of your delivery.</p>
              </div>

              <form onSubmit={handleTrackOrder} className="max-w-md mx-auto relative mb-12">
                 <div className="relative">
                   <input 
                     type="text" 
                     value={trackId}
                     onChange={(e) => setTrackId(e.target.value)}
                     placeholder="e.g. SIM-123456" 
                     className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center placeholder-slate-500 tracking-wider"
                   />
                   <button 
                     type="submit"
                     disabled={isTracking}
                     className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isTracking ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     ) : (
                       <MagnifyingGlassIcon className="h-5 w-5" />
                     )}
                   </button>
                 </div>
              </form>

              {trackingResult && (
                <div className="animate-fade-in">
                   {trackingResult.step > 0 ? (
                      <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                         <div className="flex items-center justify-between mb-8 relative">
                            {/* Progress Bar Line */}
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-700 -z-10"></div>
                            <div className={`absolute left-0 top-1/2 h-0.5 bg-blue-500 -z-10 transition-all duration-1000`} style={{ width: `${((trackingResult.step - 1) / 2) * 100}%` }}></div>

                            {/* Steps */}
                            {['Processing', 'In Transit', 'Delivered'].map((label, idx) => {
                               const stepNum = idx + 1;
                               const isActive = trackingResult.step >= stepNum;
                               return (
                                 <div key={label} className="flex flex-col items-center gap-2 bg-slate-900 px-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                       {isActive ? <CheckCircleIcon className="w-5 h-5" /> : <span className="text-xs">{stepNum}</span>}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-blue-300' : 'text-slate-500'}`}>{label}</span>
                                 </div>
                               )
                            })}
                         </div>
                         <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-1">{trackingResult.status}</h3>
                            <p className="text-slate-400 text-sm">{trackingResult.message}</p>
                         </div>
                      </div>
                   ) : (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                         <p className="text-red-300 font-medium">{trackingResult.status}</p>
                         <p className="text-red-400/70 text-sm mt-1">{trackingResult.message}</p>
                      </div>
                   )}
                </div>
              )}
            </div>
         </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative py-24 z-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                     {/* Abstract shape representing creativity */}
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
                    <div className="relative glass-panel rounded-3xl p-8 border border-white/10">
                        <h2 className="text-3xl font-bold mb-6 text-white">About Simayne Trading</h2>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                <strong>Simayne Trading (Pty) Ltd</strong> is a growing multi-service procurement and supply company driven by innovation, quality, and efficiency. 
                                We specialize in understanding our customers' needs and responding with practical solutions.
                            </p>
                            <p>
                                Whether you require household essentials, specialized packaging, branded merchandise, or bulk beverages, we source it reliably and deliver with professionalism.
                                We also maintain an entrepreneurial spirit by supporting small manufacturers and exploring white-label opportunities.
                            </p>
                            <p>
                                Beyond supply, we create. From our own brand 
                                <a href="https://kasilyfstyle.com" className="text-blue-400 hover:text-blue-300 mx-1 font-medium">kasilyfstyle.com</a> 
                                to custom engraved glassware and branded merch, we bring ideas to life.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative h-full flex flex-col justify-center space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-500 transform transition hover:translate-x-2">
                        <h3 className="text-xl font-bold text-white mb-2">Our Vision</h3>
                        <p className="text-slate-400">To become a trusted supplier and procurement partner known for reliability, fast response time, and the ability to source almost anything.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-indigo-500 transform transition hover:translate-x-2">
                         <h3 className="text-xl font-bold text-white mb-2">Flexible & Fast</h3>
                         <p className="text-slate-400">We think quick and act quick. From individual custom orders to large-scale business procurement, we scale to meet your needs.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h4 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Our Supply Partners</h4>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center gap-2">
                     <BriefcaseIcon className="w-8 h-8 text-white" />
                     <span className="text-xl font-bold text-white">PARTNER {i}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 z-10">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
               <p className="text-slate-400">Everything you need to know about our sourcing, branding, and supply services.</p>
            </div>
            
            <div className="glass-panel rounded-3xl p-2 md:p-8">
               {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
               ))}
            </div>
         </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="relative py-24 z-10">
         <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10"></div>
         <ImageAnalyzer />
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-blue-500" />
                <span className="text-2xl font-bold text-white">Simayne</span>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Empowering businesses and consumers with top-tier procurement, branding, and supply solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Product Sourcing</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Custom Branding</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Bulk Supply</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><a href="https://kasilyfstyle.com" className="hover:text-blue-400 transition-colors">KasiLyf Style</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Business Hours</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex justify-between text-sm"><span className="text-slate-500">Mon-Fri</span> <span>08:00 - 17:00</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-500">Sat</span> <span>09:00 - 13:00</span></li>
                <li className="flex justify-between text-sm"><span className="text-slate-500">Sun</span> <span>Closed</span></li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/5">
                <button onClick={() => openWhatsApp("Hi, I would like to contact Simayne Trading.")} className="group flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Contact Us 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} Simayne Trading (Pty) Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chat */}
      <ChatWidget user={user} />
    </div>
  );
};

export default App;
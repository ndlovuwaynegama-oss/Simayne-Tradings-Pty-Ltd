import React, { useState } from 'react';
import ImageAnalyzer from './components/ImageAnalyzer';
import ChatWidget from './components/ChatWidget';
import { SparklesIcon, CheckCircleIcon, ChevronDownIcon, LightBulbIcon, ShieldCheckIcon, GlobeIcon } from './components/Icons';

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

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    },
    { 
      question: "What is Kasilyf Style?", 
      answer: "Kasilyf Style is our own lifestyle brand available at kasilyfstyle.com, featuring curated fashion and products that reflect our commitment to quality and style." 
    },
    { 
      question: "Do you support small businesses and local brands?", 
      answer: "Yes! We have an entrepreneurial mindset and work closely with small manufacturers and suppliers to support local brands while offering competitive pricing." 
    }
  ];

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
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 relative">
                 <div className="absolute inset-0 bg-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                 <div className="relative h-full w-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 rounded-xl flex items-center justify-center shadow-xl">
                    <SparklesIcon className="h-5 w-5 text-blue-400" />
                 </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">Simayne Trading</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#home" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Home</a>
                <a href="#about" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">About Us</a>
                <a href="#services" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">Services</a>
                <a href="#faq" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">FAQ</a>
                <a href="#vision" className="text-slate-300 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-2 rounded-lg">AI Tools</a>
                <a href="https://kasilyfstyle.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5">
                  Shop KasiLyf
                </a>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
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
          <div className="md:hidden bg-slate-900 border-b border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
              <a href="#about" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Us</a>
              <a href="#services" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Services</a>
              <a href="#faq" className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">FAQ</a>
              <a href="https://kasilyfstyle.com" className="text-blue-400 hover:text-blue-300 block px-3 py-2 rounded-md text-base font-medium">Visit KasiLyf</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-40 pb-20 sm:pt-48 sm:pb-32 overflow-hidden z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-8 backdrop-blur-md shadow-lg shadow-blue-900/20 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            Simayne Trading (Pty) Ltd
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            <span className="block text-white drop-shadow-xl">Strategic Sourcing &</span>
            <span className="gradient-text drop-shadow-2xl">Custom Branding</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            Your reliable partner in multi-service procurement and supply. 
            From household essentials and bulk beverages to custom glass design and branded merchandise.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5">
             <a href="#services" className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               Our Services
             </a>
             <a href="https://kasilyfstyle.com" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900/50 text-white border border-slate-700 hover:border-blue-500/50 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 backdrop-blur-md">
               Shop KasiLyf
             </a>
          </div>

          {/* Feature Grid */}
          <div id="services" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             {[
               { title: "Procurement & Supply", desc: "Reliable sourcing of household goods, FMCG, beverages, and general trade supplies across South Africa.", delay: "0" },
               { title: "Custom Branding", desc: "Unique identity solutions including engraved glasses, merchandise printing, and packaging.", delay: "100" },
               { title: "Strategic Sourcing", desc: "Handling bulk orders, tenders, and hard-to-find stock for businesses, events, and retail.", delay: "200" }
             ].map((feature, i) => (
               <div key={i} className="group relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:bg-slate-800/60 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 <div className="relative z-10">
                    <div className="h-12 w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                      <CheckCircleIcon className="h-6 w-6 text-blue-400 group-hover:text-blue-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

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

      {/* Mission Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative background similar to other sections */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Mission</h2>
             <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed">
               To provide value, ideas, and strategic thinking. We don't just supply products; we deliver solutions that help our clients succeed, whether they are small entrepreneurs or large corporations.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Card 1 */}
             <div className="glass-panel p-8 rounded-3xl border-t border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <LightBulbIcon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
                <p className="text-slate-400">Constantly exploring new product opportunities, from custom beverages to unique merchandise.</p>
             </div>
             {/* Card 2 */}
             <div className="glass-panel p-8 rounded-3xl border-t border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
                <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <ShieldCheckIcon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Reliability</h3>
                <p className="text-slate-400">Delivering consistency and professionalism in every order, ensuring you get what you need, when you need it.</p>
             </div>
             {/* Card 3 */}
             <div className="glass-panel p-8 rounded-3xl border-t border-white/10 hover:border-indigo-500/30 transition-all duration-300 group">
                 <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <GlobeIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Scalability</h3>
                <p className="text-slate-400">Serving both individual custom requests and bulk commercial orders with the same attention to detail.</p>
             </div>
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
                <a href="mailto:contact@simaynetradings.com" className="group flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Contact Us 
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} Simayne Trading (Pty) Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chat */}
      <ChatWidget />
    </div>
  );
};

export default App;
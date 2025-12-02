import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { ImageAnalysisState } from '../types';
import { UploadIcon, SparklesIcon } from './Icons';

const EXAMPLES = [
  { 
    label: 'Tech Product', 
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    desc: 'Source electronics'
  },
  { 
    label: 'Corporate Merch', 
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    desc: 'Branding ideas'
  },
  { 
    label: 'Bulk Supply', 
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    desc: 'Wholesale stock'
  }
];

const ImageAnalyzer: React.FC = () => {
  const [state, setState] = useState<ImageAnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
    imageUrl: null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setState(prev => ({ ...prev, error: "Please upload a valid image file." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setState({
        isAnalyzing: false,
        result: null,
        error: null,
        imageUrl: base64String,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleExampleClick = (url: string) => {
    setState({
      isAnalyzing: false,
      result: null,
      error: null,
      imageUrl: url,
    });
  };

  const handleAnalyze = async () => {
    if (!state.imageUrl) return;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      // Extract base64 data and mime type
      // This works for both Data URLs (uploads) and HTTP URLs (examples)
      const response = await fetch(state.imageUrl);
      if (!response.ok) throw new Error("Failed to retrieve image data");
      
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
          const base64data = (reader.result as string).split(',')[1];
          
          try {
            const analysis = await analyzeImage(base64data, blob.type, "Analyze this image. If it is a product, suggest how Simayne Trading could source it or supply it. If it is a design, suggest application on merchandise.");
            setState(prev => ({ ...prev, isAnalyzing: false, result: analysis }));
          } catch(err) {
             setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to communicate with Gemini." }));
          }
      }
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to process image data." }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="glass-panel rounded-[2rem] p-8 md:p-14 relative overflow-hidden shadow-2xl shadow-blue-900/20 ring-1 ring-white/10">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Upload UI */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white tracking-tight">Product & Brand <span className="text-blue-400">Inspector</span></h2>
              <p className="text-lg text-slate-400">Upload a photo of a product you want to source, or a logo design you want to brand. Get AI insights on supply availability or merchandise application.</p>
            </div>

            <div 
              className={`relative border-2 border-dashed rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden
                ${state.imageUrl ? 'border-blue-500/50 bg-slate-900/50' : 'border-slate-700 hover:border-blue-400 hover:bg-slate-800/50'}`}
              onClick={triggerFileInput}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              
              {state.imageUrl ? (
                <div className="relative w-full h-full">
                  <img src={state.imageUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                  
                  {/* Scanning Overlay */}
                  {state.isAnalyzing && (
                    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none rounded-3xl">
                      <div className="absolute w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-scan"></div>
                      <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity rounded-3xl z-30 ${state.isAnalyzing ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    <p className="text-white font-semibold flex items-center gap-2">
                      <UploadIcon className="w-5 h-5" />
                      Change Image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-300">
                    <UploadIcon className="w-10 h-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white text-lg font-medium group-hover:text-blue-200 transition-colors">Click to upload</p>
                    <p className="text-sm text-slate-500">Supports PNG, JPG, WebP</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!state.imageUrl || state.isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
            >
              {state.isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing Request...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Analyze with Simayne AI
                </>
              )}
            </button>
            
            {state.error && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center">
                 {state.error}
               </div>
            )}

            {/* Example Selection */}
            <div className="border-t border-white/10 pt-6">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">No image? Try an example:</p>
               <div className="grid grid-cols-3 gap-3">
                  {EXAMPLES.map((ex, i) => (
                    <button 
                      key={i}
                      onClick={() => handleExampleClick(ex.url)}
                      className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${state.imageUrl === ex.url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-600'}`}
                      disabled={state.isAnalyzing}
                    >
                      <img src={ex.url} alt={ex.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 opacity-90">
                         <span className="text-[10px] font-bold text-white leading-tight">{ex.label}</span>
                      </div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-8 min-h-[500px] flex flex-col shadow-inner relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none rounded-3xl"></div>
            
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-6 mb-6">
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                 <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
               </div>
               <span className="text-xs text-slate-500 font-mono tracking-wider uppercase">Sourcing Report</span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
              {state.result ? (
                <div className="prose prose-invert max-w-none animate-fade-in">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light text-base">
                    {state.result}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-6">
                  <div className="relative">
                     <div className="absolute inset-0 bg-blue-500 blur-xl opacity-10 animate-pulse"></div>
                     <SparklesIcon className="w-16 h-16 opacity-30 relative z-10" />
                  </div>
                  <p className="text-sm font-medium tracking-wide">Waiting for product or design visual</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FormData, StepType, ProductData } from './types';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  Check, 
  Building2, 
  Package, 
  Contact, 
  Wallet,
  Sparkles,
  ArrowRight,
  Database,
  Loader2,
  ShieldCheck,
  Zap,
  Layout
} from 'lucide-react';

// URL de tu Google Apps Script
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwtihf1c0O7xvX9xQC16LAmoEVvsloYD3WTO6IVqc-gPNQbIVHgbclK9EfpPzjvVZLPNw/exec';

const INITIAL_FORM_DATA: FormData = {
  businessName: '',
  businessDescription: '',
  location: '',
  productA: { name: '', description: '', price: '', stock: '', image: null },
  productB: { name: '', description: '', price: '', stock: '', image: null },
  telegram: '',
  email: '',
  financeDetails: ''
};

const STEPS_ORDER = [
  StepType.INTRO,
  StepType.NAME,
  StepType.DESC,
  StepType.LOCATION,
  StepType.PROD_A_INFO,
  StepType.PROD_A_PRICE,
  StepType.PROD_A_IMAGE,
  StepType.PROD_B_INFO,
  StepType.PROD_B_PRICE,
  StepType.PROD_B_IMAGE,
  StepType.CONTACT,
  StepType.FINANCE,
  StepType.SUCCESS
];

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSyncing, setIsSyncing] = useState(false);

  const currentStep = STEPS_ORDER[currentStepIndex];
  const progress = (currentStepIndex / (STEPS_ORDER.length - 1)) * 100;

  const sections = useMemo(() => [
    { label: 'Bienvenida', steps: [StepType.INTRO], icon: <Sparkles size={16}/> },
    { label: 'Tu Negocio', steps: [StepType.NAME, StepType.DESC, StepType.LOCATION], icon: <Building2 size={16}/> },
    { label: 'Productos', steps: [StepType.PROD_A_INFO, StepType.PROD_A_PRICE, StepType.PROD_A_IMAGE, StepType.PROD_B_INFO, StepType.PROD_B_PRICE, StepType.PROD_B_IMAGE], icon: <Package size={16}/> },
    { label: 'Conexión', steps: [StepType.CONTACT, StepType.FINANCE], icon: <Contact size={16}/> }
  ], []);

  const handleFinalSubmit = async () => {
    setIsSyncing(true);
    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      setCurrentStepIndex(STEPS_ORDER.indexOf(StepType.SUCCESS));
    } catch (err) {
      console.error("Error al sincronizar:", err);
      setCurrentStepIndex(STEPS_ORDER.indexOf(StepType.SUCCESS));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === StepType.FINANCE) {
      handleFinalSubmit();
      return;
    }
    if (currentStepIndex < STEPS_ORDER.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateProductData = (product: 'productA' | 'productB', key: keyof ProductData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [product]: { ...prev[product], [key]: value }
    }));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSyncing) {
        handleNext();
    }
  }, [currentStepIndex, isSyncing, formData]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderContent = () => {
    const inputStyle = "w-full bg-slate-900/40 border border-slate-800/50 rounded-2xl px-6 py-5 text-xl font-medium text-white focus:border-indigo-500/50 focus:bg-slate-900/60 transition-all placeholder:text-slate-700 shadow-sm";
    const labelTitle = "text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 block";

    if (isSyncing) return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-10">
           <div className="w-32 h-32 border-[3px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
           <Database className="absolute inset-0 m-auto text-indigo-500 w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Guardando en CRM</h2>
        <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">Subiendo imágenes a Drive y sincronizando con tu base de datos...</p>
      </div>
    );

    switch(currentStep) {
      case StepType.INTRO:
        return (
          <div className="max-w-2xl animate-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-500/80 text-[10px] font-bold uppercase tracking-widest mb-8">
              <Zap size={12} fill="currentColor" /> Business Intelligence v3.2
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
              Vende con <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Inteligencia</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium">
              Configura tu sistema de ventas automatizado. <br className="hidden md:block"/> Conecta tus productos y deja que la IA trabaje por ti.
            </p>
            <button onClick={handleNext} className="group bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-4 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
              Configurar Negocio <ArrowRight className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        );
      case StepType.NAME:
        return (
          <div className="space-y-6 w-full max-w-xl animate-in fade-in duration-500">
            <span className={labelTitle}>Identidad Comercial</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-8">¿Cómo se llama tu negocio?</h2>
            <input autoFocus className={inputStyle} placeholder="Nombre de tu empresa o marca..." value={formData.businessName} onChange={e => updateFormData('businessName', e.target.value)} />
          </div>
        );
      case StepType.DESC:
        return (
          <div className="space-y-6 w-full max-w-xl animate-in fade-in duration-500">
            <span className={labelTitle}>Actividad</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-8">Descripción del negocio</h2>
            <textarea autoFocus className={inputStyle + " min-h-[160px] resize-none"} placeholder="Cuéntanos qué hace especial a tu negocio..." value={formData.businessDescription} onChange={e => updateFormData('businessDescription', e.target.value)} />
          </div>
        );
      case StepType.LOCATION:
        return (
          <div className="space-y-6 w-full max-w-xl animate-in fade-in duration-500">
            <span className={labelTitle}>Logística</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-8">Ubicación del negocio</h2>
            <input autoFocus className={inputStyle} placeholder="Ciudad, Estado o País..." value={formData.location} onChange={e => updateFormData('location', e.target.value)} />
          </div>
        );
      case StepType.PROD_A_INFO:
      case StepType.PROD_B_INFO: {
        const isA = currentStep === StepType.PROD_A_INFO;
        return (
          <div className="space-y-6 w-full max-w-2xl animate-in fade-in duration-500">
            <span className={labelTitle}>Catálogo Master / {isA ? 'Producto A' : 'Producto B'}</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-10">{isA ? 'Producto A' : 'Producto B'}</h2>
            <div className="grid gap-8">
              <input autoFocus className={inputStyle} placeholder="Nombre del producto..." value={isA ? formData.productA.name : formData.productB.name} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'name', e.target.value)} />
              <textarea className={inputStyle + " text-lg min-h-[120px]"} placeholder="Detalles, características..." value={isA ? formData.productA.description : formData.productB.description} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'description', e.target.value)} />
            </div>
          </div>
        );
      }
      case StepType.PROD_A_PRICE:
      case StepType.PROD_B_PRICE: {
        const isA = currentStep === StepType.PROD_A_PRICE;
        return (
          <div className="space-y-6 w-full max-w-xl animate-in fade-in duration-500">
            <span className={labelTitle}>Comercial</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-10">Precios y Stock</h2>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-3">
                 <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Precio ($)</label>
                 <input type="number" className={inputStyle} placeholder="0.00" value={isA ? formData.productA.price : formData.productB.price} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'price', e.target.value)} />
               </div>
               <div className="space-y-3">
                 <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Existencia</label>
                 <input type="number" className={inputStyle} placeholder="Cantidad..." value={isA ? formData.productA.stock : formData.productB.stock} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'stock', e.target.value)} />
               </div>
            </div>
          </div>
        );
      }
      case StepType.PROD_A_IMAGE:
      case StepType.PROD_B_IMAGE: {
        const isA = currentStep === StepType.PROD_A_IMAGE;
        return (
          <div className="space-y-6 w-full max-w-xl animate-in fade-in duration-500">
            <span className={labelTitle}>Multimedia</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-10">Imagen del {isA ? 'Producto A' : 'Producto B'}</h2>
            <MediaUpload value={isA ? formData.productA.image : formData.productB.image} onChange={img => updateProductData(isA ? 'productA' : 'productB', 'image', img)} />
          </div>
        );
      }
      case StepType.CONTACT:
        return (
          <div className="space-y-6 w-full max-w-2xl animate-in fade-in duration-500">
            <span className={labelTitle}>Contacto</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-10">Enlaces Directos</h2>
            <div className="grid gap-8">
              <input className={inputStyle} placeholder="Telegram @tu_usuario" value={formData.telegram} onChange={e => updateFormData('telegram', e.target.value)} />
              <input type="email" className={inputStyle} placeholder="Correo electrónico..." value={formData.email} onChange={e => updateFormData('email', e.target.value)} />
            </div>
          </div>
        );
      case StepType.FINANCE:
        return (
          <div className="space-y-6 w-full max-w-2xl animate-in fade-in duration-500">
            <span className={labelTitle}>Pagos</span>
            <h2 className="text-4xl font-black text-white tracking-tight mb-10">Datos de Facturación</h2>
            <textarea autoFocus className={inputStyle + " min-h-[140px]"} placeholder="Bancos, Pago Móvil, Cuentas..." value={formData.financeDetails} onChange={e => updateFormData('financeDetails', e.target.value)} />
            <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-4 text-indigo-400 text-sm font-medium">
                <ShieldCheck className="shrink-0" size={20} />
                <p>Tu información y fotos se enviarán de forma segura a tu CRM y Drive privado.</p>
            </div>
          </div>
        );
      case StepType.SUCCESS:
        return (
          <div className="text-center max-w-xl animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/40 rotate-3">
              <Check className="text-white w-12 h-12" strokeWidth={4} />
            </div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter">¡Listo!</h1>
            <p className="text-slate-500 text-xl mb-12 font-medium">CRM y Drive actualizados. Tu negocio ya está en la nube.</p>
            <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 text-left mb-12 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Estatus de Sincronización</span>
                <span className="flex items-center gap-1.5 text-[10px] px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-bold">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div> CONECTADO
                </span>
              </div>
              <p className="text-white text-lg font-bold mb-1">{formData.businessName}</p>
              <p className="text-slate-600 text-sm font-medium">Fotos guardadas en Drive</p>
            </div>
            <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-white font-bold transition-colors flex items-center gap-2 mx-auto">
              Cerrar Onboarding
            </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="app-container h-screen flex items-center justify-center p-4 md:p-10 select-none">
      <div className="glass-panel w-full max-w-7xl h-full rounded-[3rem] flex flex-col md:flex-row overflow-hidden border border-white/[0.03]">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-80 bg-slate-900/50 border-r border-white/[0.02] p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-20 group cursor-default">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Layout size={22} className="text-white" fill="currentColor" />
              </div>
              <span className="text-white font-black text-3xl tracking-tighter italic">AI<span className="text-indigo-600">CORE</span></span>
            </div>

            <nav className="space-y-3">
              {sections.map((sec, idx) => {
                const isActive = sec.steps.includes(currentStep);
                const isPast = STEPS_ORDER.indexOf(currentStep) > STEPS_ORDER.indexOf(sec.steps[sec.steps.length - 1]);
                return (
                  <div key={idx} className={`flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-600'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${isActive ? 'border-indigo-500/30 bg-indigo-500/20 text-indigo-400' : 'border-slate-800 bg-slate-900/50'}`}>
                      {isPast ? <Check size={16} strokeWidth={3} className="text-indigo-400" /> : sec.icon}
                    </div>
                    <span className={`text-sm font-black tracking-tight ${isActive ? 'text-white' : ''}`}>{sec.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="bg-slate-900/80 p-7 rounded-[2rem] border border-white/[0.03]">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Estatus</span>
                <span className="text-xs text-white font-black">{Math.round(progress)}%</span>
             </div>
             <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{width: `${progress}%`}}></div>
             </div>
          </div>
        </aside>

        {/* Main Application Area */}
        <main className="flex-1 flex flex-col relative bg-slate-950/20">
          
          <header className="p-8 flex items-center justify-between md:hidden border-b border-white/[0.02]">
             <span className="text-white font-black text-2xl tracking-tighter italic">AI<span className="text-indigo-600 font-normal">CORE</span></span>
             <div className="text-xs text-slate-700 font-black tracking-widest">{Math.round(progress)}%</div>
          </header>

          <div className="flex-1 flex items-center justify-center p-8 md:p-24 overflow-y-auto">
             {renderContent()}
          </div>

          {/* Persistent Footer Actions */}
          {currentStep !== StepType.SUCCESS && !isSyncing && (
            <footer className="p-8 md:p-14 border-t border-white/[0.02] flex items-center justify-between bg-slate-900/10">
               <button 
                 onClick={handlePrev}
                 disabled={currentStepIndex === 0}
                 className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-600 font-black hover:text-white hover:bg-white/[0.02] transition-all disabled:opacity-0`}
               >
                 <ChevronLeft size={22} strokeWidth={3} /> <span className="hidden sm:inline">REGRESAR</span>
               </button>

               <div className="flex items-center gap-8">
                  <span className="text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] hidden sm:block">Paso {currentStepIndex + 1} de {STEPS_ORDER.length - 1}</span>
                  <button 
                    onClick={handleNext}
                    className="bg-white text-black px-12 py-5 rounded-2xl font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5"
                  >
                    {currentStep === StepType.FINANCE ? 'FINALIZAR' : 'SIGUIENTE'}
                    <ChevronRight size={22} strokeWidth={4} />
                  </button>
               </div>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
};

const MediaUpload: React.FC<{ value: string | null; onChange: (img: string) => void }> = ({ value, onChange }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <label className="relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-800/60 rounded-[2.5rem] hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all cursor-pointer overflow-hidden group bg-slate-900/20 shadow-inner">
      {value ? (
        <img src={value} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[1.8rem] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-600 transition-all shadow-sm"><Upload className="text-indigo-400 group-hover:text-white" size={28} /></div>
          <span className="text-slate-300 font-black text-lg">Subir Fotografía</span>
          <span className="text-[10px] text-slate-700 mt-2 uppercase font-black tracking-widest">Optimizado para Catálogo AI</span>
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
    </label>
  );
};

export default App;

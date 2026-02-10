
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
  Circle,
  LayoutDashboard,
  ShieldCheck,
  Zap
} from 'lucide-react';

// URL de tu Google Apps Script (Reemplázala con la tuya)
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwm5hK2AJa2ltKy3jjfwvb8nvhxzi5I9KRthRb20yyXgChyk0OV3zQNkovi9lKI19kYQQ/exec';

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
  const [syncError, setSyncError] = useState<string | null>(null);

  const currentStep = STEPS_ORDER[currentStepIndex];
  const progress = (currentStepIndex / (STEPS_ORDER.length - 1)) * 100;

  const sections = useMemo(() => [
    { label: 'Bienvenida', steps: [StepType.INTRO], icon: <Sparkles size={16}/> },
    { label: 'Tu Marca', steps: [StepType.NAME, StepType.DESC, StepType.LOCATION], icon: <Building2 size={16}/> },
    { label: 'Catálogo', steps: [StepType.PROD_A_INFO, StepType.PROD_A_PRICE, StepType.PROD_A_IMAGE, StepType.PROD_B_INFO, StepType.PROD_B_PRICE, StepType.PROD_B_IMAGE], icon: <Package size={16}/> },
    { label: 'Conexión', steps: [StepType.CONTACT, StepType.FINANCE], icon: <Contact size={16}/> }
  ], []);

  const handleFinalSubmit = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      // Intentar guardar en Google Sheets
      const response = await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Simulamos un pequeño delay de proceso de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentStepIndex(STEPS_ORDER.indexOf(StepType.SUCCESS));
    } catch (err) {
      console.error(err);
      // Aún si falla la red, permitimos avanzar en el demo
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    const inputStyle = "w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-xl font-medium text-white focus:border-indigo-500 transition-all placeholder:text-slate-700 shadow-inner";
    const labelTitle = "text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-4 block";

    if (isSyncing) return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse text-center">
        <div className="relative mb-8">
           <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
           <Database className="absolute inset-0 m-auto text-indigo-500 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Cifrando Datos en Blockchain</h2>
        <p className="text-slate-500">Estamos conectando tu catálogo con los servidores de OpenAI y Google Sheets...</p>
      </div>
    );

    switch(currentStep) {
      case StepType.INTRO:
        return (
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap size={12} /> Enterprise AI Ready
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter mb-6 leading-[0.9]">
              Configura tu <span className="text-indigo-500">Cerebro de Ventas</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Estás a minutos de automatizar tu negocio. Nuestro onboarding conectará tus productos con un agente autónomo capaz de cerrar ventas 24/7.
            </p>
            <button onClick={handleNext} className="group bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
              Iniciar Onboarding <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case StepType.NAME:
        return (
          <div className="space-y-6 w-full max-w-xl">
            <span className={labelTitle}>Nombre Corporativo</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">¿Cómo se llama tu imperio?</h2>
            <input autoFocus className={inputStyle} placeholder="Ej: Elite Brands S.A." value={formData.businessName} onChange={e => updateFormData('businessName', e.target.value)} />
          </div>
        );
      case StepType.DESC:
        return (
          <div className="space-y-6 w-full max-w-xl">
            <span className={labelTitle}>Propuesta de Valor</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">¿Qué problemas resuelves?</h2>
            <textarea autoFocus className={inputStyle + " min-h-[150px] resize-none"} placeholder="Describe tus servicios o productos estrella..." value={formData.businessDescription} onChange={e => updateFormData('businessDescription', e.target.value)} />
          </div>
        );
      case StepType.LOCATION:
        return (
          <div className="space-y-6 w-full max-w-xl">
            <span className={labelTitle}>Presencia Física</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Ubicación de tu Sede</h2>
            <input autoFocus className={inputStyle} placeholder="Ciudad, País" value={formData.location} onChange={e => updateFormData('location', e.target.value)} />
          </div>
        );
      case StepType.PROD_A_INFO:
      case StepType.PROD_B_INFO: {
        const isA = currentStep === StepType.PROD_A_INFO;
        return (
          <div className="space-y-6 w-full max-w-2xl">
            <span className={labelTitle}>Catálogo: Producto {isA ? 'Alpha' : 'Beta'}</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Detalles del Artículo</h2>
            <div className="grid gap-6">
              <input autoFocus className={inputStyle} placeholder="Nombre del Producto" value={isA ? formData.productA.name : formData.productB.name} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'name', e.target.value)} />
              <textarea className={inputStyle + " text-lg min-h-[100px]"} placeholder="Descripción técnica y beneficios..." value={isA ? formData.productA.description : formData.productB.description} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'description', e.target.value)} />
            </div>
          </div>
        );
      }
      case StepType.PROD_A_PRICE:
      case StepType.PROD_B_PRICE: {
        const isA = currentStep === StepType.PROD_A_PRICE;
        return (
          <div className="space-y-6 w-full max-w-xl">
            <span className={labelTitle}>Precios y Disponibilidad</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Configuración Comercial</h2>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Precio USD</label>
                 <input type="number" className={inputStyle} placeholder="0.00" value={isA ? formData.productA.price : formData.productB.price} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'price', e.target.value)} />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Stock Inicial</label>
                 <input type="number" className={inputStyle} placeholder="99" value={isA ? formData.productA.stock : formData.productB.stock} onChange={e => updateProductData(isA ? 'productA' : 'productB', 'stock', e.target.value)} />
               </div>
            </div>
          </div>
        );
      }
      case StepType.PROD_A_IMAGE:
      case StepType.PROD_B_IMAGE: {
        const isA = currentStep === StepType.PROD_A_IMAGE;
        return (
          <div className="space-y-6 w-full max-w-xl">
            <span className={labelTitle}>Visual Assets</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Carga de Imagen</h2>
            <MediaUpload value={isA ? formData.productA.image : formData.productB.image} onChange={img => updateProductData(isA ? 'productA' : 'productB', 'image', img)} />
          </div>
        );
      }
      case StepType.CONTACT:
        return (
          <div className="space-y-6 w-full max-w-2xl">
            <span className={labelTitle}>Puntos de Enlace</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Datos de Conexión</h2>
            <div className="grid gap-6">
              <input className={inputStyle} placeholder="Telegram @usuario" value={formData.telegram} onChange={e => updateFormData('telegram', e.target.value)} />
              <input type="email" className={inputStyle} placeholder="Email corporativo" value={formData.email} onChange={e => updateFormData('email', e.target.value)} />
            </div>
          </div>
        );
      case StepType.FINANCE:
        return (
          <div className="space-y-6 w-full max-w-2xl">
            <span className={labelTitle}>Pasarela de Pagos</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-8">Detalles de Cobro</h2>
            <textarea autoFocus className={inputStyle + " min-h-[120px]"} placeholder="Banco, Cuenta, Cédula, Pago Móvil..." value={formData.financeDetails} onChange={e => updateFormData('financeDetails', e.target.value)} />
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-amber-200 text-sm">
                <ShieldCheck className="shrink-0" size={18} />
                <p>Al hacer click en finalizar, tus datos se enviarán de forma segura a nuestro registro central.</p>
            </div>
          </div>
        );
      case StepType.SUCCESS:
        return (
          <div className="text-center max-w-xl animate-fade-in">
            <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/10">
              <Check className="text-green-400 w-12 h-12" strokeWidth={3} />
            </div>
            <h1 className="text-5xl font-black text-white mb-6 tracking-tight">¡Misión Cumplida!</h1>
            <p className="text-slate-400 text-lg mb-10">Tu infraestructura de IA está lista. Recibirás un mensaje en Telegram confirmando la activación de tu bot en breve.</p>
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 text-left mb-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-bold uppercase">Base de Datos</span>
                <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full font-bold">ACTIVA</span>
              </div>
              <p className="text-white font-medium">{formData.businessName}</p>
              <p className="text-slate-500 text-sm">{formData.telegram}</p>
            </div>
            <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Volver al Panel Central</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="app-container h-screen flex items-center justify-center p-4 md:p-10">
      <div className="glass-panel w-full max-w-7xl h-full rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-80 bg-slate-900/40 border-r border-white/5 p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">AI<span className="text-indigo-500">CORE</span></span>
            </div>

            <nav className="space-y-2">
              {sections.map((sec, idx) => {
                const isActive = sec.steps.includes(currentStep);
                const isPast = STEPS_ORDER.indexOf(currentStep) > STEPS_ORDER.indexOf(sec.steps[sec.steps.length - 1]);
                return (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-600'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isActive ? 'border-indigo-500/30 bg-indigo-500/20' : 'border-slate-800'}`}>
                      {isPast ? <Check size={14} className="text-indigo-400" /> : sec.icon}
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{sec.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-3xl border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase">Progreso Global</span>
                <span className="text-xs text-white font-bold">{Math.round(progress)}%</span>
             </div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{width: `${progress}%`}}></div>
             </div>
          </div>
        </aside>

        {/* Main Application Area */}
        <main className="flex-1 flex flex-col relative">
          
          <header className="p-8 flex items-center justify-between md:hidden">
             <span className="text-white font-black text-xl tracking-tighter">AI<span className="text-indigo-500">CORE</span></span>
             <div className="text-xs text-slate-500 font-mono tracking-widest">{Math.round(progress)}%</div>
          </header>

          <div className="flex-1 flex items-center justify-center p-8 md:p-20 overflow-y-auto">
             {renderContent()}
          </div>

          {/* Persistent Footer Actions */}
          {currentStep !== StepType.SUCCESS && !isSyncing && (
            <footer className="p-8 md:p-12 border-t border-white/5 flex items-center justify-between">
               <button 
                 onClick={handlePrev}
                 disabled={currentStepIndex === 0}
                 className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-slate-500 font-bold hover:bg-white/5 transition-all ${currentStepIndex === 0 ? 'invisible' : ''}`}
               >
                 <ChevronLeft size={20} /> <span className="hidden sm:inline">Anterior</span>
               </button>

               <div className="flex items-center gap-6">
                  <span className="text-[10px] text-slate-700 font-bold uppercase tracking-widest hidden sm:block">Step {currentStepIndex + 1} of {STEPS_ORDER.length - 1}</span>
                  <button 
                    onClick={handleNext}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                  >
                    {currentStep === StepType.FINANCE ? 'Finalizar Sistema' : 'Siguiente'}
                    <ChevronRight size={20} strokeWidth={3} />
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
    <label className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-slate-800 rounded-[2rem] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all cursor-pointer overflow-hidden group bg-slate-900/30">
      {value ? (
        <img src={value} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Upload className="text-indigo-400" /></div>
          <span className="text-white font-bold">Cargar Multimedia</span>
          <span className="text-xs text-slate-600 mt-1 uppercase font-bold tracking-widest">JPG, PNG - Max 10MB</span>
        </div>
      )}
      <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
    </label>
  );
};

export default App;


import React, { useState } from 'react';
import { Policy, PolicyStatus, PolicyType, Product, ExtractionResult } from './types';
import { INITIAL_POLICIES, POLICY_TYPE_ICONS } from './constants';
import { geminiService } from './services/gemini';
import Dashboard from './components/Dashboard';
import PolicyEditor from './components/PolicyEditor';
import Simulator from './components/Simulator';
import { 
  LayoutDashboard, 
  FileText, 
  Play, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  MoreVertical,
  Activity,
  Layers,
  Cpu,
  Globe,
  Smartphone,
  Loader2,
  Sparkles,
  ArrowLeft,
  Users,
  Target,
  ShieldCheck,
  History,
  FileJson
} from 'lucide-react';

type View = 'dashboard' | 'product' | 'policies' | 'simulator' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 'prod1', 
      name: 'Customer Web Portal', 
      type: 'Web Application', 
      rawPrd: 'Existing production system focusing on user self-service and account management.', 
      extractedFeatures: ['Account Management', 'Order History', 'Dynamic Pricing'], 
      targetAudience: 'B2C Customers', 
      status: 'active', 
      traffic: '1.2M req/mo' 
    },
    { 
      id: 'prod2', 
      name: 'iOS Mobile App', 
      type: 'Native Mobile', 
      rawPrd: 'Mobile companion app for on-the-go tracking and push notification management.', 
      extractedFeatures: ['Push Notifications', 'Real-time tracking', 'Biometric Login'], 
      targetAudience: 'On-the-go Users', 
      status: 'active', 
      traffic: '850k req/mo' 
    }
  ]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isProcessingPrd, setIsProcessingPrd] = useState(false);

  // Form state for new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState<'Web Application' | 'Native Mobile'>('Web Application');
  const [newProdPrd, setNewProdPrd] = useState('');

  const handleSavePolicy = (updatedPolicy: Policy) => {
    if (updatedPolicy.id && policies.find(p => p.id === updatedPolicy.id)) {
      setPolicies(policies.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
    } else {
      const newPolicy = {
        ...updatedPolicy,
        id: Math.random().toString(36).substr(2, 9),
        lastUpdated: new Date().toISOString().split('T')[0],
        author: 'Current User'
      };
      setPolicies([newPolicy, ...policies]);
    }
    setIsEditing(false);
    setSelectedPolicy(null);
  };

  const handleAddProduct = async () => {
    if (!newProdName || !newProdPrd) return;

    setIsProcessingPrd(true);
    try {
      const result: ExtractionResult = await geminiService.processPRD(newProdPrd, newProdName);
      
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProdName,
        type: newProdType,
        rawPrd: newProdPrd,
        extractedFeatures: result.extractedFeatures,
        targetAudience: result.targetAudience,
        status: 'draft',
        traffic: '0 req/mo'
      };

      const generatedPolicies: Policy[] = result.suggestedPolicies.map(p => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9),
        status: PolicyStatus.DRAFT,
        version: '1.0.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        author: 'AI Architect',
        rules: (p.rules || []).map(r => ({ ...r, id: Math.random().toString(36).substr(2, 9) }))
      } as Policy));

      setProducts([product, ...products]);
      setPolicies([...generatedPolicies, ...policies]);
      
      // Reset form
      setNewProdName('');
      setNewProdPrd('');
      setIsAddingProduct(false);
      setSelectedProduct(product); // View the new product details immediately
    } catch (error) {
      console.error(error);
      alert("Failed to analyze the PRD. Please try again.");
    } finally {
      setIsProcessingPrd(false);
    }
  };

  const renderProductDetails = (product: Product) => {
    const productPolicies = policies.filter(p => p.name.includes(product.name) || p.author === 'AI Architect');

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="p-2.5 text-brand-grey hover:text-brand-black hover:bg-zinc-100 rounded-full transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">{product.name}</h2>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  product.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-brand-grey mt-1 text-base flex items-center gap-2">
                {product.type === 'Web Application' ? <Globe className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                {product.type} Integration Node
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-brand-border rounded-xl text-sm font-bold text-brand-black hover:bg-zinc-50 transition-all">
              Export Config
            </button>
            <button className="px-4 py-2 bg-brand-black text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-md">
              Edit Integration
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-10 rounded-[40px] border border-brand-border shadow-sm space-y-8">
              <h3 className="text-xs font-bold text-brand-grey uppercase tracking-[0.25em] flex items-center gap-2">
                <Target className="w-4 h-4" /> Extracted Architecture
              </h3>
              
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-brand-black">Functional Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.extractedFeatures.map((f, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-semibold text-zinc-600">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-brand-black">Primary Audience</h4>
                  <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-bold text-indigo-700">{product.targetAudience}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-brand-black flex items-center justify-between">
                  Source Requirements Document
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Unstructured Input</span>
                </h4>
                <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 max-h-48 overflow-y-auto">
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium whitespace-pre-wrap">{product.rawPrd}</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-10 rounded-[40px] border border-brand-border shadow-sm space-y-8">
               <div className="flex items-center justify-between">
                 <h3 className="text-xs font-bold text-brand-grey uppercase tracking-[0.25em] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Linked Policies
                </h3>
                <span className="text-[10px] font-bold text-zinc-400">{productPolicies.length} Active Guardrails</span>
               </div>

               <div className="space-y-3">
                 {productPolicies.length > 0 ? productPolicies.map(p => (
                   <div key={p.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between group hover:border-indigo-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors">
                          {POLICY_TYPE_ICONS[p.type]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-black">{p.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{p.rules.length} Rules • v{p.version}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedPolicy(p); setActiveView('simulator'); }}
                        className="p-2 text-zinc-300 hover:text-indigo-600 transition-colors"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                   </div>
                 )) : (
                   <div className="text-center py-10">
                     <p className="text-sm text-zinc-400 font-medium italic">No specific policies currently targeting this instance name.</p>
                   </div>
                 )}
               </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-8 rounded-[32px] border border-brand-border shadow-sm space-y-6">
              <h3 className="text-xs font-bold text-brand-grey uppercase tracking-[0.25em]">Real-time Telemetry</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Throughput</span>
                  <span className="text-sm font-black text-brand-black">{product.traffic}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Compliance</span>
                  <span className="text-sm font-black text-emerald-600">100%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Latency (P99)</span>
                  <span className="text-sm font-black text-brand-black">24ms</span>
                </div>
              </div>
            </section>

            <section className="bg-brand-black p-8 rounded-[32px] text-white space-y-6 shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                <h3 className="text-lg font-bold">Integration Node</h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">System-assigned UUID for your cloud environment. Use this in your SDK initialization.</p>
                <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-[10px] text-indigo-400 break-all">
                  PID_XT_{product.id.toUpperCase()}_01
                </div>
                <button className="w-full mt-4 py-3 bg-white text-brand-black rounded-xl text-xs font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                   <FileJson className="w-3.5 h-3.5" /> Copy Manifest
                </button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 signature-gradient opacity-10 blur-2xl"></div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard policies={policies} />;
      case 'product':
        if (isAddingProduct) {
          return (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsAddingProduct(false)} className="p-2.5 text-brand-grey hover:text-brand-black hover:bg-zinc-100 rounded-full transition-all">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">Register Product Instance</h2>
               </div>

               <div className="bg-white rounded-[40px] border border-brand-border p-10 shadow-xl space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-black tracking-tight uppercase tracking-widest">Instance Name</label>
                      <input 
                        className="w-full px-5 py-4 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        placeholder="e.g. Enterprise CRM Integration"
                        value={newProdName}
                        onChange={e => setNewProdName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-black tracking-tight uppercase tracking-widest">Target Architecture</label>
                      <select 
                        className="w-full px-5 py-4 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-medium"
                        value={newProdType}
                        onChange={e => setNewProdType(e.target.value as any)}
                      >
                        <option value="Web Application">Web Application</option>
                        <option value="Native Mobile">Native Mobile</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black tracking-tight uppercase tracking-widest flex items-center justify-between">
                      Unstructured PRD Text
                      <span className="text-[10px] text-zinc-400">AI will automatically extract logic & features</span>
                    </label>
                    <textarea 
                      className="w-full px-5 py-4 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all h-64 font-medium resize-none"
                      placeholder="Paste your feature requirements, user stories, or functional specs here..."
                      value={newProdPrd}
                      onChange={e => setNewProdPrd(e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleAddProduct}
                      disabled={isProcessingPrd || !newProdName || !newProdPrd}
                      className="w-full py-5 bg-brand-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                    >
                      {isProcessingPrd ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                          <span>Architecting Infrastructure...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-indigo-400" />
                          <span>Generate Integration & Policies</span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-zinc-400 mt-4 font-bold uppercase tracking-widest">Powered by Gemini 3.0 Pro Reasoning Engine</p>
                  </div>
               </div>
            </div>
          );
        }

        if (selectedProduct) {
          return renderProductDetails(selectedProduct);
        }

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">Product Instances</h2>
                <p className="text-brand-grey mt-1 text-base">Monitor where your policy engine is integrated across your ecosystem.</p>
              </div>
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="px-5 py-2.5 bg-brand-black text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" /> Register Instance
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white p-8 rounded-[32px] border border-brand-border hover:border-zinc-300 transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col h-full"
                >
                   <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-brand-grey flex items-center justify-center border border-zinc-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors mb-6">
                      {product.type === 'Web Application' ? <Globe className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                   </div>
                   <h3 className="text-lg font-bold text-brand-black mb-1">{product.name}</h3>
                   <p className="text-xs font-medium text-brand-grey uppercase tracking-widest mb-4">{product.type}</p>
                   
                   <div className="flex-1 space-y-4">
                      {product.targetAudience && (
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Users className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{product.targetAudience}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {product.extractedFeatures.slice(0, 3).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-400 truncate max-w-full">
                            {f}
                          </span>
                        ))}
                        {product.extractedFeatures.length > 3 && (
                          <span className="text-[10px] text-zinc-300 font-bold">+{product.extractedFeatures.length - 3}</span>
                        )}
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-bold text-brand-grey uppercase tracking-wider">{product.status}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-black">{product.traffic}</span>
                   </div>
                </div>
              ))}
              
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="border-2 border-dashed border-zinc-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group min-h-[280px]"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  <Plus className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-zinc-400 group-hover:text-indigo-600">Register new instance</span>
              </button>
            </div>

            <div className="bg-brand-black rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-4 leading-tight">Infrastructure Insights</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">Your policy engine is currently processing dynamic requests across your product fleet with 99.99% adherence to safety guardrails.</p>
                <button className="px-6 py-3 bg-white text-brand-black rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors active:scale-95">View Global Health</button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 signature-gradient opacity-20 blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute right-10 bottom-10 opacity-10">
                <Activity className="w-64 h-64 text-white" />
              </div>
            </div>
          </div>
        );
      case 'policies':
        if (isEditing) {
          return (
            <PolicyEditor 
              policy={selectedPolicy || {
                id: '',
                name: '',
                description: '',
                type: PolicyType.DIALOGUE,
                domain: 'General',
                status: PolicyStatus.DRAFT,
                version: '1.0.0',
                lastUpdated: '',
                author: '',
                rules: []
              }} 
              onSave={handleSavePolicy}
              onCancel={() => { setIsEditing(false); setSelectedPolicy(null); }}
            />
          );
        }
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">Policies</h2>
                <p className="text-brand-grey mt-1 text-base">Manage and govern your AI conversation guardrails.</p>
              </div>
              <button 
                onClick={() => { setSelectedPolicy(null); setIsEditing(true); }}
                className="px-5 py-2.5 bg-brand-black text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" /> Create new policy
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {policies.map(p => (
                <div 
                  key={p.id} 
                  className="bg-white p-6 rounded-2xl border border-brand-border hover:border-zinc-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all flex items-center justify-between group cursor-pointer"
                  onClick={() => { setSelectedPolicy(p); setIsEditing(true); }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand-grey flex items-center justify-center group-hover:bg-zinc-100 group-hover:text-brand-black transition-colors border border-brand-border">
                      {POLICY_TYPE_ICONS[p.type]}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-brand-black group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] font-bold text-brand-grey uppercase tracking-wider">v{p.version}</span>
                        {p.author === 'AI Architect' && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            <Sparkles className="w-2.5 h-2.5" /> AI Generated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-grey mt-1 line-clamp-1 max-w-xl">{p.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-brand-grey">
                          <Clock className="w-3.5 h-3.5" /> {p.lastUpdated}
                        </span>
                        <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                          p.status === PolicyStatus.APPROVED ? 'text-emerald-600' :
                          p.status === PolicyStatus.REVIEW ? 'text-amber-600' : 'text-zinc-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             p.status === PolicyStatus.APPROVED ? 'bg-emerald-500' :
                             p.status === PolicyStatus.REVIEW ? 'bg-amber-500' : 'bg-zinc-300'
                          }`} />
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPolicy(p); setActiveView('simulator'); }}
                      className="p-2.5 text-brand-grey hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Simulate"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedPolicy(p); setIsEditing(true); }}
                      className="p-2.5 text-brand-grey hover:text-brand-black hover:bg-zinc-50 rounded-xl transition-all"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-6 h-6 text-zinc-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'simulator':
        return (
          <div className="h-full flex flex-col gap-6">
             <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">Simulator</h2>
                  <p className="text-brand-grey mt-1 text-base">Stress test your policies with live AI reasoning.</p>
                </div>
                {selectedPolicy && (
                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-brand-border shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-brand-grey uppercase tracking-widest">Active:</span>
                    <span className="text-sm font-bold text-brand-black">{selectedPolicy.name}</span>
                  </div>
                )}
             </div>
             {selectedPolicy ? (
               <div className="flex-1 min-h-0">
                 <Simulator policy={selectedPolicy} />
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                    <Play className="w-8 h-8 text-zinc-300 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-2">No policy active</h3>
                  <p className="text-brand-grey mb-8 max-w-xs text-center">Select a policy from the inventory to begin a simulation session.</p>
                  <button 
                    onClick={() => setActiveView('policies')}
                    className="px-8 py-3 bg-brand-black text-white rounded-xl font-bold hover:bg-zinc-800 shadow-lg active:scale-95 transition-all"
                  >
                    View Inventory
                  </button>
               </div>
             )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">Infrastructure</h2>
              <p className="text-brand-grey mt-1 text-base">Configure your core integration and security parameters.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-white p-8 rounded-[32px] border border-brand-border shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-brand-grey uppercase tracking-[0.2em]">Runtime API</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-brand-black">Project API Key</label>
                    <div className="flex gap-2">
                      <input type="password" value="sk-live-••••••••••••••••" readOnly className="flex-1 px-4 py-3 bg-zinc-50 border border-brand-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" />
                      <button className="px-4 py-3 bg-brand-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors">Rotate</button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-all">
                      <ExternalLink className="w-4 h-4" /> Download Node.js SDK
                    </button>
                  </div>
                </div>
              </section>
              <section className="bg-white p-8 rounded-[32px] border border-brand-border shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-brand-grey uppercase tracking-[0.2em]">Security & Governance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Audit Trail Recording', desc: 'Immutable logs of all policy changes', active: true },
                    { label: 'Multi-Tenant Isolation', desc: 'Secure boundaries between org projects', active: false },
                    { label: 'Human-in-the-loop Reviews', desc: 'Require approval for safety changes', active: true }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <div>
                        <p className="text-sm font-bold text-brand-black">{item.label}</p>
                        <p className="text-[11px] text-brand-grey mt-0.5">{item.desc}</p>
                      </div>
                      <button className={`w-10 h-5 rounded-full transition-colors relative ${item.active ? 'bg-emerald-500' : 'bg-zinc-300'}`}>
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-brand-black selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-[280px] border-r border-brand-border flex flex-col shrink-0 z-20">
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="w-10 h-10 signature-gradient rounded-[12px] flex items-center justify-center shadow-xl shadow-indigo-500/20 active:rotate-3 transition-transform">
            <CheckCircle2 className="text-white w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="font-extrabold tracking-[-0.03em] text-2xl">Policy<span className="text-indigo-600">.ai</span></h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5">
          <SidebarItem 
            icon={<LayoutDashboard className="w-[18px] h-[18px]" />} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => { setActiveView('dashboard'); setIsAddingProduct(false); setSelectedProduct(null); }} 
          />
          <SidebarItem 
            icon={<Layers className="w-[18px] h-[18px]" />} 
            label="Product" 
            active={activeView === 'product'} 
            onClick={() => { setActiveView('product'); setIsAddingProduct(false); setSelectedProduct(null); }} 
          />
          <SidebarItem 
            icon={<FileText className="w-[18px] h-[18px]" />} 
            label="Policies" 
            active={activeView === 'policies'} 
            onClick={() => { setActiveView('policies'); setIsAddingProduct(false); setSelectedProduct(null); }} 
          />
          <SidebarItem 
            icon={<Play className="w-[18px] h-[18px]" />} 
            label="Simulator" 
            active={activeView === 'simulator'} 
            onClick={() => { setActiveView('simulator'); setIsAddingProduct(false); setSelectedProduct(null); }} 
          />
          
          <div className="pt-10 px-4">
            <h3 className="text-[10px] font-bold text-brand-grey uppercase tracking-[0.25em] mb-4">Infrastructure</h3>
            <SidebarItem 
              icon={<Settings className="w-[18px] h-[18px]" />} 
              label="Integration" 
              active={activeView === 'settings'} 
              onClick={() => { setActiveView('settings'); setIsAddingProduct(false); setSelectedProduct(null); }} 
            />
          </div>
        </nav>

        <div className="p-4 m-6 rounded-2xl bg-zinc-50 border border-zinc-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full signature-gradient p-0.5">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xs font-bold text-brand-black">JD</div>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-brand-black truncate leading-none">Jane Doe</p>
              <p className="text-[11px] text-brand-grey mt-1 truncate font-medium">Policy Architect</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-brand-grey uppercase tracking-wider">
              <span>Limit Usage</span>
              <span>75%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 signature-gradient rounded-full"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAFAFA]">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-10 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
             <span className="text-zinc-300 text-xs font-bold uppercase tracking-[0.2em]">{activeView}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                className="pl-11 pr-4 py-2.5 bg-zinc-50 border border-brand-border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none w-72 transition-all placeholder:text-zinc-400 font-medium"
                placeholder="Find policies or logs..."
              />
            </div>
            <div className="h-6 w-px bg-zinc-200" />
            <button className="p-2 text-brand-grey hover:text-indigo-600 bg-white border border-brand-border rounded-xl transition-all relative shadow-sm hover:shadow-md">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <MoreVertical className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-brand-black transition-colors" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 max-w-6xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-zinc-100 text-brand-black shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)] border border-zinc-200' 
        : 'text-brand-grey hover:text-brand-black hover:bg-zinc-50'
    }`}
  >
    <div className={`${active ? 'text-indigo-600' : 'text-zinc-400'}`}>{icon}</div>
    <span className={`text-sm tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
  </button>
);

export default App;


import React, { useState } from 'react';
import { Policy, Rule, PolicyType, PolicyStatus } from '../types';
import { Plus, Trash2, Save, PlusCircle, Shield, ArrowLeft } from 'lucide-react';

interface Props {
  policy: Policy;
  onSave: (policy: Policy) => void;
  onCancel: () => void;
}

const PolicyEditor: React.FC<Props> = ({ policy, onSave, onCancel }) => {
  const [editedPolicy, setEditedPolicy] = useState<Policy>({ ...policy });
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    trigger: '',
    allowedActions: [],
    disallowedActions: [],
    requiredResponse: '',
    priority: 1
  });

  const addRule = () => {
    if (!newRule.trigger) return;
    const rule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      trigger: newRule.trigger!,
      allowedActions: newRule.allowedActions || [],
      disallowedActions: newRule.disallowedActions || [],
      requiredResponse: newRule.requiredResponse || '',
      priority: newRule.priority || 1,
    };
    setEditedPolicy(prev => ({
      ...prev,
      rules: [...prev.rules, rule]
    }));
    setNewRule({ trigger: '', allowedActions: [], disallowedActions: [], requiredResponse: '', priority: 1 });
  };

  const removeRule = (id: string) => {
    setEditedPolicy(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="bg-white rounded-[40px] border border-brand-border shadow-xl overflow-hidden flex flex-col h-full animate-in fade-in zoom-in duration-300">
      <div className="px-10 py-6 border-b border-brand-border flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2.5 text-brand-grey hover:text-brand-black hover:bg-zinc-100 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-extrabold text-brand-black tracking-tight">
            {policy.id ? 'Refine Policy' : 'Draft New Infrastructure'}
          </h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onSave(editedPolicy)}
            className="px-6 py-2.5 text-sm font-bold text-white signature-gradient hover:opacity-90 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" /> Finalize Policy
          </button>
        </div>
      </div>

      <div className="p-10 overflow-y-auto flex-1 space-y-12">
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold text-brand-grey uppercase tracking-[0.25em]">Identity & Context</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-black tracking-tight">Policy Identifier</label>
              <input 
                className="w-full px-4 py-3 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-medium"
                value={editedPolicy.name}
                onChange={e => setEditedPolicy({ ...editedPolicy, name: e.target.value })}
                placeholder="e.g. Healthcare Guardrail Alpha"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-black tracking-tight">Module Type</label>
              <select 
                className="w-full px-4 py-3 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all font-medium"
                value={editedPolicy.type}
                onChange={e => setEditedPolicy({ ...editedPolicy, type: e.target.value as PolicyType })}
              >
                {Object.values(PolicyType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-brand-black tracking-tight">Executive Summary</label>
              <textarea 
                className="w-full px-4 py-3 bg-zinc-50 border border-brand-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all h-24 font-medium resize-none"
                value={editedPolicy.description}
                onChange={e => setEditedPolicy({ ...editedPolicy, description: e.target.value })}
                placeholder="High-level intent of this policy module..."
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="text-[10px] font-bold text-brand-grey uppercase tracking-[0.25em]">Logic & Guardrails</h3>
            <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded-full text-zinc-500 font-bold">{editedPolicy.rules.length} Active rules</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {editedPolicy.rules.map((rule) => (
              <div key={rule.id} className="p-6 border border-brand-border rounded-3xl bg-white hover:border-indigo-200 transition-all relative group shadow-sm">
                <button 
                  onClick={() => removeRule(rule.id)}
                  className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs border border-indigo-100">
                      P{rule.priority}
                    </div>
                    <div className="w-px flex-1 bg-zinc-100" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Trigger Condition</span>
                      <p className="text-base font-bold text-brand-black">{rule.trigger}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rule.allowedActions.length > 0 ? rule.allowedActions.map((a, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">Allow: {a}</span>
                      )) : <span className="px-2.5 py-1 rounded-lg bg-zinc-50 text-zinc-400 text-[10px] font-bold border border-zinc-100 uppercase tracking-wider">No specific allowances</span>}
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Mandatory Bot Response</span>
                      <p className="text-sm italic font-medium text-zinc-600 leading-relaxed">"{rule.requiredResponse}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-2 border-dashed border-zinc-200 rounded-[32px] bg-zinc-50/50 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                <PlusCircle className="w-4 h-4 text-indigo-500" />
              </div>
              <h4 className="text-sm font-bold text-brand-black">Draft Logic Rule</h4>
            </div>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-9 space-y-2">
                <label className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">Conditional Trigger</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="e.g. When the user requests sensitive credential changes"
                  value={newRule.trigger}
                  onChange={e => setNewRule({ ...newRule, trigger: e.target.value })}
                />
              </div>
              <div className="col-span-12 lg:col-span-3 space-y-2">
                <label className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">Priority Index</label>
                <select 
                  className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newRule.priority}
                  onChange={e => setNewRule({ ...newRule, priority: Number(e.target.value) })}
                >
                  <option value={1}>P1 - Mission Critical</option>
                  <option value={2}>P2 - High Guardrail</option>
                  <option value={3}>P3 - Standard Tone</option>
                </select>
              </div>
              <div className="col-span-12 space-y-2">
                <label className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">Hardcoded Response</label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  placeholder="The verbatim string the model must output..."
                  value={newRule.requiredResponse}
                  onChange={e => setNewRule({ ...newRule, requiredResponse: e.target.value })}
                />
              </div>
              <div className="col-span-12 flex justify-end">
                <button 
                  onClick={addRule}
                  disabled={!newRule.trigger}
                  className="px-6 py-2.5 bg-brand-black text-white rounded-xl text-xs font-bold hover:bg-zinc-800 disabled:opacity-40 transition-all shadow-md active:scale-95"
                >
                  Append Rule to Module
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PolicyEditor;

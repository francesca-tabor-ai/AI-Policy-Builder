
import React from 'react';
import { Policy, PolicyType, PolicyStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, ShieldCheck, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

interface Props {
  policies: Policy[];
}

const Dashboard: React.FC<Props> = ({ policies }) => {
  const statsData = [
    { name: 'Dialogue', count: policies.filter(p => p.type === PolicyType.DIALOGUE).length },
    { name: 'Safety', count: policies.filter(p => p.type === PolicyType.SAFETY).length },
    { name: 'Business', count: policies.filter(p => p.type === PolicyType.BUSINESS).length },
    { name: 'Behavioral', count: policies.filter(p => p.type === PolicyType.BEHAVIORAL).length },
  ];

  const statusData = [
    { name: 'Approved', value: policies.filter(p => p.status === PolicyStatus.APPROVED).length },
    { name: 'In Review', value: policies.filter(p => p.status === PolicyStatus.REVIEW).length },
    { name: 'Draft', value: policies.filter(p => p.status === PolicyStatus.DRAFT).length },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
  const STATUS_COLORS = ['#10b981', '#f59e0b', '#d4d4d8'];

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-black tracking-tight">System Health</h2>
          <p className="text-brand-grey mt-1 text-base">Overview of policy governance and active safety guardrails.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" /> +12.5% enforcement vs last month
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <FileText />, label: 'Inventory', value: policies.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: <CheckCircle2 />, label: 'Approved', value: statusData[0].value, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: <ShieldCheck />, label: 'Safety Logs', value: '1.2k', color: 'text-violet-600', bg: 'bg-violet-50' },
          { icon: <Activity />, label: 'Violations', value: '42', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-white rounded-[32px] border border-brand-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border border-transparent group-hover:border-current/10 transition-colors`}>
              {React.cloneElement(stat.icon as React.ReactElement, { className: 'w-6 h-6' })}
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-grey uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl font-extrabold text-brand-black mt-1 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-brand-border shadow-sm">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-sm font-bold text-brand-grey uppercase tracking-[0.2em]">Deployment Distribution</h3>
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-indigo-500" />
               <span className="text-[10px] font-bold text-brand-grey uppercase tracking-wider">Active Modules</span>
             </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#71717A' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#71717A' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#FAFAFA' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '12px' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                  labelStyle={{ fontSize: '10px', fontWeight: 800, color: '#A1A1AA', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={40}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-brand-border shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-brand-grey uppercase tracking-[0.2em] mb-10">Lifecycle Status</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-brand-black">{policies.length}</span>
                <span className="text-[10px] font-bold text-brand-grey uppercase tracking-widest">Policies</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full mt-8">
              {statusData.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[i] }}></div>
                    <span className="text-xs font-bold text-brand-grey">{s.name}</span>
                  </div>
                  <span className="text-xs font-black text-brand-black">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

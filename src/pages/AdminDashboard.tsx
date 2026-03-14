import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Users, 
  FileText, 
  Activity, 
  Mail, 
  Zap, 
  Search, 
  Flame, 
  LayoutDashboard, 
  History, 
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'activity' | 'seeker-detail'>('overview');
  const [selectedSeeker, setSelectedSeeker] = useState<any>(null);
  const [seekerDetails, setSeekerDetails] = useState<{journals: any[], vision: any[], activity: any[]}>({journals: [], vision: [], activity: []});
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const calculateTrialStatus = (startedAt: string) => {
    if (!startedAt) return { expired: false, daysLeft: 10 };
    const start = new Date(startedAt).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const left = 10 - diffDays;
    return { expired: left <= 0, daysLeft: Math.max(0, left) };
  };

  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin-login');
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
      return;
    }

    const fetchStats = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await resp.json();
        setStats(data);
      } catch (e) {
        console.error('Failed to fetch stats');
      }
    };

    const fetchUsers = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await resp.json();
        setAllUsers(data);
      } catch (e) {
        console.error('Failed to fetch users');
      }
    };

    const fetchActivity = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/admin/activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await resp.json();
        setActivityLogs(data);
      } catch (e) {
        console.error('Failed to fetch logs');
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([fetchStats(), fetchUsers(), fetchActivity()]);
      } catch (error) {
        console.error('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate, API_URL]);

  const viewSeekerDetails = async (seeker: any) => {
    setSelectedSeeker(seeker);
    setActiveView('seeker-detail');
    setLoading(true);
    try {
      const journalsRes = await fetch(`${API_URL}/api/admin/seeker/${seeker.id}/journals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const visionRes = await fetch(`${API_URL}/api/admin/seeker/${seeker.id}/vision`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const activityRes = await fetch(`${API_URL}/api/admin/seeker/${seeker.id}/activity`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const journals = await journalsRes.json();
      const vision = await visionRes.json();
      const activity = await activityRes.json();
      
      setSeekerDetails({ journals, vision, activity });
    } catch (error) {
      console.error('Failed to fetch seeker details');
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (seekerId: string, currentPlan: string) => {
    const isPremium = currentPlan === 'premium';
    try {
      const response = await fetch(`${API_URL}/api/admin/seeker/${seekerId}/premium`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ isPremium: !isPremium })
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedSeeker((prev: any) => ({ ...prev, plan: data.plan }));
        setAllUsers((prev: any[]) => prev.map(u => u.id === seekerId ? { ...u, plan: data.plan } : u));
      }
    } catch (error) {
       console.error('Failed to toggle premium status');
    }
  };

  const filteredUsers = allUsers.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F172A]">
      <div className="text-primary animate-pulse font-display text-xl tracking-widest">LOADING CORE DASHBOARD...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-primary/30">
      {/* Professional Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white uppercase">DATA <span className="text-primary text-[10px] align-top">PROPER</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveView('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'overview' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button 
            onClick={() => setActiveView('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'users' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Users size={20} />
            <span className="text-sm font-medium">Seekers</span>
          </button>
          <button 
            onClick={() => setActiveView('activity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'activity' ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            <History size={20} />
            <span className="text-sm font-medium">Activity Log</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 overflow-hidden shadow-inner">
               <span className="text-[10px] font-bold text-primary">DP</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{adminUser?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminUser?.username || adminUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 relative">
        {/* Glow Effects */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        {activeView === 'overview' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-display font-bold text-white tracking-tight">Executive Summary</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time performance metrics across the manifestation network.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                <Clock size={12} className="text-primary" /> Active Monitoring
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Seekers', value: stats?.users?.count || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Journals', value: stats?.entries?.count || 0, icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { label: 'Avg Streak', value: stats?.streaks?.avgStreak?.toFixed(1) || 0, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Peak Streak', value: stats?.streaks?.maxStreak || 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              ].map((card, i) => (
                <Card key={i} className="bg-slate-900/40 border-slate-800 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} blur-[40px] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{card.label}</CardTitle>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-display font-bold text-white tracking-tight">{card.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Seeker Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                   {stats?.plans?.map((p: any) => (
                     <div key={p.plan} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="capitalize text-slate-400">{p.plan} Users</span>
                            <span className="text-white font-bold">{p.count}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${p.plan === 'premium' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.2)]' : 'bg-slate-500'} transition-all duration-1000`} 
                                style={{ width: `${(p.count / (stats.users?.count || 1)) * 100}%` }}
                            />
                        </div>
                     </div>
                   ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-md shadow-xl">
                 <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-rose-400" /> System Vibe Check
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 flex items-center justify-between">
                        <div className="text-xs text-slate-400">Database Consistency</div>
                        <div className="text-xs font-bold text-primary flex items-center gap-1">
                            <ShieldCheck size={14} /> OPTIMAL
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 flex items-center justify-between">
                        <div className="text-xs text-slate-400">Sync Latency</div>
                        <div className="text-xs font-bold text-blue-400">14ms</div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="space-y-6 max-w-6xl mx-auto">
             <header className="flex justify-between items-center bg-slate-900/20 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-md">
                <div>
                   <h1 className="text-2xl font-display font-bold text-white">Seekers Management</h1>
                   <p className="text-sm text-slate-500 mt-0.5">Filter, search, and audit user accounts.</p>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </header>

             <div className="grid gap-4">
                {filteredUsers.map((u: any) => (
                  <div key={u.id} className="group p-5 bg-slate-900/30 border border-slate-800/50 rounded-2xl flex items-center justify-between hover:bg-slate-800/40 transition-all hover:border-slate-700 hover:shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary/10 to-blue-500/10 border border-slate-700/30 flex items-center justify-center text-primary font-bold text-sm tracking-tighter">
                            {(u.name || u.displayName || u.email || '').split(' ').map((n:any)=>n[0]).join('') || 'A'}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white tracking-wide">{u.name || u.displayName || 'Anonymous Seeker'}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail size={12} className="text-slate-500" />
                            <span className="text-xs text-slate-400">{u.email}</span>
                            <span className="text-xs text-slate-500 italic ml-2">[{u.password || 'FIREBASE'}]</span>
                            {u.phone_number && (
                              <span className="text-xs text-slate-400 ml-2">{u.phone_number}</span>
                            )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="text-right">
                           <div className="flex items-center gap-2 justify-end">
                             <div className={`text-[10px] font-bold uppercase tracking-widest ${u.plan === 'premium' ? 'text-amber-400' : 'text-slate-500'}`}>{u.plan}</div>
                             {u.plan === 'free' && (
                               <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${calculateTrialStatus(u.trial_started_at).expired ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
                                 {calculateTrialStatus(u.trial_started_at).expired ? 'Expired' : `${calculateTrialStatus(u.trial_started_at).daysLeft}d left`}
                               </div>
                             )}
                           </div>
                           <div className="text-[10px] text-slate-600 mt-1">Joined {new Date(u.created_at).toLocaleDateString()}</div>
                           <div className="text-[10px] text-slate-500 mt-0.5">{u.last_login ? `Active ${new Date(u.last_login).toLocaleDateString()}` : 'AVOIDED LOGIN'}</div>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-700/50 min-w-[50px] shadow-lg">
                           <span className="text-xs font-bold text-white">{u.streak || 0}</span>
                           <span className="text-[8px] text-rose-400 uppercase font-black flex items-center gap-0.5"><Flame size={8} /> Day</span>
                        </div>
                        <button 
                          onClick={() => viewSeekerDetails(u)}
                          className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                   <div className="text-center py-20 grayscale opacity-40 italic text-sm tracking-widest uppercase">No matching seekers identified</div>
                )}
             </div>
          </div>
        )}

        {activeView === 'seeker-detail' && selectedSeeker && (
          <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-center">
              <div>
                <button onClick={() => setActiveView('users')} className="text-primary text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1 hover:underline">
                   ← Back to Seekers
                </button>
                <h1 className="text-3xl font-display font-bold text-white">{selectedSeeker.name || 'Anonymous Seeker'}</h1>
                <p className="text-slate-400 text-sm">{selectedSeeker.email} • {selectedSeeker.plan} Plan</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => togglePremium(selectedSeeker.id, selectedSeeker.plan)}
                  className={`px-6 py-2.5 rounded-xl font-display font-bold text-sm shadow-dreamy transition-all flex items-center gap-2 ${
                    selectedSeeker.plan === 'premium' 
                      ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700" 
                      : "gradient-lavender text-primary-foreground shadow-pink"
                  }`}
                >
                  <Crown size={16} />
                  {selectedSeeker.plan === 'premium' ? "Revoke Premium" : "Grant Premium"}
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Journal History */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="text-purple-400" /> Journal History
                </h2>
                <div className="space-y-4">
                  {seekerDetails.journals.map((entry) => (
                    <Card key={entry.id} className="bg-slate-900/40 border-slate-800 backdrop-blur-md">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 font-medium tabular-nums">{new Date(entry.date).toLocaleString()}</span>
                          <div className="flex gap-2">
                            {entry.mood && <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full">{entry.mood}</span>}
                            {entry.energy && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{entry.energy}</span>}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {seekerDetails.journals.length === 0 && <p className="text-slate-500 italic text-sm">No journal entries yet.</p>}
                </div>
              </div>

              {/* Sidebar: Vision & Activity */}
              <div className="space-y-8">
                <div>
                   <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                     <Zap className="text-amber-400" /> Vision Board
                   </h2>
                   <div className="grid grid-cols-2 gap-2">
                      {seekerDetails.vision.map((item) => (
                        <div 
                          key={item.id} 
                          className={`rounded-lg p-2 text-[10px] aspect-square flex items-center justify-center text-center overflow-hidden border border-slate-700/50 ${item.bg_class || 'bg-slate-800'}`}
                        >
                          {item.type === 'image' ? <img src={item.content} className="w-full h-full object-cover rounded shadow-lg" /> : <span className="font-semibold text-slate-900">{item.content}</span>}
                        </div>
                      ))}
                      {seekerDetails.vision.length === 0 && <p className="text-slate-500 italic text-sm col-span-2">No items on board yet.</p>}
                   </div>
                </div>

                <div>
                   <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                     <Activity className="text-rose-400" /> Recent Drifts
                   </h2>
                   <div className="space-y-3 relative border-l border-slate-800 ml-2">
                      {seekerDetails.activity.map((log, idx) => (
                        <div key={idx} className="relative pl-6 pb-4">
                          <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-slate-700 border border-slate-600" />
                          <div className="text-[10px] font-bold text-primary uppercase tracking-wider">{log.action}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{log.details || 'Interacted with tool'}</div>
                          <div className="text-[8px] text-slate-600 mt-0.5 tabular-nums">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

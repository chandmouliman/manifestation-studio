import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Users, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  LayoutDashboard, 
  UserCircle, 
  LogOut,
  ChevronRight,
  Smile,
  BarChart3,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'activity'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, usersRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/activity`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (activityRes.ok) setActivities(await activityRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      toast.error('Session expired. Please login again.');
      handleLogout();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        toast.success('Admin Login Successful');
      } else {
        toast.error('Invalid Credentials');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white shadow-2xl">
          <CardHeader className="text-center">
            <LayoutDashboard className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold font-display">Admin Dashboard</CardTitle>
            <p className="text-slate-400 text-sm">Secure restricted access</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="admin"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-slate-800 border-slate-700 text-white"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-lg font-bold">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#64748b'];

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight">Admin<span className="text-primary">Studio</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-800 pr-6">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab('activity')} 
                className={`text-sm font-medium transition-colors ${activeTab === 'activity' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Live Feed
              </button>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-rose-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Seekers', value: stats?.users?.count || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Journal Entries', value: stats?.entries?.count || 0, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { label: 'Avg Streak', value: Math.round(stats?.streaks?.avgStreak || 0), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'Live Now', value: 1, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' },
              ].map((item, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-800 shadow-xl backdrop-blur-sm hover:border-primary/30 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                       <div className={`p-2 rounded-xl ${item.bg}`}>
                         <item.icon className={`w-4 h-4 ${item.color}`} />
                       </div>
                    </div>
                    <h3 className="text-3xl font-bold font-display text-white">
                      {item.value === 0 ? <span className="text-slate-700">0</span> : item.value}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mood Breakdown */}
              <Card className="lg:col-span-2 bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-display font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" /> User Mood Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full flex items-center justify-center">
                    {(stats?.moods || []).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.moods || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="mood" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                            cursor={{ fill: '#1e293b' }}
                          />
                          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center space-y-2">
                        <Smile className="w-12 h-12 text-slate-800 mx-auto" />
                        <p className="text-slate-500 text-sm">No moods tracked yet by seekers.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Plan Distribution */}
              <Card className="bg-slate-900 border-slate-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-display font-semibold">Plan Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.plans || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="plan"
                        >
                          {(stats?.plans || []).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-xs">
                    {(stats?.plans || []).map((p: any, i: number) => (
                       <div key={i} className="flex items-center gap-1.5">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                         <span className="text-slate-400 capitalize">{p.plan}: {p.count}</span>
                       </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Mini log */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg font-display font-semibold">Latest Actions</CardTitle>
                 <Button variant="ghost" size="sm" onClick={() => setActiveTab('activity')} className="text-primary hover:text-primary/80">View All</Button>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-800">
                    {activities.slice(0, 5).map((log, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-primary">
                            {log.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{log.name || 'Seeker'}</p>
                            <p className="text-[10px] text-slate-500">{log.action}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    ))}
                  </div>
               </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
                <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <Input 
                      placeholder="Search explorers..." 
                      className="pl-10 bg-slate-800 border-slate-700 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex items-center gap-4 text-sm">
                   <span className="text-slate-400">Total: <span className="text-white font-bold">{users.length}</span></span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredUsers.map((user, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                   <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-all cursor-pointer group shadow-lg">
                     <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center shadow-lg">
                               <UserCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">{user.name || 'Anonymous'}</h4>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-tighter ${user.plan === 'premium' ? 'bg-gold-light text-warning' : 'bg-slate-800 text-slate-400'}`}>
                            {user.plan}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                           <div>
                             <p className="text-[10px] text-slate-500 uppercase">Streak</p>
                             <p className="text-sm font-bold text-emerald-400 flex items-center gap-1"><Activity className="w-3 h-3" /> {user.streak || 0} Days</p>
                           </div>
                           <div>
                             <p className="text-[10px] text-slate-500 uppercase">Joined</p>
                             <p className="text-sm text-slate-300">{new Date(user.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'activity' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-slate-900 border-slate-800 shadow-2xl">
                 <CardHeader>
                    <CardTitle className="text-xl font-display font-bold">Live Activity Stream</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {activities.map((log, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:border-primary/30 transition-all group">
                             <div className="w-10 h-10 rounded-full bg-slate-800 flex shrink-0 items-center justify-center font-bold text-slate-400 group-hover:text-primary border border-slate-700">
                                {log.name?.charAt(0) || 'S'}
                             </div>
                             <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-white">{log.name || 'Seeker'}</span>
                                      <span className="text-[10px] text-slate-500">·</span>
                                      <span className="text-[10px] text-slate-500 font-mono truncate max-w-[100px]">{log.user_id}</span>
                                   </div>
                                   <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${log.action.includes('REWRITE') ? 'bg-rose-500/20 text-rose-400' : 'bg-primary/20 text-primary'}`}>
                                      {log.action}
                                   </span>
                                   <p className="text-xs text-slate-400 truncate">{log.details}</p>
                                </div>
                             </div>
                             <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-slate-600 transition-colors self-center" />
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;

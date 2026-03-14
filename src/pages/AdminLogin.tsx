import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, Mail, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast.success("Welcome back, Commander.");
        navigate('/admin');
      } else {
        toast.error("Access Denied. Invalid credentials.");
      }
    } catch (error) {
      toast.error("System connection failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full -ml-72 -mb-72" />
      
      <div className="w-full max-w-md z-10">
        <div className="mb-12 text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">DATAPROPER</h1>
          <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Strategic Manifestation Oversight</p>
        </div>

        <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-2xl shadow-2xl overflow-hidden border-t-primary/20">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Secure Terminal
            </CardTitle>
            <p className="text-sm text-slate-500">Authorized personnel only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="text" 
                    placeholder="Admin Username / ID" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 h-11 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="Encryption Key" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 h-11 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-slate-950 font-bold text-sm tracking-wide rounded-lg shadow-xl shadow-primary/10 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "INITIALIZING SECURE SESSION..." : "ENGAGE COMMAND PROTOCOL"}
                  {!loading && <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-center gap-6">
           <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <Sparkles size={12} className="text-primary" /> End-to-End Encrypted
           </div>
           <div className="w-px h-3 bg-slate-800 self-center" />
           <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Level 4 Access Required
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

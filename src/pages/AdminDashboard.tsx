import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FileText, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (!stats) return <div className="p-8 text-white">Loading Dashboard...</div>;

  return (
    <div className="p-6 space-y-6 pt-12 pb-24 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-morphism border-none">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <Users className="w-5 h-5 text-white/70" />
            <CardTitle className="text-sm font-medium text-white/70 text-nowrap">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.users.count}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-none">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <FileText className="w-5 h-5 text-white/70" />
            <CardTitle className="text-sm font-medium text-white/70 text-nowrap">Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.entries.count}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-morphism border-none">
        <CardHeader>
          <CardTitle className="text-white">Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentUsers.map((user: any) => (
              <div key={user.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <div>
                  <div className="text-white font-medium">{user.name || 'Anonymous'}</div>
                  <div className="text-white/50 text-xs">{user.email}</div>
                </div>
                <div className="text-white/30 text-xs text-nowrap">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

// app/mission-control/page.tsx
'use client';

import { useEffect, useState } from 'react';

export const dynamic = 'force-static';

interface Agent {
  agent_id: string;
  session_key: string;
  status: string;
  updated_at: string;
}

interface Transfer {
  run_id: string;
  source_agent: string;
  target_agent: string;
  status: string;
  started_at: string;
}

interface Activity {
  id: number;
  agent_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
}

const AGENT_NAMES: Record<string, string> = {
  'main': '🥒 Zucchini',
  'productphilosophy': '📐 Spark',
  'designaesthetics': '🎨 Pixel',
  'techrd': '⚙️ Forge',
  'learningevolution': '🌱 Seed'
};

export default function MissionControl() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, use the EC2 public IP directly
    // In production, this should be proxied through the same domain
    const API_BASE = 'http://34.220.93.56:3457';
    
    const fetchData = async () => {
      try {
        const [sessionsRes, transfersRes, activitiesRes] = await Promise.all([
          fetch(`${API_BASE}/api/sessions`),
          fetch(`${API_BASE}/api/transfers`),
          fetch(`${API_BASE}/api/activities?limit=20`)
        ]);

        const sessions = await sessionsRes.json();
        const transfers = await transfersRes.json();
        const activities = await activitiesRes.json();

        setAgents(sessions.data || []);
        setTransfers(transfers.data || []);
        setActivities(activities.data || []);
        setLoading(false);
      } catch (e) {
        setError('Failed to connect to Mission Control server');
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const getAgentName = (id: string) => AGENT_NAMES[id] || id;

  const getAgentStatus = (agentId: string) => {
    const count = agents.filter(a => a.agent_id === agentId).length;
    return count > 0 ? `${count} sessions` : 'offline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Connecting to Mission Control...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-gray-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Make sure the Mission Control server is running on port 3457</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b border-[#2a2a3e] px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            🎯 Mission Control
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm">Connected</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents Panel */}
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e]">
            <div className="px-4 py-3 border-b border-[#2a2a3e]">
              <h2 className="text-xs uppercase tracking-wider text-gray-500">Agents</h2>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(AGENT_NAMES).map(([id, name]) => (
                <div key={id} className="p-3 rounded-lg bg-[#1a1a2e] border border-transparent hover:border-cyan-500/50 transition-colors">
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    {getAgentStatus(id)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Transfers */}
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e]">
            <div className="px-4 py-3 border-b border-[#2a2a3e]">
              <h2 className="text-xs uppercase tracking-wider text-gray-500">Task Transfers</h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {transfers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No transfers yet</p>
              ) : (
                transfers.map((t) => (
                  <div key={t.run_id} className="p-3 rounded-lg bg-[#1a1a2e] flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm">{getAgentName(t.source_agent)}</div>
                      <div className="text-xs text-gray-500">→ {getAgentName(t.target_agent)}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      t.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e]">
            <div className="px-4 py-3 border-b border-[#2a2a3e]">
              <h2 className="text-xs uppercase tracking-wider text-gray-500">Live Activity</h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-[#1a1a2e] border-l-2 border-cyan-500">
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{getAgentName(a.agent_id)}</span>: {a.description}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e] p-4">
            <div className="text-2xl font-bold text-cyan-400">{agents.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Active Sessions</div>
          </div>
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e] p-4">
            <div className="text-2xl font-bold text-purple-400">{transfers.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Task Transfers</div>
          </div>
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e] p-4">
            <div className="text-2xl font-bold text-green-400">
              {transfers.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
          </div>
          <div className="bg-[#12121a] rounded-lg border border-[#2a2a3e] p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {transfers.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}

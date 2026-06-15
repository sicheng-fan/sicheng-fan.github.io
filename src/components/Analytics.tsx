'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayUniqueVisitors: number;
}

// 访客统计记录组件 - 放在 layout 中自动记录访问
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 记录页面访问
    const recordVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page: pathname }),
        });
      } catch (error) {
        // 静默失败，不影响用户体验
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();
  }, [pathname]);

  return null;
}

// 访客统计展示组件 - 可以放在页脚或其他位置显示
export function AnalyticsDisplay() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-gray-500 animate-pulse">
        加载统计数据...
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <span title="总访问量">
        👁️ {stats.totalVisits.toLocaleString()} 次访问
      </span>
      <span title="独立访客">
        👤 {stats.uniqueVisitors.toLocaleString()} 位访客
      </span>
      <span title="今日访问">
        📅 今日 {stats.todayVisits} 次
      </span>
    </div>
  );
}

// 简洁版统计展示
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const data = await response.json();
          setCount(data.totalVisits);
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
      }
    };

    fetchCount();
  }, []);

  if (count === null) {
    return <span className="text-gray-500">--</span>;
  }

  return (
    <span className="font-mono text-green-400">
      {count.toLocaleString()}
    </span>
  );
}

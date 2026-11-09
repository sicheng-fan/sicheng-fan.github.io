import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { corsJson, corsOptions } from '@/lib/cors';

// 数据文件路径
const DATA_DIR = process.env.ANALYTICS_DATA_DIR || path.join(process.cwd(), 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// 访客数据类型
interface VisitorData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  lastUpdated: string;
  visitors: {
    [ip: string]: {
      firstVisit: string;
      lastVisit: string;
      visits: number;
      userAgent?: string;
      pages: string[];
    };
  };
  dailyStats: {
    [date: string]: {
      visits: number;
      uniqueVisitors: number;
    };
  };
}

// 初始化数据
function initData(): VisitorData {
  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    lastUpdated: new Date().toISOString(),
    visitors: {},
    dailyStats: {},
  };
}

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取数据
function readData(): VisitorData {
  ensureDataDir();
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const content = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading analytics data:', error);
  }
  return initData();
}

// 写入数据
function writeData(data: VisitorData) {
  ensureDataDir();
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing analytics data:', error);
  }
}

// 获取今天的日期字符串
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 获取真实 IP
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// POST - 记录访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page = '/' } = body;
    
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const today = getTodayString();
    const now = new Date().toISOString();
    
    const data = readData();
    
    // 更新总访问量
    data.totalVisits += 1;
    data.lastUpdated = now;
    
    // 初始化今日统计
    if (!data.dailyStats[today]) {
      data.dailyStats[today] = { visits: 0, uniqueVisitors: 0 };
    }
    data.dailyStats[today].visits += 1;
    
    // 检查是否为新访客
    const isNewVisitor = !data.visitors[ip];
    const isNewTodayVisitor = isNewVisitor || 
      (data.visitors[ip] && !data.visitors[ip].lastVisit.startsWith(today));
    
    if (isNewVisitor) {
      data.uniqueVisitors += 1;
      data.visitors[ip] = {
        firstVisit: now,
        lastVisit: now,
        visits: 1,
        userAgent: userAgent.substring(0, 200), // 限制长度
        pages: [page],
      };
      data.dailyStats[today].uniqueVisitors += 1;
    } else {
      data.visitors[ip].lastVisit = now;
      data.visitors[ip].visits += 1;
      if (!data.visitors[ip].pages.includes(page)) {
        data.visitors[ip].pages.push(page);
      }
      if (isNewTodayVisitor) {
        data.dailyStats[today].uniqueVisitors += 1;
      }
    }
    
    // 计算今日访问量
    data.todayVisits = data.dailyStats[today]?.visits || 0;
    
    writeData(data);
    
    return corsJson({
      success: true,
      totalVisits: data.totalVisits,
      uniqueVisitors: data.uniqueVisitors,
      todayVisits: data.todayVisits,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return corsJson(
      { error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}

// GET - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    const adminToken = process.env.ANALYTICS_TOKEN;
    const isAdmin = Boolean(adminToken && token && token === adminToken);
    
    const data = readData();
    const today = getTodayString();
    
    // 公开数据
    const publicData = {
      totalVisits: data.totalVisits,
      uniqueVisitors: data.uniqueVisitors,
      todayVisits: data.dailyStats[today]?.visits || 0,
      todayUniqueVisitors: data.dailyStats[today]?.uniqueVisitors || 0,
    };
    
    // 如果是管理员，返回更多数据
    if (isAdmin) {
      // 获取最近7天的统计
      const last7Days: { date: string; visits: number; uniqueVisitors: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push({
          date: dateStr,
          visits: data.dailyStats[dateStr]?.visits || 0,
          uniqueVisitors: data.dailyStats[dateStr]?.uniqueVisitors || 0,
        });
      }
      
      // 获取最近访客（不含完整IP）
      const recentVisitors = Object.entries(data.visitors)
        .sort(([, a], [, b]) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())
        .slice(0, 20)
        .map(([ip, info]) => ({
          ip: ip.replace(/\d+$/, 'xxx'), // 隐藏最后一段
          lastVisit: info.lastVisit,
          visits: info.visits,
          pages: info.pages,
        }));
      
      return corsJson({
        ...publicData,
        last7Days,
        recentVisitors,
        lastUpdated: data.lastUpdated,
      });
    }
    
    return corsJson(publicData);
  } catch (error) {
    console.error('Analytics error:', error);
    return corsJson(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

export const OPTIONS = corsOptions;

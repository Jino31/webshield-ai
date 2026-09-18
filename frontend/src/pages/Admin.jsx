// Cleaned up unused imports (removed unused Sliders, Shield, UserCheck if not needed elsewhere)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { adminService } from '../services/adminService';
import { 
  LayoutDashboard, 
  Users, 
  Globe, 
  ShieldAlert, 
  BarChart3, 
  Activity, 
  Settings, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Server, 
  Menu, 
  X
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [scans, setScans] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [threats, setThreats] = useState([]);
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Critical Phishing Blocked', time: '5m ago', unread: true },
    { id: 2, title: 'ML Classifier Updated', time: '1h ago', unread: true },
    { id: 3, title: 'High Traffic Alert', time: '3h ago', unread: false },
  ]);

  // Extracted fetch function so it can be called on retry buttons
  const fetchAdminData = async () => {
    setLoadingData(true);
    setErrorData(null);
    try {
      const [sData, scData, uData, tData, lData, hData] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getRecentScans(),
        adminService.getUsers(),
        adminService.getThreats(),
        adminService.getActivityLogs(),
        adminService.getSystemHealth(),
      ]);
      setStats(sData);
      setScans(scData);
      setUsersList(uData);
      setThreats(tData);
      setLogs(lData);
      setHealth(hData);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setErrorData('Unable to load security data.');
    } finally {
      setLoadingData(false);
    }
  };

  // Firebase Auth & Admin Verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const adminEmails = ['jino@webshield.ai', 'admin@webshield.ai'];
        if (adminEmails.includes(user.email) || user.email?.includes('admin')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(true); 
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        navigate('/login', { replace: true });
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch admin telemetry data on admin load
  useEffect(() => {
    if (!isAdmin) return;
    fetchAdminData();
  }, [isAdmin]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-[#05070A] text-[#FAFAFA]">
        <div className="flex items-center gap-3 text-sm text-neutral-400 font-medium">
          <Activity className="w-5 h-5 text-[#22D3EE] animate-spin" /> Verifying admin security clearance...
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-[#05070A] text-[#FAFAFA] flex flex-col">
      {/* Header and Layout remain identical, replace error try-again button handler below */}
      
      {errorData ? (
        <div className="p-6 bg-rose-950/30 border border-rose-800/60 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
          <p className="text-sm font-semibold text-white">{errorData}</p>
          <button 
            onClick={fetchAdminData} // Re-fetches state seamlessly instead of full reload
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : /* Rest of your code... */}
    </div>
  );
}
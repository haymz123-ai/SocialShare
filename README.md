'use client'

import React, { useState } from 'react';
import { 
  Home, Users, FileText, Pill, AlertCircle, 
  TrendingUp, Calendar, Settings, Menu, X,
  Search, Bell, ChevronDown, Activity, MapPin,
  CheckCircle, Clock, AlertTriangle, Zap, Eye,
  TrendingDown, BarChart3, Brain, Shield, Star,
  ChevronRight, Plus, Filter, Download, Award,
  Heart, Sparkles
} from 'lucide-react';

// Import ScrollArea components (assuming they're installed via shadcn)
import { ScrollArea } from "../components/ui/scroll-area";

const CareBridgePro = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
    { id: 'individuals', icon: Users, label: 'Individuals', badge: '156' },
    { id: 'daily-notes', icon: FileText, label: 'Daily Notes', badge: '12' },
    { id: 'medications', icon: Pill, label: 'Medications', badge: null },
    { id: 'incidents', icon: AlertCircle, label: 'Incidents', badge: '3' },
    { id: 'hcbs', icon: MapPin, label: 'HCBS Tracking', badge: null },
    { id: 'reports', icon: TrendingUp, label: 'Analytics', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ];

  const NavBar = () => (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-900/20 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-pulse">
              <Activity className="text-white" size={26} />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              CareBridge Pro
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">IPMS Aligned EMR</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl px-5 py-2.5 w-96 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
          <Search size={18} className="text-emerald-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
          />
          <kbd className="px-2 py-0.5 text-xs bg-slate-700 rounded text-slate-400 font-mono">⌘K</kbd>
        </div>
        
        <button className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 group">
          <Bell size={20} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-lime-500 to-green-600 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700/50 cursor-pointer hover:bg-white/5 rounded-xl p-2 transition-all duration-300 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Admin User</p>
            <p className="text-xs text-slate-400 font-medium">QIDP • Online</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/50">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-900/10 border-r border-slate-800/50 transition-all duration-300 flex flex-col backdrop-blur-xl`}>
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-slate-300 font-semibold">System Online</span>
          </div>
          <div className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <span className="text-emerald-400 text-xs font-bold">v2.0</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Daily Progress</span>
            <span className="text-xs text-emerald-400 font-bold">87%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-1000" style={{width: '87%'}}></div>
          </div>
        </div>
      </div>
      
      {/* ScrollArea for sidebar navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-2 px-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/50 scale-105' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:scale-105'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 animate-pulse"></div>
                )}
                <Icon size={20} className={`relative z-10 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="font-semibold relative z-10 flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={16} className="relative z-10 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-800/50 space-y-3">
        <div className="bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-green-900/30 rounded-xl p-4 border border-emerald-500/30 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-emerald-400" size={18} />
              <p className="text-sm font-bold text-white">IPMS Certified</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Alabama DD Compliant System</p>
          </div>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, change, trend, color, sparkle }) => (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-all duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
            <Icon className="text-white" size={26} />
          </div>
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <TrendingUp className="text-green-400" size={18} />
            ) : (
              <TrendingDown className="text-red-400" size={18} />
            )}
            <span className={`text-sm font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-white">{value}</p>
            {sparkle && <Sparkles className="text-lime-400 mb-2 animate-pulse" size={20} />}
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
              Dashboard
            </h2>
            <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
              <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                <Zap size={12} /> LIVE
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-lg">Real-time care management insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-slate-700">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105">
            <Plus size={18} />
            Quick Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Individuals" 
          value="156" 
          change="+12%" 
          trend="up"
          color="from-emerald-600 to-teal-500"
          sparkle={false}
        />
        <StatCard 
          icon={FileText} 
          title="Notes This Week" 
          value="847" 
          change="98%" 
          trend="up"
          color="from-green-400 to-emerald-500"
          sparkle={true}
        />
        <StatCard 
          icon={AlertCircle} 
          title="Open Incidents" 
          value="8" 
          change="-25%" 
          trend="down"
          color="from-yellow-500 to-orange-600"
          sparkle={false}
        />
        <StatCard 
          icon={CheckCircle} 
          title="HCBS Compliance" 
          value="94%" 
          change="+3%" 
          trend="up"
          color="from-lime-500 to-green-600"
          sparkle={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Activity className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Activity Feed</h3>
            </div>
            <button className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center gap-1 hover:scale-105 transition-all">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          {/* ScrollArea for activity feed */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {[
                { type: 'note', user: 'Sarah Johnson', action: 'Completed daily note for John Doe', time: '5 mins ago', color: 'from-emerald-600 to-teal-500', icon: FileText },
                { type: 'med', user: 'Michael Chen', action: 'Administered medication to Jane Smith', time: '12 mins ago', color: 'from-green-400 to-emerald-500', icon: Pill },
                { type: 'incident', user: 'Lisa Brown', action: 'Filed incident report #IR-2847', time: '23 mins ago', color: 'from-yellow-500 to-orange-500', icon: AlertCircle },
                { type: 'goal', user: 'David Miller', action: 'Updated ISP goals for Robert Lee', time: '1 hour ago', color: 'from-lime-500 to-green-600', icon: CheckCircle },
                { type: 'hcbs', user: 'Emma Wilson', action: 'Logged community outing activity', time: '2 hours ago', color: 'from-teal-500 to-emerald-600', icon: MapPin },
                { type: 'note', user: 'Alex Davis', action: 'Created new assessment for Sarah White', time: '3 hours ago', color: 'from-emerald-600 to-teal-500', icon: FileText },
                { type: 'med', user: 'Jennifer Taylor', action: 'Updated medication schedule for Tom Brown', time: '4 hours ago', color: 'from-green-400 to-emerald-500', icon: Pill },
                { type: 'incident', user: 'William Anderson', action: 'Resolved incident #IR-2846', time: '5 hours ago', color: 'from-yellow-500 to-orange-500', icon: AlertCircle },
                { type: 'goal', user: 'Jessica Martinez', action: 'Completed quarterly review for Mike Davis', time: '6 hours ago', color: 'from-lime-500 to-green-600', icon: CheckCircle },
                { type: 'hcbs', user: 'Christopher Lee', action: 'Scheduled transportation for medical appointment', time: '7 hours ago', color: 'from-teal-500 to-emerald-600', icon: MapPin },
              ].map((activity, idx) => {
                const ActivityIcon = activity.icon;
                return (
                  <div key={idx} className="group flex items-start gap-4 p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/60 transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-emerald-500/30">
                    <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <ActivityIcon className="text-white" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{activity.user}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{activity.action}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Clock size={14} className="text-slate-500" />
                      <span className="text-slate-500 text-xs font-medium">{activity.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Alerts</h3>
            </div>
            {/* ScrollArea for alerts */}
            <ScrollArea className="h-[150px]">
              <div className="space-y-3">
                <div className="group flex items-start gap-3 p-4 bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl hover:border-red-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <AlertTriangle className="text-red-400 flex-shrink-0 group-hover:scale-110 transition-all" size={20} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">Training Expiring Soon</p>
                    <p className="text-slate-400 text-xs mt-1">3 staff members need renewal</p>
                  </div>
                  <ChevronRight className="text-red-400 opacity-0 group-hover:opacity-100 transition-all" size={16} />
                </div>
                <div className="group flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <AlertCircle className="text-yellow-400 flex-shrink-0 group-hover:scale-110 transition-all" size={20} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">Missing Documentation</p>
                    <p className="text-slate-400 text-xs mt-1">2 goals pending review</p>
                  </div>
                  <ChevronRight className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-all" size={16} />
                </div>
                <div className="group flex items-start gap-3 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <Bell className="text-blue-400 flex-shrink-0 group-hover:scale-110 transition-all" size={20} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">New Message</p>
                    <p className="text-slate-400 text-xs mt-1">From Dr. Smith regarding John Doe</p>
                  </div>
                  <ChevronRight className="text-blue-400 opacity-0 group-hover:opacity-100 transition-all" size={16} />
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-green-900/30 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-white" size={20} />
                </div>
                <h3 className="text-white font-bold text-lg">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Med Compliance', value: '99.2%', color: 'from-lime-500 to-green-600' },
                  { label: 'Staff On Duty', value: '42', color: 'from-emerald-600 to-teal-500' },
                  { label: 'Community Outings', value: '23 Today', color: 'from-green-400 to-emerald-500' },
                ].map((stat, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-300 text-sm font-medium">{stat.label}</span>
                      <span className="text-white font-bold text-lg">{stat.value}</span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full group-hover:animate-pulse transition-all duration-500`} style={{width: '85%'}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-lime-900/20 via-green-900/20 to-emerald-900/20 border border-lime-500/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <Award className="text-white animate-pulse" size={28} />
              </div>
              <div>
                <p className="text-lime-400 text-xs font-bold uppercase tracking-wide mb-1">Achievement Unlocked</p>
                <p className="text-white font-bold">100% Compliance Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const IndividualsPage = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 mb-2">
            Individuals
          </h2>
          <p className="text-slate-400 text-lg">Manage client profiles and care plans</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105">
          <Plus size={18} />
          Add Individual
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-slate-900/50 rounded-xl px-5 py-3 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group">
            <Search size={20} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, ID, or home..." 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-800 text-white rounded-xl px-5 py-3 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 font-semibold">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* ScrollArea for individuals table */}
        <ScrollArea className="h-[500px] rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Individual</th>
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Location</th>
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Last Activity</th>
                <th className="text-left py-4 px-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'John Doe', id: 'IND-001', home: 'Oak Ridge Home', status: 'Active', lastNote: '2h ago', color: 'from-emerald-600 to-teal-500', compliance: 98 },
                { name: 'Jane Smith', id: 'IND-002', home: 'Maple House', status: 'Active', lastNote: '5h ago', color: 'from-green-400 to-emerald-500', compliance: 95 },
                { name: 'Robert Lee', id: 'IND-003', home: 'Cedar Villa', status: 'Active', lastNote: '1d ago', color: 'from-lime-500 to-green-600', compliance: 100 },
                { name: 'Mary Johnson', id: 'IND-004', home: 'Oak Ridge Home', status: 'Active', lastNote: '3h ago', color: 'from-teal-500 to-emerald-600', compliance: 92 },
                { name: 'Michael Brown', id: 'IND-005', home: 'Maple House', status: 'Review', lastNote: '1w ago', color: 'from-yellow-500 to-orange-500', compliance: 78 },
                { name: 'Sarah Wilson', id: 'IND-006', home: 'Pine Grove', status: 'Active', lastNote: '4h ago', color: 'from-emerald-600 to-teal-500', compliance: 96 },
                { name: 'David Davis', id: 'IND-007', home: 'Oak Ridge Home', status: 'Active', lastNote: '6h ago', color: 'from-green-400 to-emerald-500', compliance: 89 },
                { name: 'Lisa Anderson', id: 'IND-008', home: 'Cedar Villa', status: 'Active', lastNote: '2d ago', color: 'from-lime-500 to-green-600', compliance: 94 },
                { name: 'James Taylor', id: 'IND-009', home: 'Maple House', status: 'Active', lastNote: '1h ago', color: 'from-teal-500 to-emerald-600', compliance: 97 },
                { name: 'Emma White', id: 'IND-010', home: 'Pine Grove', status: 'Review', lastNote: '3d ago', color: 'from-yellow-500 to-orange-500', compliance: 82 },
                { name: 'Robert Martinez', id: 'IND-011', home: 'Oak Ridge Home', status: 'Active', lastNote: '8h ago', color: 'from-emerald-600 to-teal-500', compliance: 91 },
                { name: 'Jennifer Lee', id: 'IND-012', home: 'Cedar Villa', status: 'Active', lastNote: '12h ago', color: 'from-green-400 to-emerald-500', compliance: 98 },
                { name: 'William Clark', id: 'IND-013', home: 'Maple House', status: 'Active', lastNote: '5h ago', color: 'from-lime-500 to-green-600', compliance: 95 },
                { name: 'Maria Rodriguez', id: 'IND-014', home: 'Pine Grove', status: 'Active', lastNote: '1d ago', color: 'from-teal-500 to-emerald-600', compliance: 93 },
                { name: 'Thomas Lewis', id: 'IND-015', home: 'Oak Ridge Home', status: 'Review', lastNote: '2w ago', color: 'from-yellow-500 to-orange-500', compliance: 76 },
              ].map((individual, idx) => (
                <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-900/50 transition-all duration-300 group cursor-pointer">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${individual.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        {individual.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-semibold group-hover:text-emerald-400 transition-colors">{individual.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full bg-slate-700 rounded-full h-1.5 w-20">
                            <div className={`h-full rounded-full ${individual.compliance >= 95 ? 'bg-lime-500' : individual.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${individual.compliance}%`}}></div>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{individual.compliance}%</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-slate-300 font-mono text-sm">{individual.id}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-emerald-400" />
                      <span className="text-slate-300 text-sm">{individual.home}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${individual.status === 'Active' ? 'bg-green-900/30 text-green-400 border-green-500/50' : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50'}`}>
                      {individual.status}
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-500" />
                      <span className="text-slate-400 text-sm">{individual.lastNote}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <button className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm group-hover:scale-105 transition-all">
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm">Showing <span className="text-white font-semibold">15</span> of <span className="text-white font-semibold">156</span> individuals</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-slate-700">
              Previous
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <div className="flex">
        <Sidebar />
        {/* ScrollArea for main content */}
        <ScrollArea className="flex-1">
          <main className="p-6 lg:p-8 overflow-x-hidden min-h-screen">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'individuals' && <IndividualsPage />}
            {currentPage !== 'dashboard' && currentPage !== 'individuals' && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl shadow-emerald-500/50">
                    <Settings className="text-white" size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">Coming Soon</h3>
                  <p className="text-slate-400 text-lg">This module is under development</p>
                </div>
              </div>
            )}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CareBridgePro;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Users,
  Shield,
  FolderOpen,
  BarChart3,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Save,
  Code,
  Cloud,
  Share2,
  Eye,
  Clock
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    projects: true,
    admin: user?.role === 'admin'
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Reporting', href: '/reporting', icon: BarChart3 },
    { name: 'Metrics', href: '/metrics', icon: BarChart3 },
  ];

  const projectNavigation = [
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Backlog', href: '/backlog', icon: Clock },
  ];

  const adminNavigation = [
    { name: 'User Management', href: '/admin', icon: Users },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  const NavigationSection = ({ title, items, sectionKey, icon: SectionIcon }) => (
    <div className="mb-6">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
      >
        <div className="flex items-center">
          {SectionIcon && <SectionIcon className="h-4 w-4 mr-2" />}
          <span className="uppercase tracking-wide">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {expandedSections[sectionKey] && (
        <nav className="mt-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentPath(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-6 py-2 text-sm font-medium rounded-l-md transition-colors`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
                {(item.name === 'Reporting' || item.name === 'Metrics') && (
                  <span className="text-xs text-gray-400 ml-2">Coming Soon</span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TN</span>
                </div>
                <h1 className="ml-2 text-xl font-bold text-gray-900">TaskNestle</h1>
              </div>
            </div>
            <div className="mt-6 px-3">
              <NavigationSection
                title="Main"
                items={mainNavigation}
                sectionKey="main"
                icon={BarChart3}
              />
              <NavigationSection
                title="Projects"
                items={projectNavigation}
                sectionKey="projects"
                icon={FolderOpen}
              />
              {user?.role === 'admin' && (
                <NavigationSection
                  title="Admin"
                  items={adminNavigation}
                  sectionKey="admin"
                  icon={Shield}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          {/* Logo */}
          <div className="flex items-center px-4 py-4 border-b border-gray-200">
            <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">TN</span>
            </div>
            <h1 className="ml-2 text-xl font-bold text-gray-900">TaskNestle</h1>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
            <div className="px-3 space-y-6">
              <NavigationSection
                title="Main"
                items={mainNavigation}
                sectionKey="main"
                icon={BarChart3}
              />
              
              <NavigationSection
                title="Projects"
                items={projectNavigation}
                sectionKey="projects"
                icon={FolderOpen}
              />
              
              {user?.role === 'admin' && (
                <NavigationSection
                  title="Admin"
                  items={adminNavigation}
                  sectionKey="admin"
                  icon={Shield}
                />
              )}
            </div>
          </div>

          {/* User section */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          {/* Mobile menu button */}
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Top bar content */}
          <div className="flex-1 px-4 flex justify-between items-center">
            {/* Left side - Brand */}
            <div className="flex items-center">
              <div className="flex items-center text-lg font-semibold text-gray-900">
                TaskNestle
              </div>
            </div>
            
            {/* Right side - Notifications and user menu */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User menu */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
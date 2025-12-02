import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Car,
  Calendar,
  DollarSign,
  User,
  ArrowLeft,
  Bell,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/host/dashboard'
  },
  {
    id: 'listings',
    label: 'Listings',
    icon: Car,
    path: '/host/parking/manage'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    path: '/host/bookings'
  },
  {
    id: 'earnings',
    label: 'Earnings',
    icon: DollarSign,
    path: '/host/earnings'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/host/profile'
  }
];

interface HostLayoutProps {
  children?: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
}

export const HostLayout: React.FC<HostLayoutProps> = ({
  children,
  showBackButton = true,
  title = 'ParkConnect Host',
  showHeader = true,
  showBottomNav = true
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Update active tab based on current route
  useEffect(() => {
    const currentItem = navItems.find(item =>
      location.pathname.startsWith(item.path)
    );
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [location.pathname]);

  const handleBack = () => {
    // Custom back navigation logic
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // If we're in a sub-page, go back to parent
    if (pathSegments.length > 2) {
      const parentPath = '/' + pathSegments.slice(0, -1).join('/');
      navigate(parentPath);
    } else {
      // If we're at a main tab, stay on the current tab
      // Don't navigate away from the host app
      console.log('Already at main host page');
    }
  };

  const getPageTitle = () => {
    if (title !== 'ParkConnect Host') return title;

    const currentItem = navItems.find(item =>
      location.pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.label : 'ParkConnect Host';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Mobile First */}
      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Left side - Back button or Logo */}
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-gray-500">Host Portal</p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100 relative"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge - can be made dynamic */}
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  2
                </Badge>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children || <Outlet />}
      </main>

      {/* Bottom Navigation - Mobile First */}
      {showBottomNav && (
        <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-40 md:hidden">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="relative">
                    <Icon className={cn(
                      "h-5 w-5 mb-1 transition-transform duration-200",
                      isActive && "scale-110"
                    )} />
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                      >
                        {item.badge > 99 ? '99+' : item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    isActive ? "text-primary" : "text-gray-600"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Desktop Sidebar (Hidden on mobile, shown on md+) */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">ParkConnect</h2>
              <p className="text-sm text-gray-600">Host Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop content adjustment */}
      <div className="hidden md:block md:ml-64">
        {/* Content spacing for desktop sidebar */}
      </div>
    </div>
  );
};

export default HostLayout;

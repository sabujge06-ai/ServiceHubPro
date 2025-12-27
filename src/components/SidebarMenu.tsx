import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Package,
  Wallet,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface SidebarMenuProps {
  isAdmin?: boolean;
}

export function SidebarMenu({ isAdmin = false }: SidebarMenuProps) {
  const location = useLocation();
  const { logout, user, admin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Services', path: '/dashboard/services' },
    { icon: FileText, label: 'Subscriptions', path: '/dashboard/subscriptions' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const adminMenuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Package, label: 'Services', path: '/admin/services' },
    { icon: FileText, label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: Wallet, label: 'Payment Channels', path: '/admin/payment-channels' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen border-r border-border bg-card flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className={cn(
            'rounded-xl flex items-center justify-center transition-all',
            isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-primary',
            collapsed ? 'w-8 h-8' : 'w-10 h-10'
          )}>
            {isAdmin ? (
              <Shield className={cn('text-primary-foreground', collapsed ? 'w-4 h-4' : 'w-5 h-5')} />
            ) : (
              <Zap className={cn('text-primary-foreground', collapsed ? 'w-4 h-4' : 'w-5 h-5')} />
            )}
          </div>
          {!collapsed && (
            <span className={cn(
              'text-lg font-display font-bold',
              isAdmin ? 'text-amber-500' : 'gradient-text'
            )}>
              {isAdmin ? 'Admin Panel' : 'ServiceHub'}
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
              isAdmin ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'
            )}>
              {isAdmin ? admin?.email?.[0].toUpperCase() : user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isAdmin ? 'Administrator' : user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? admin?.email : user?.email}
              </p>
            </div>
          </div>
          {!isAdmin && user && (
            <div className="mt-3 p-2 rounded-lg bg-accent/50">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p className="text-lg font-bold text-primary">৳{user.balance.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? isAdmin
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    collapsed && 'justify-center'
                  )}
                >
                  <item.icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-5 h-5')} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-2')}>
          <ThemeToggle />
          {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
        </div>
        <Button
          variant="ghost"
          className={cn(
            'text-destructive hover:text-destructive hover:bg-destructive/10',
            collapsed ? 'w-full justify-center p-2' : 'w-full justify-start'
          )}
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-card shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  );
}

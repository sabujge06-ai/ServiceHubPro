import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Package,
  CreditCard,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Balance',
      value: `৳${user?.balance?.toFixed(2) || '0.00'}`,
      description: 'Available balance',
      icon: Wallet,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Services Used',
      value: '24',
      description: 'This month',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Subscription',
      value: 'Basic',
      description: '12 days remaining',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Total Payments',
      value: '৳2,450',
      description: 'Lifetime',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentActivity = [
    { type: 'service', name: 'API Access', cost: 5, time: '2 hours ago', status: 'completed' },
    { type: 'payment', name: 'Added Balance', cost: 500, time: '1 day ago', status: 'approved' },
    { type: 'service', name: 'Data Export', cost: 5, time: '2 days ago', status: 'completed' },
    { type: 'subscription', name: 'Basic Plan', cost: 149, time: '5 days ago', status: 'active' },
  ];

  const quickActions = [
    { title: 'Use Service', description: 'Access available services', icon: Zap, href: '/dashboard/services' },
    { title: 'Add Payment', description: 'Top up your balance', icon: CreditCard, href: '/dashboard/payments' },
    { title: 'Buy Subscription', description: 'View subscription plans', icon: FileText, href: '/dashboard/subscriptions' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {user?.is_email_verified ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Email Verified
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
              <AlertCircle className="w-4 h-4" />
              Verify Email
            </div>
          )}
          {user?.is_user_active ? (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
              <Clock className="w-4 h-4" />
              Pending Activation
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-4 hover:bg-accent group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <action.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and usage</CardDescription>
            </div>
            <Link to="/dashboard/payments">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'service' ? 'bg-blue-500/20 text-blue-500' :
                      activity.type === 'payment' ? 'bg-emerald-500/20 text-emerald-500' :
                      'bg-purple-500/20 text-purple-500'
                    }`}>
                      {activity.type === 'service' ? <Package className="w-5 h-5" /> :
                       activity.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
                       <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${activity.type === 'payment' ? 'text-success' : ''}`}>
                      {activity.type === 'payment' ? '+' : '-'}৳{activity.cost}
                    </p>
                    <p className={`text-xs capitalize ${
                      activity.status === 'completed' || activity.status === 'approved' || activity.status === 'active'
                        ? 'text-success'
                        : 'text-warning'
                    }`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

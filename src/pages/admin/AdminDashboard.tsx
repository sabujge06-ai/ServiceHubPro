import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Package,
  FileText,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      description: 'from last month',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Subscriptions',
      value: '1,234',
      change: '+8%',
      description: 'from last month',
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Total Revenue',
      value: '৳4,56,789',
      change: '+23%',
      description: 'from last month',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Pending Payments',
      value: '45',
      change: '',
      description: 'requires action',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@gmail.com', status: 'pending', created_at: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', status: 'active', created_at: '5 hours ago' },
    { id: 3, name: 'Bob Johnson', email: 'bob@gmail.com', status: 'pending', created_at: '1 day ago' },
    { id: 4, name: 'Alice Brown', email: 'alice@gmail.com', status: 'active', created_at: '2 days ago' },
  ];

  const pendingPayments = [
    { id: 1, user: 'John Doe', amount: 500, channel: 'bKash', transaction_id: 'TXN123456' },
    { id: 2, user: 'Jane Smith', amount: 1000, channel: 'Nagad', transaction_id: 'TXN789012' },
    { id: 3, user: 'Bob Johnson', amount: 250, channel: 'Rocket', transaction_id: 'TXN345678' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-amber-500">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to the ServiceHub admin panel. Here's an overview of your platform.
        </p>
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
                  <div className="flex items-center gap-1 mt-1">
                    {stat.change && (
                      <span className="text-xs text-success flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                Recent Users
              </CardTitle>
              <CardDescription>Newly registered users</CardDescription>
            </div>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-medium">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{user.created_at}</span>
                    {user.status === 'active' ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Payments
              </CardTitle>
              <CardDescription>Payments awaiting approval</CardDescription>
            </div>
            <Link to="/admin/payments">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.user}</p>
                      <p className="text-sm text-muted-foreground">{payment.channel} • {payment.transaction_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">৳{payment.amount}</p>
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" variant="success" className="h-7 text-xs">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 text-xs">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:border-amber-500 hover:text-amber-500">
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link to="/admin/services">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:border-amber-500 hover:text-amber-500">
                <Package className="w-6 h-6" />
                <span>Manage Services</span>
              </Button>
            </Link>
            <Link to="/admin/payments">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:border-amber-500 hover:text-amber-500">
                <CreditCard className="w-6 h-6" />
                <span>Review Payments</span>
              </Button>
            </Link>
            <Link to="/admin/subscriptions">
              <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:border-amber-500 hover:text-amber-500">
                <FileText className="w-6 h-6" />
                <span>Subscriptions</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

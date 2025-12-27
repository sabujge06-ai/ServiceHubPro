import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, Users, TrendingUp } from 'lucide-react';

const subscriptionsData = [
  { id: 1, name: 'Starter', duration_days: 7, price: 79, is_active: true, subscribers: 45 },
  { id: 2, name: 'Basic', duration_days: 15, price: 149, is_active: true, subscribers: 234 },
  { id: 3, name: 'Brins', duration_days: 30, price: 299, is_active: true, subscribers: 156 },
  { id: 4, name: 'Advanced', duration_days: 45, price: 399, is_active: true, subscribers: 89 },
  { id: 5, name: 'Pro', duration_days: 60, price: 499, is_active: true, subscribers: 67 },
  { id: 6, name: 'Ultimate', duration_days: 90, price: 699, is_active: true, subscribers: 34 },
];

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(subscriptionsData);
  const { toast } = useToast();

  const handleToggle = async (subId: number) => {
    setSubscriptions(subscriptions.map((s) => 
      s.id === subId ? { ...s, is_active: !s.is_active } : s
    ));
    const sub = subscriptions.find((s) => s.id === subId);
    toast({
      title: 'Subscription Updated',
      description: `${sub?.name} plan has been ${sub?.is_active ? 'deactivated' : 'activated'}.`,
    });
  };

  const totalRevenue = subscriptions.reduce((acc, s) => acc + (s.price * s.subscribers), 0);
  const totalSubscribers = subscriptions.reduce((acc, s) => acc + s.subscribers, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-amber-500">Subscription Plans</h1>
        <p className="text-muted-foreground mt-1">
          Manage subscription plans and view statistics.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Plans</p>
              <p className="text-2xl font-display font-bold">{subscriptions.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Subscribers</p>
              <p className="text-2xl font-display font-bold text-success">{totalSubscribers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-display font-bold text-primary">৳{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className={`glass-card transition-all duration-300 ${!sub.is_active ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-display text-xl">{sub.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {sub.duration_days} days
                  </CardDescription>
                </div>
                <Switch
                  checked={sub.is_active}
                  onCheckedChange={() => handleToggle(sub.id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-display font-bold">৳{sub.price}</p>
                  <p className="text-sm text-muted-foreground">per subscription</p>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Price per day</span>
                    <span className="font-medium">৳{(sub.price / sub.duration_days).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active subscribers</span>
                    <span className="font-medium">{sub.subscribers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-success">৳{(sub.price * sub.subscribers).toLocaleString()}</span>
                </div>

                <Badge className={sub.is_active ? 'bg-success/20 text-success border-0 w-full justify-center' : 'bg-muted text-muted-foreground border-0 w-full justify-center'}>
                  {sub.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle2, Star, Loader2, Crown, Zap, Calendar } from 'lucide-react';

const subscriptions = [
  { id: 1, name: 'Starter', duration_days: 7, price: 79, is_active: true },
  { id: 2, name: 'Basic', duration_days: 15, price: 149, is_active: true, popular: true },
  { id: 3, name: 'Brins', duration_days: 30, price: 299, is_active: true },
  { id: 4, name: 'Advanced', duration_days: 45, price: 399, is_active: true },
  { id: 5, name: 'Pro', duration_days: 60, price: 499, is_active: true },
  { id: 6, name: 'Ultimate', duration_days: 90, price: 699, is_active: true },
];

const features = [
  'Unlimited service access',
  'No per-use charges',
  'Priority support',
  'Advanced analytics',
];

export function Subscriptions() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBuySubscription = async (sub: typeof subscriptions[0]) => {
    if (user && user.balance < sub.price) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ৳${sub.price - user.balance} more to purchase this plan.`,
        variant: 'destructive',
      });
      return;
    }

    setLoadingId(sub.id);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: 'Subscription Activated!',
        description: `You have successfully subscribed to ${sub.name} plan for ${sub.duration_days} days.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to purchase subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Mock current subscription
  const currentSubscription = {
    name: 'Basic',
    end_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    days_remaining: 12,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Choose a subscription plan for unlimited service access.
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <Card className="glass-card border-primary/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Crown className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-display font-bold">{currentSubscription.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-3xl font-display font-bold text-primary">{currentSubscription.days_remaining}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Expires On</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(currentSubscription.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            All Plans Include
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <Card
            key={sub.id}
            className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
              sub.popular
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'glass-card'
            }`}
          >
            {sub.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Popular
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-display text-xl">{sub.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {sub.duration_days} days access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-display font-bold">৳{sub.price}</span>
                <span className="text-muted-foreground">/plan</span>
              </div>

              <div className="mb-6 p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Price per day</p>
                <p className="text-lg font-semibold text-primary">
                  ৳{(sub.price / sub.duration_days).toFixed(2)}
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={sub.popular ? 'gradient' : 'outline'}
                className="w-full"
                disabled={loadingId === sub.id}
                onClick={() => handleBuySubscription(sub)}
              >
                {loadingId === sub.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Zap,
  Database,
  Cloud,
  Shield,
  Cpu,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const services = [
  {
    id: 1,
    name: 'API Access',
    description: 'Access our RESTful API endpoints for data integration',
    icon: Globe,
    cost: 5,
    is_active: true,
  },
  {
    id: 2,
    name: 'Data Export',
    description: 'Export your data in various formats (CSV, JSON, XML)',
    icon: Database,
    cost: 5,
    is_active: true,
  },
  {
    id: 3,
    name: 'Cloud Storage',
    description: 'Secure cloud storage for your files and documents',
    icon: Cloud,
    cost: 5,
    is_active: true,
  },
  {
    id: 4,
    name: 'Security Scan',
    description: 'Comprehensive security analysis of your data',
    icon: Shield,
    cost: 5,
    is_active: true,
  },
  {
    id: 5,
    name: 'AI Processing',
    description: 'Advanced AI-powered data processing and insights',
    icon: Cpu,
    cost: 5,
    is_active: false,
  },
  {
    id: 6,
    name: 'Quick Access',
    description: 'Priority access with reduced wait times',
    icon: Zap,
    cost: 5,
    is_active: true,
  },
];

export function Services() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const canUseService = user?.is_user_active && user?.is_email_verified && (user?.balance >= 5 || false);

  const handleUseService = async (serviceId: number, serviceName: string) => {
    if (!canUseService) {
      toast({
        title: 'Cannot use service',
        description: user?.balance < 5
          ? 'Insufficient balance. Please add funds or subscribe to a plan.'
          : 'Your account needs to be active and verified.',
        variant: 'destructive',
      });
      return;
    }

    setLoadingId(serviceId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: 'Service Used Successfully',
        description: `You have used ${serviceName}. ৳5 has been deducted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to use service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Services</h1>
        <p className="text-muted-foreground mt-1">
          Access and use available services. Each service costs ৳5 per use.
        </p>
      </div>

      {/* Status Alert */}
      {!canUseService && (
        <Card className="border-warning/50 bg-warning/10">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertCircle className="w-6 h-6 text-warning shrink-0" />
            <div>
              <p className="font-medium text-warning">Action Required</p>
              <p className="text-sm text-muted-foreground">
                {!user?.is_email_verified && 'Please verify your email. '}
                {!user?.is_user_active && 'Your account is pending activation. '}
                {user?.balance < 5 && 'Insufficient balance. Add funds or subscribe to a plan.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance Info */}
      <Card className="glass-card">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-display font-bold">৳{user?.balance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Service Cost</p>
            <p className="text-xl font-semibold text-primary">৳5 / use</p>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`glass-card overflow-hidden transition-all duration-300 hover:shadow-lg ${
              !service.is_active ? 'opacity-60' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  service.is_active ? 'bg-gradient-primary' : 'bg-muted'
                }`}>
                  <service.icon className={`w-6 h-6 ${service.is_active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                {service.is_active ? (
                  <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <CardTitle className="font-display mt-4">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Cost per use</span>
                <span className="text-lg font-bold text-primary">৳{service.cost}</span>
              </div>
              <Button
                variant={service.is_active ? 'gradient' : 'secondary'}
                className="w-full"
                disabled={!service.is_active || !canUseService || loadingId === service.id}
                onClick={() => handleUseService(service.id, service.name)}
              >
                {loadingId === service.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : service.is_active ? (
                  'Use Service'
                ) : (
                  'Unavailable'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Package,
  Zap,
  Database,
  Cloud,
  Shield,
  Cpu,
  Globe,
} from 'lucide-react';

const servicesData = [
  { id: 1, name: 'API Access', icon: Globe, is_active: true, usage_count: 1250 },
  { id: 2, name: 'Data Export', icon: Database, is_active: true, usage_count: 890 },
  { id: 3, name: 'Cloud Storage', icon: Cloud, is_active: true, usage_count: 567 },
  { id: 4, name: 'Security Scan', icon: Shield, is_active: true, usage_count: 234 },
  { id: 5, name: 'AI Processing', icon: Cpu, is_active: false, usage_count: 0 },
  { id: 6, name: 'Quick Access', icon: Zap, is_active: true, usage_count: 1890 },
];

export function AdminServices() {
  const [services, setServices] = useState(servicesData);
  const { toast } = useToast();

  const handleToggle = async (serviceId: number) => {
    setServices(services.map((s) => 
      s.id === serviceId ? { ...s, is_active: !s.is_active } : s
    ));
    const service = services.find((s) => s.id === serviceId);
    toast({
      title: 'Service Updated',
      description: `${service?.name} has been ${service?.is_active ? 'deactivated' : 'activated'}.`,
    });
  };

  const activeCount = services.filter((s) => s.is_active).length;
  const totalUsage = services.reduce((acc, s) => acc + s.usage_count, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-amber-500">Service Management</h1>
        <p className="text-muted-foreground mt-1">
          Enable or disable services available to users.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Services</p>
              <p className="text-2xl font-display font-bold">{services.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Services</p>
              <p className="text-2xl font-display font-bold text-success">{activeCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Usage</p>
              <p className="text-2xl font-display font-bold">{totalUsage.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className={`glass-card transition-all duration-300 ${!service.is_active ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.is_active ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-muted'}`}>
                  <service.icon className={`w-6 h-6 ${service.is_active ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <Switch
                  checked={service.is_active}
                  onCheckedChange={() => handleToggle(service.id)}
                />
              </div>
              <CardTitle className="font-display mt-4">{service.name}</CardTitle>
              <CardDescription>
                Cost: ৳5 per use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Usage</p>
                  <p className="text-xl font-semibold">{service.usage_count.toLocaleString()}</p>
                </div>
                <Badge className={service.is_active ? 'bg-success/20 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  CreditCard,
  Loader2,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { z } from 'zod';

const paymentSchema = z.object({
  channel_id: z.string().min(1, 'Please select a payment channel'),
  transaction_id: z.string().min(5, 'Transaction ID must be at least 5 characters').max(100, 'Transaction ID is too long'),
  amount: z.number().min(50, 'Minimum amount is ৳50').max(50000, 'Maximum amount is ৳50,000'),
});

const paymentChannels = [
  { id: 1, name: 'bKash', is_active: true },
  { id: 2, name: 'Nagad', is_active: true },
  { id: 3, name: 'Rocket', is_active: true },
  { id: 4, name: 'Bank Transfer', is_active: true },
];

const paymentHistory = [
  { id: 1, transaction_id: 'TXN123456', channel: 'bKash', amount: 500, status: 'approved', created_at: '2024-01-20T10:30:00' },
  { id: 2, transaction_id: 'TXN789012', channel: 'Nagad', amount: 1000, status: 'pending', created_at: '2024-01-19T14:45:00' },
  { id: 3, transaction_id: 'TXN345678', channel: 'Rocket', amount: 250, status: 'rejected', reject_reason: 'Invalid transaction ID', created_at: '2024-01-18T09:15:00' },
  { id: 4, transaction_id: 'TXN901234', channel: 'bKash', amount: 800, status: 'approved', created_at: '2024-01-17T16:20:00' },
];

export function Payments() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    channel_id: '',
    transaction_id: '',
    amount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = paymentSchema.safeParse({
      ...formData,
      amount: Number(formData.amount),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: 'Payment Submitted',
        description: 'Your payment is pending admin approval.',
      });
      setIsOpen(false);
      setFormData({ channel_id: '', transaction_id: '', amount: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-warning/10 text-warning';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Add funds to your account and view payment history.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="w-4 h-4" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add Payment</DialogTitle>
              <DialogDescription>
                Submit your payment details for admin approval.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Channel</Label>
                <Select
                  value={formData.channel_id}
                  onValueChange={(value) => setFormData({ ...formData, channel_id: value })}
                >
                  <SelectTrigger className={errors.channel_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentChannels.filter(c => c.is_active).map((channel) => (
                      <SelectItem key={channel.id} value={channel.id.toString()}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.channel_id && <p className="text-sm text-destructive">{errors.channel_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction_id">Transaction ID</Label>
                <Input
                  id="transaction_id"
                  placeholder="Enter transaction ID from your payment"
                  value={formData.transaction_id}
                  onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                  className={errors.transaction_id ? 'border-destructive' : ''}
                />
                {errors.transaction_id && <p className="text-sm text-destructive">{errors.transaction_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (৳)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={errors.amount ? 'border-destructive' : ''}
                />
                {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
              </div>

              <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimum amount: ৳50</li>
                  <li>Payment will be reviewed by admin</li>
                  <li>Duplicate transaction IDs will be rejected</li>
                </ul>
              </div>

              <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Payment'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Card */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-display font-bold">৳{user?.balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <ArrowDownLeft className="w-5 h-5 text-success mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Total Added</p>
                <p className="font-semibold text-success">৳2,550</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10">
                <ArrowUpRight className="w-5 h-5 text-destructive mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-semibold text-destructive">৳1,320</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment History
          </CardTitle>
          <CardDescription>View all your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.channel}</p>
                    <p className="text-sm text-muted-foreground">{payment.transaction_id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-success">+৳{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

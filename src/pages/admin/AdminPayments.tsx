import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const paymentsData = [
  { id: 1, user: 'John Doe', email: 'john@gmail.com', channel: 'bKash', transaction_id: 'TXN123456', amount: 500, status: 'pending', created_at: '2024-01-20T10:30:00' },
  { id: 2, user: 'Jane Smith', email: 'jane@gmail.com', channel: 'Nagad', transaction_id: 'TXN789012', amount: 1000, status: 'pending', created_at: '2024-01-19T14:45:00' },
  { id: 3, user: 'Bob Johnson', email: 'bob@gmail.com', channel: 'Rocket', transaction_id: 'TXN345678', amount: 250, status: 'approved', created_at: '2024-01-18T09:15:00' },
  { id: 4, user: 'Alice Brown', email: 'alice@gmail.com', channel: 'bKash', transaction_id: 'TXN901234', amount: 800, status: 'rejected', reject_reason: 'Invalid transaction ID', created_at: '2024-01-17T16:20:00' },
  { id: 5, user: 'Charlie Wilson', email: 'charlie@gmail.com', channel: 'Bank Transfer', transaction_id: 'TXN567890', amount: 2000, status: 'pending', created_at: '2024-01-16T11:00:00' },
];

export function AdminPayments() {
  const [payments, setPayments] = useState(paymentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; paymentId: number | null }>({ open: false, paymentId: null });
  const [rejectReason, setRejectReason] = useState('');
  const { toast } = useToast();

  const filteredPayments = payments.filter(
    (payment) =>
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const handleApprove = async (paymentId: number) => {
    setLoadingId(paymentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPayments(payments.map((p) => (p.id === paymentId ? { ...p, status: 'approved' } : p)));
      toast({
        title: 'Payment Approved',
        description: 'The payment has been approved and balance added.',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.paymentId || !rejectReason.trim()) return;
    
    setLoadingId(rejectDialog.paymentId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPayments(payments.map((p) => 
        p.id === rejectDialog.paymentId 
          ? { ...p, status: 'rejected', reject_reason: rejectReason } 
          : p
      ));
      toast({
        title: 'Payment Rejected',
        description: 'The payment has been rejected.',
        variant: 'destructive',
      });
      setRejectDialog({ open: false, paymentId: null });
      setRejectReason('');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-success/20 text-success border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive/20 text-destructive border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-warning/20 text-warning border-0">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-amber-500">Payment Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve user payment requests.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 text-warning">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">{pendingCount} pending payments</span>
          </div>
        )}
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user name or transaction ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            All Payments
          </CardTitle>
          <CardDescription>Approve or reject payment requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.user}</p>
                        <p className="text-sm text-muted-foreground">{payment.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.channel}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-success">৳{payment.amount}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            disabled={loadingId === payment.id}
                            onClick={() => handleApprove(payment.id)}
                          >
                            {loadingId === payment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={loadingId === payment.id}
                            onClick={() => setRejectDialog({ open: true, paymentId: payment.id })}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : payment.status === 'rejected' ? (
                        <span className="text-sm text-muted-foreground italic">
                          {payment.reject_reason}
                        </span>
                      ) : (
                        <span className="text-sm text-success">Completed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectDialog({ open: false, paymentId: null })}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!rejectReason.trim() || loadingId !== null}
                onClick={handleReject}
              >
                {loadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Reject Payment'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

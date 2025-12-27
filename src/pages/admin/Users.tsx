import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users as UsersIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Shield,
  Loader2,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const usersData = [
  { id: 1, name: 'John Doe', email: 'john@gmail.com', phone: '+880171234567', balance: 500, is_email_verified: true, is_user_active: true, created_at: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', phone: '+880181234567', balance: 1200, is_email_verified: true, is_user_active: false, created_at: '2024-01-18' },
  { id: 3, name: 'Bob Johnson', email: 'bob@gmail.com', phone: '+880191234567', balance: 0, is_email_verified: false, is_user_active: false, created_at: '2024-01-20' },
  { id: 4, name: 'Alice Brown', email: 'alice@gmail.com', phone: '+880151234567', balance: 750, is_email_verified: true, is_user_active: true, created_at: '2024-01-22' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@gmail.com', phone: '+880161234567', balance: 300, is_email_verified: true, is_user_active: true, created_at: '2024-01-23' },
];

export function AdminUsers() {
  const [users, setUsers] = useState(usersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActivate = async (userId: number) => {
    setLoadingId(userId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_user_active: !u.is_user_active } : u)));
      toast({
        title: 'User Updated',
        description: 'User activation status has been changed.',
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleVerify = async (userId: number) => {
    setLoadingId(userId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_user_verified: true } : u)));
      toast({
        title: 'User Verified',
        description: 'User has been manually verified.',
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-amber-500">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all registered users.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total Users:</span>
          <Badge className="bg-amber-500">{users.length}</Badge>
        </div>
      </div>

      {/* Search */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-amber-500" />
            All Users
          </CardTitle>
          <CardDescription>Manage user accounts and verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Email Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-medium">
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell>
                      <span className="font-medium">৳{user.balance}</span>
                    </TableCell>
                    <TableCell>
                      {user.is_email_verified ? (
                        <Badge className="bg-success/20 text-success border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-warning border-warning/50">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.is_user_active ? (
                        <Badge className="bg-success/20 text-success border-0">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={user.is_user_active ? 'destructive' : 'success'}
                          disabled={loadingId === user.id}
                          onClick={() => handleActivate(user.id)}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-1" />
                              {user.is_user_active ? 'Deactivate' : 'Activate'}
                            </>
                          )}
                        </Button>
                        {!user.is_email_verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingId === user.id}
                            onClick={() => handleVerify(user.id)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

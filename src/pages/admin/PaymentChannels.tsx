import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Wallet,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

const channelsData = [
  { id: 1, name: 'bKash', is_active: true },
  { id: 2, name: 'Nagad', is_active: true },
  { id: 3, name: 'Rocket', is_active: true },
  { id: 4, name: 'Bank Transfer', is_active: true },
  { id: 5, name: 'Upay', is_active: false },
];

export function PaymentChannels() {
  const [channels, setChannels] = useState(channelsData);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editChannel, setEditChannel] = useState<typeof channelsData[0] | null>(null);
  const [newChannelName, setNewChannelName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!newChannelName.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newChannel = {
        id: channels.length + 1,
        name: newChannelName.trim(),
        is_active: true,
      };
      setChannels([...channels, newChannel]);
      toast({
        title: 'Channel Added',
        description: `${newChannelName} has been added successfully.`,
      });
      setNewChannelName('');
      setIsAddOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editChannel || !editChannel.name.trim()) return;
    
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setChannels(channels.map((c) => 
        c.id === editChannel.id ? editChannel : c
      ));
      toast({
        title: 'Channel Updated',
        description: 'Payment channel has been updated.',
      });
      setIsEditOpen(false);
      setEditChannel(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (channelId: number) => {
    setChannels(channels.map((c) => 
      c.id === channelId ? { ...c, is_active: !c.is_active } : c
    ));
    const channel = channels.find((c) => c.id === channelId);
    toast({
      title: 'Channel Updated',
      description: `${channel?.name} has been ${channel?.is_active ? 'deactivated' : 'activated'}.`,
    });
  };

  const handleDelete = async (channelId: number) => {
    const channel = channels.find((c) => c.id === channelId);
    setChannels(channels.filter((c) => c.id !== channelId));
    toast({
      title: 'Channel Deleted',
      description: `${channel?.name} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-amber-500">Payment Channels</h1>
          <p className="text-muted-foreground mt-1">
            Manage available payment methods for users.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="w-4 h-4" />
              Add Channel
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add Payment Channel</DialogTitle>
              <DialogDescription>
                Add a new payment method for users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Channel Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., PayPal"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={!newChannelName.trim() || isLoading}
                onClick={handleAdd}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Add Channel'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <Card key={channel.id} className={`glass-card transition-all duration-300 ${!channel.is_active ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${channel.is_active ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-muted'}`}>
                    <Wallet className={`w-6 h-6 ${channel.is_active ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{channel.name}</h3>
                    <p className={`text-sm ${channel.is_active ? 'text-success' : 'text-muted-foreground'}`}>
                      {channel.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={channel.is_active}
                  onCheckedChange={() => handleToggle(channel.id)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditChannel(channel);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(channel.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit Payment Channel</DialogTitle>
            <DialogDescription>
              Update payment channel details.
            </DialogDescription>
          </DialogHeader>
          {editChannel && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Channel Name</Label>
                <Input
                  id="edit-name"
                  value={editChannel.name}
                  onChange={(e) => setEditChannel({ ...editChannel, name: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active">Active Status</Label>
                <Switch
                  id="edit-active"
                  checked={editChannel.is_active}
                  onCheckedChange={(checked) => setEditChannel({ ...editChannel, is_active: checked })}
                />
              </div>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={!editChannel.name.trim() || isLoading}
                onClick={handleEdit}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Users, Building2, UserPlus, Plus, Trash2,
  Edit, Save, X, ChevronDown, ChevronUp, Key, Mail,
  Phone, Shield, Eye, EyeOff, Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UserItem {
  id: string;
  username: string;
  nama: string;
  role: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface Divisi {
  id: string;
  kode: string;
  nama: string;
  deskripsi?: string;
  _count?: { kemandoran: number; tasks: number };
}

interface Kemandoran {
  id: string;
  kode: string;
  nama: string;
  divisiId: string;
  divisi?: Divisi;
  deskripsi?: string;
  _count?: { tasks: number };
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'divisi' | 'kemandoran'>('users');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [kemandoranList, setKemandoranList] = useState<Kemandoran[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // User form state
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    nama: '',
    role: 'user',
    email: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Divisi form state
  const [showDivisiDialog, setShowDivisiDialog] = useState(false);
  const [divisiForm, setDivisiForm] = useState({
    kode: '',
    nama: '',
    deskripsi: '',
  });

  // Kemandoran form state
  const [showKemandoranDialog, setShowKemandoranDialog] = useState(false);
  const [kemandoranForm, setKemandoranForm] = useState({
    kode: '',
    nama: '',
    divisiId: '',
    deskripsi: '',
  });

  // Fetch data
  useEffect(() => {
    fetchUsers();
    fetchDivisi();
    fetchKemandoran();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDivisi = async () => {
    try {
      const res = await fetch('/api/divisi');
      const data = await res.json();
      if (data.success) setDivisiList(data.data);
    } catch (error) {
      console.error('Error fetching divisi:', error);
    }
  };

  const fetchKemandoran = async () => {
    try {
      const res = await fetch('/api/kemandoran');
      const data = await res.json();
      if (data.success) setKemandoranList(data.data);
    } catch (error) {
      console.error('Error fetching kemandoran:', error);
    }
  };

  // User CRUD
  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      const url = editingUser ? `/api/users?id=${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      
      const body = editingUser 
        ? { id: editingUser.id, ...userForm, password: userForm.password || undefined }
        : userForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingUser ? 'User berhasil diupdate' : 'User berhasil dibuat');
        setShowUserDialog(false);
        resetUserForm();
        fetchUsers();
      } else {
        toast.error(data.error || 'Gagal menyimpan user');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('User berhasil dihapus');
        fetchUsers();
      } else {
        toast.error(data.error || 'Gagal menghapus user');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      password: '',
      nama: '',
      role: 'user',
      email: '',
      phone: '',
    });
    setEditingUser(null);
  };

  // Divisi CRUD
  const handleSaveDivisi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/divisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(divisiForm),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Divisi berhasil dibuat');
        setShowDivisiDialog(false);
        setDivisiForm({ kode: '', nama: '', deskripsi: '' });
        fetchDivisi();
      } else {
        toast.error(data.error || 'Gagal menyimpan divisi');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  // Kemandoran CRUD
  const handleSaveKemandoran = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/kemandoran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kemandoranForm),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Kemandoran berhasil dibuat');
        setShowKemandoranDialog(false);
        setKemandoranForm({ kode: '', nama: '', divisiId: '', deskripsi: '' });
        fetchKemandoran();
      } else {
        toast.error(data.error || 'Gagal menyimpan kemandoran');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'users' as const, label: 'Manajemen User', icon: Users },
    { id: 'divisi' as const, label: 'Manajemen Divisi', icon: Building2 },
    { id: 'kemandoran' as const, label: 'Manajemen Kemandoran', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-gray-500">Kelola user, divisi, dan kemandoran</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daftar User</CardTitle>
                    <CardDescription>Kelola pengguna sistem SGS</CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      resetUserForm();
                      setShowUserDialog(true);
                    }}
                    className="sgs-btn-primary"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Tambah User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.nama}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.isActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(user);
                                  setUserForm({
                                    username: user.username,
                                    password: '',
                                    nama: user.nama,
                                    role: user.role,
                                    email: user.email || '',
                                    phone: user.phone || '',
                                  });
                                  setShowUserDialog(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'divisi' && (
          <motion.div
            key="divisi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daftar Divisi</CardTitle>
                    <CardDescription>Kelola divisi perkebunan</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowDivisiDialog(true)}
                    className="sgs-btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Divisi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {divisiList.map((divisi) => (
                    <div
                      key={divisi.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {divisi.kode}
                        </div>
                        <div>
                          <h4 className="font-semibold">{divisi.nama}</h4>
                          <p className="text-xs text-gray-500">
                            {divisi._count?.kemandoran || 0} Kemandoran
                          </p>
                        </div>
                      </div>
                      {divisi.deskripsi && (
                        <p className="text-sm text-gray-600">{divisi.deskripsi}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'kemandoran' && (
          <motion.div
            key="kemandoran"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daftar Kemandoran</CardTitle>
                    <CardDescription>Kelola kemandoran per divisi</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowKemandoranDialog(true)}
                    className="sgs-btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kemandoran
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Divisi</TableHead>
                        <TableHead>Total Task</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kemandoranList.map((k) => (
                        <TableRow key={k.id}>
                          <TableCell className="font-medium">{k.kode}</TableCell>
                          <TableCell>{k.nama}</TableCell>
                          <TableCell>
                            {k.divisi ? `Divisi ${k.divisi.kode}` : '-'}
                          </TableCell>
                          <TableCell>{k._count?.tasks || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Ubah data user' : 'Buat user baru untuk sistem SGS'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                placeholder="Username"
              />
            </div>
            
            <div className="space-y-2">
              <Label>{editingUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password *'}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input
                value={userForm.nama}
                onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) => setUserForm({ ...userForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Krani)</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Telepon</Label>
              <Input
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                placeholder="Nomor telepon"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowUserDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveUser}
                disabled={isLoading}
                className="flex-1 sgs-btn-primary"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Divisi Dialog */}
      <Dialog open={showDivisiDialog} onOpenChange={setShowDivisiDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Divisi Baru</DialogTitle>
            <DialogDescription>Buat divisi baru untuk perkebunan</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Kode Divisi *</Label>
              <Input
                value={divisiForm.kode}
                onChange={(e) => setDivisiForm({ ...divisiForm, kode: e.target.value })}
                placeholder="Contoh: 1, 2, 3"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nama Divisi *</Label>
              <Input
                value={divisiForm.nama}
                onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.target.value })}
                placeholder="Nama divisi"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input
                value={divisiForm.deskripsi}
                onChange={(e) => setDivisiForm({ ...divisiForm, deskripsi: e.target.value })}
                placeholder="Deskripsi (opsional)"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDivisiDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveDivisi}
                disabled={isLoading}
                className="flex-1 sgs-btn-primary"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kemandoran Dialog */}
      <Dialog open={showKemandoranDialog} onOpenChange={setShowKemandoranDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Kemandoran Baru</DialogTitle>
            <DialogDescription>Buat kemandoran baru untuk divisi</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Kode Kemandoran *</Label>
              <Input
                value={kemandoranForm.kode}
                onChange={(e) => setKemandoranForm({ ...kemandoranForm, kode: e.target.value })}
                placeholder="Contoh: A, B, C"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Nama Kemandoran *</Label>
              <Input
                value={kemandoranForm.nama}
                onChange={(e) => setKemandoranForm({ ...kemandoranForm, nama: e.target.value })}
                placeholder="Nama kemandoran"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Divisi *</Label>
              <Select
                value={kemandoranForm.divisiId}
                onValueChange={(value) => setKemandoranForm({ ...kemandoranForm, divisiId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih divisi" />
                </SelectTrigger>
                <SelectContent>
                  {divisiList.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      Divisi {d.kode} - {d.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input
                value={kemandoranForm.deskripsi}
                onChange={(e) => setKemandoranForm({ ...kemandoranForm, deskripsi: e.target.value })}
                placeholder="Deskripsi (opsional)"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowKemandoranDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveKemandoran}
                disabled={isLoading}
                className="flex-1 sgs-btn-primary"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

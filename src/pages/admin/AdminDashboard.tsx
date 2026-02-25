import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { useAuth } from '@/contexts/AuthContext';
import { ComplaintStatus, COMPLAINT_CATEGORIES, WARD_NUMBERS, Complaint, User } from '@/types';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'https://shomaaj-sathi.onrender.com';
import { Menu } from "lucide-react";

import {
  Users,
  LayoutDashboard,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Filter,
  Search,
  ShieldCheck,
  Eye,
  Camera,
  Upload,
  X,
  Trash2,
  Mic,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { complaints, getStats, updateComplaintStatus, deleteComplaint } = useComplaints();
  const { logout, token } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'alerts'>('dashboard');

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [seedingVoters, setSeedingVoters] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  


  // Alert form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertDate, setAlertDate] = useState('');
  const [alertTime, setAlertTime] = useState('');
  const [alertWard, setAlertWard] = useState<string>('all');
  const [sendingAlert, setSendingAlert] = useState(false);
  const [alerts, setAlerts] = useState([]);



  // Update form state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('pending');
  const [solutionImage, setSolutionImage] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingSolution, setUploadingSolution] = useState(false);

  const handleSolutionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSolution(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSolutionImage(response.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingSolution(false);
    }
  };

  const handleSendAlert = async () => {
    if (!alertTitle || !alertMessage || !alertDate || !alertTime) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/admin/send-alert`,
        {
          title: alertTitle,
          message: alertMessage,
          ward: alertWard,
          date: alertDate,
          time: alertTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      // reset form
      setAlertTitle("");
      setAlertMessage("");
      setAlertDate("");
      setAlertTime("");
      setAlertWard("all");

    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Failed to send alert");
    }
  };
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/admin/alerts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlerts(res.data);

    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/admin/alerts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Alert removed successfully");

      fetchAlerts(); // refresh list

    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);



  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User removed successfully");

      fetchUsers(); // reload users

    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user");
    }
  };

  const handleSeedVoters = async () => {
    const confirmSeed = window.confirm(
      "This will add 15 dummy voter records to the database. Continue?"
    );

    if (!confirmSeed) return;

    setSeedingVoters(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_URL}/api/admin/seed-voters`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message + ` (${response.data.count} voters added)`);

    } catch (error: unknown) {
      console.error("Seed error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Failed to seed voters");
    } finally {
      setSeedingVoters(false);
    }
  };

  const handleClearVoters = async () => {
    const confirmClear = window.confirm(
      "⚠️ This will DELETE ALL voter records from the database. Are you sure?"
    );

    if (!confirmClear) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/api/admin/clear-voters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

    } catch (error) {
      console.error("Clear error:", error);
      alert("Failed to clear voters");
    }
  };


  const stats = getStats();

  const filteredComplaints = complaints.filter((c) => {
    if (filterWard !== 'all' && c.wardNumber !== parseInt(filterWard)) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery && !c.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    if (newStatus === 'solved' && !solutionImage) {
      alert('Please upload proof image before marking as solved');
      return;
    }
    if (newStatus === 'solved' && !resolutionNote.trim()) {
      alert('Please provide a resolution note before marking as solved');
      return;
    }
    setIsUpdating(true);
    try {
      await updateComplaintStatus(
        selectedComplaint.id,
        newStatus,
        newStatus === 'solved' ? solutionImage || undefined : undefined,
        newStatus === 'solved' ? resolutionNote || undefined : undefined
      );
      setSelectedComplaint(null);
      setSolutionImage('');
      setResolutionNote('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const selectedCategory = selectedComplaint
    ? COMPLAINT_CATEGORIES.find((c) => c.value === selectedComplaint.category)
    : null;


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
<aside
  className={`fixed left-0 top-0 h-full w-64 bg-card border-r border-border 
  transform transition-transform duration-300 z-50
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
  lg:translate-x-0`}
>
  <div className="p-6">
    <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
    <p className="text-sm text-muted-foreground">Halisahar Civic Portal</p>
  </div>

  <nav className="px-3 space-y-1">
    <Button
      variant={activeTab === "dashboard" ? "secondary" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={() => {
        setActiveTab("dashboard");
        setIsSidebarOpen(false);
      }}
    >
      <LayoutDashboard className="w-5 h-5" />
      Dashboard
    </Button>

    <Button
      variant={activeTab === "users" ? "secondary" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={() => {
        setActiveTab("users");
        setIsSidebarOpen(false);
      }}
    >
      <Users className="w-5 h-5" />
      User Verification
    </Button>

    <Button
      variant={activeTab === "alerts" ? "secondary" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={() => {
        setActiveTab("alerts");
        setIsSidebarOpen(false);
      }}
    >
      <ShieldCheck className="w-5 h-5" />
      Send Public Alert
    </Button>
  </nav>

  <div className="absolute bottom-6 left-3 right-3">
    <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  </div>
</aside>


      {/* Main Content */}
      <main className="lg:ml-64 p-6">
{/* Overlay for Mobile */}
{isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    onClick={() => setIsSidebarOpen(false)}
  />
)}


        {/* Header */}
<div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-4">
    {/* Mobile Menu Button */}
    <button
      className="lg:hidden"
      onClick={() => setIsSidebarOpen(true)}
    >
      <Menu className="w-6 h-6" />
    </button>

    <div>
      <h1 className="text-2xl font-bold">
        {activeTab === "dashboard" && "Admin Dashboard"}
        {activeTab === "users" && "Users"}
        {activeTab === "alerts" && "Send Public Alert"}
      </h1>
      <p className="text-muted-foreground">
        {activeTab === "dashboard" && "Manage civic complaints"}
        {activeTab === "users" && "Manage registered users"}
        {activeTab === "alerts" && "Send alerts to citizens"}
      </p>
    </div>
  </div>

  <Button variant="outline" className="lg:hidden" onClick={handleLogout}>
    <LogOut className="w-4 h-4" />
  </Button>
</div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Complaints</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <p className="text-3xl font-bold text-status-pending">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <p className="text-3xl font-bold text-status-progress">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border shadow-card">
                <p className="text-3xl font-bold text-status-solved">{stats.solved}</p>
                <p className="text-sm text-muted-foreground">Solved</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-card mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Filters</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterWard} onValueChange={setFilterWard}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Wards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    {WARD_NUMBERS.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Ward {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Image</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Address</th>
                      <th className="text-left p-4 font-medium">Ward</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => {
                      const cat = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);
                      return (
                        <tr key={complaint.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4">
                            <div className="relative">
                              <img
                                src={complaint.imageUrl}
                                alt="Problem"
                                className="w-16 h-12 object-cover rounded-lg"
                              />
                              {complaint.imageUrls && complaint.imageUrls.length > 1 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                  {complaint.imageUrls.length}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="category-badge">
                              {cat?.icon} {cat?.label}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm max-w-[200px] truncate">{complaint.address}</span>
                            </div>
                          </td>
                          <td className="p-4">Ward {complaint.wardNumber}</td>
                          <td className="p-4">
                            <span
                              className={cn(
                                'status-badge',
                                complaint.status === 'pending' && 'status-pending',
                                complaint.status === 'in-progress' && 'status-progress',
                                complaint.status === 'solved' && 'status-solved'
                              )}
                            >
                              {complaint.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                              {complaint.status === 'in-progress' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              {complaint.status === 'solved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {format(complaint.createdAt, 'dd MMM yyyy')}
                          </td>
                          <td className="p-4 space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setNewStatus(complaint.status);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={async () => {
                                const confirmDelete = window.confirm('Are you sure you want to delete this complaint?');
                                if (!confirmDelete) return;
                                try {
                                  await deleteComplaint(complaint.id);
                                } catch (error) {
                                  console.error(error);
                                  alert('Failed to delete complaint');
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredComplaints.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No complaints found matching the filters
                </div>
              )}
            </div>
          </>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Voter Database Management */}
            <div className="bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Voter Database (Testing)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use these tools to populate the voter database with dummy data for testing the EPIC auto-fill feature.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleSeedVoters} 
                  disabled={seedingVoters}
                  variant="outline"
                >
                  {seedingVoters ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Seed 15 Dummy Voters
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleClearVoters}
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Voters
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Address</th>
                      <th className="text-left p-4 font-medium">Documents</th>
                      <th className="text-left p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.photo}
                                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 ring-primary"
                                onClick={() => setSelectedUser(u)}
                              />
                              <div>
                                <p className="font-medium">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                                <p className="text-xs text-muted-foreground">Ward {u.wardNumber || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm max-w-[200px] truncate">{u.address}</td>
                          <td className="p-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(u)}>
                              <Eye className="w-4 h-4 mr-1" /> View Details
                            </Button>
                          </td>
                          <td className="p-4 space-x-2">

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              Remove
                            </Button>
                          </td>


                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-card max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Send Public Alert</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Alert Title *</label>
                  <Input
                    placeholder="e.g. Water Supply Maintenance"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Alert Message *</label>
                  <Textarea
                    placeholder="Write full message for citizens..."
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                  />
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Ward</label>
                  <Select value={alertWard} onValueChange={setAlertWard}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Wards</SelectItem>
                      {WARD_NUMBERS.map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Ward {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date *</label>
                    <Input
                      type="date"
                      value={alertDate}
                      onChange={(e) => setAlertDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Time *</label>
                    <Input
                      type="time"
                      value={alertTime}
                      onChange={(e) => setAlertTime(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendAlert}
                  disabled={sendingAlert}
                  className="w-full"
                >
                  {sendingAlert && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Send Alert to Users
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ALERT HISTORY ================= */}
        {activeTab === 'alerts' && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              Alert History
            </h2>

            {alerts.length === 0 ? (
              <p className="text-gray-500">No alerts sent yet.</p>
            ) : (
              alerts.map((alert: { id: string; _id?: string; title: string; message: string; date: string; time: string; ward: string; createdAt: string }) => (
                <div
                  key={alert._id || alert.id}
                  className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Ward: {alert.ward} | {alert.date} {alert.time}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAlert(alert._id || alert.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}


      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCategory?.icon}</span>
                  {selectedCategory?.label} Complaint
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Info */}
                <div className="space-y-4">
                  {/* Problem Images Gallery */}
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Problem Photos</span>
                    {selectedComplaint.imageUrls && selectedComplaint.imageUrls.length > 1 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedComplaint.imageUrls.map((imgUrl, index) => (
                          <div key={index} className="rounded-xl overflow-hidden bg-muted">
                            <img
                              src={imgUrl}
                              alt={`Problem ${index + 1}`}
                              className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(imgUrl, '_blank')}
                              title="Click to view full image"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl overflow-hidden bg-muted">
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Problem"
                          className="w-full object-contain max-h-[400px] cursor-pointer"
                          onClick={() => window.open(selectedComplaint.imageUrl, '_blank')}
                          title="Click to view full image"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Location</span>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedComplaint.address}</p>
                          <p className="text-xs text-muted-foreground">
                            GPS: {selectedComplaint.latitude.toFixed(6)}, {selectedComplaint.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ward</span>
                        <p className="font-medium">Ward {selectedComplaint.wardNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted</span>
                        <p className="font-medium">{format(selectedComplaint.createdAt, 'dd MMM yyyy, hh:mm a')}</p>
                      </div>
                    </div>

                    {/* Voice Note */}
                    {selectedComplaint.voiceNoteUrl && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                          <Mic className="w-4 h-4" /> Voice Note from Citizen
                        </p>
                        <audio controls className="w-full">
                          <source src={selectedComplaint.voiceNoteUrl} type="audio/webm" />
                          <source src={selectedComplaint.voiceNoteUrl} type="audio/mp4" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {/* Show solution if already solved */}
                    {selectedComplaint.status === 'solved' && selectedComplaint.solutionImageUrl && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Problem Resolved
                        </p>
                        <div className="rounded-lg overflow-hidden bg-white dark:bg-black/20">
                          <img
                            src={selectedComplaint.solutionImageUrl}
                            alt="Solution"
                            className="w-full object-contain max-h-[200px] cursor-pointer"
                            onClick={() => window.open(selectedComplaint.solutionImageUrl, '_blank')}
                          />
                        </div>
                        {selectedComplaint.resolvedAt && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Resolved on: {format(new Date(selectedComplaint.resolvedAt), 'dd MMM yyyy, hh:mm a')}
                          </p>
                        )}
                        {selectedComplaint.resolutionNote && (
                          <p className="text-sm mt-2 text-muted-foreground italic">"{selectedComplaint.resolutionNote}"</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Update */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Update Status</h3>

                  <div className="space-y-4">
                    <Select
                      value={newStatus}
                      onValueChange={(v) => setNewStatus(v as ComplaintStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">🟡 Pending</SelectItem>
                        <SelectItem value="in-progress">🔵 In Progress</SelectItem>
                        <SelectItem value="solved">🟢 Solved</SelectItem>
                      </SelectContent>
                    </Select>

                    {newStatus === 'solved' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Upload Solution Image <span className="text-destructive">*</span></label>
                          {solutionImage ? (
                            <div className="relative rounded-xl overflow-hidden bg-muted">
                              <img src={solutionImage} alt="Solution" className="w-full h-40 object-contain" />
                              <button
                                type="button"
                                onClick={() => setSolutionImage('')}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : uploadingSolution ? (
                            <div className="border-2 border-dashed rounded-xl p-6 text-center border-primary bg-secondary">
                              <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors">
                              <Camera className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-3">Upload proof of resolved issue</p>
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleSolutionImageUpload}
                                />
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                                  <Upload className="w-4 h-4" /> Choose Image
                                </span>
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Resolution Note <span className="text-destructive">*</span></label>
                          <Textarea
                            placeholder="Describe the solution..."
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleUpdateStatus}
                      disabled={isUpdating || (newStatus === 'solved' && (!solutionImage || !resolutionNote.trim()))}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* User Verification Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Verification Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profile Photo - Large */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Profile Photo</h3>
                  <div className="bg-muted rounded-xl p-2 flex justify-center">
                    <img
                      src={selectedUser.photo}
                      alt="Profile"
                      className="max-w-full max-h-[300px] object-contain rounded-lg cursor-pointer"
                      onClick={() => window.open(selectedUser.photo, '_blank')}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Click to view full size</p>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-2 gap-4 bg-secondary/50 rounded-xl p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile</p>
                    <p className="font-medium">{selectedUser.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ward Number</p>
                    <p className="font-medium">{selectedUser.wardNumber ? `Ward ${selectedUser.wardNumber}` : 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedUser.address || 'N/A'}</p>
                  </div>
                </div>



                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

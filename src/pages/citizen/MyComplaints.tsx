import { useState } from 'react';
import { ComplaintCard } from '@/components/citizen/ComplaintCard';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { ComplaintStatus, COMPLAINT_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Clock, CheckCircle2, FileText, Filter, Calendar, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MyComplaints() {
  const { user } = useAuth();
  const { getComplaintsByUser } = useComplaints();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ComplaintStatus | 'all'>('all');

  const complaints = user ? getComplaintsByUser(user.id) : [];
  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter((c) => c.status === filter);

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);
  const category = selectedComplaint 
    ? COMPLAINT_CATEGORIES.find((c) => c.value === selectedComplaint.category)
    : null;

  const filters: { value: ComplaintStatus | 'all'; label: string; icon?: any; count: number }[] = [
    { value: 'all', label: 'All', count: complaints.length },
    { value: 'pending', label: 'Pending', count: complaints.filter(c => c.status === 'pending').length },
    { value: 'in-progress', label: 'In Progress', count: complaints.filter(c => c.status === 'in-progress').length },
    { value: 'solved', label: 'Solved', count: complaints.filter(c => c.status === 'solved').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Page Title */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 max-w-lg mx-auto">My Complaints</h1>
      </div>

      <main className="px-4 py-6 space-y-4 max-w-lg mx-auto pb-8">
        {/* Stats Summary */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Total Complaints</h3>
              <p className="text-sm text-muted-foreground">{complaints.length} registered</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide animate-fade-in">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300',
                filter === f.value
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              )}
            >
              {f.label}
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs',
                filter === f.value
                  ? 'bg-white/20'
                  : 'bg-muted'
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-3">
            {filteredComplaints.map((complaint, index) => (
              <div 
                key={complaint.id}
                style={{ animationDelay: `${index * 0.05}s` }}
                className="animate-slide-up"
              >
                <ComplaintCard
                  complaint={complaint}
                  onClick={() => setSelectedComplaintId(complaint.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">
              {filter === 'all'
                ? 'No complaints found'
                : `No ${filter} complaints`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === 'all' 
                ? 'Register your first complaint to get started'
                : 'Try changing the filter'}
            </p>
          </div>
        )}
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaintId(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{category?.icon}</span>
                  <div>
                    <p className="text-lg font-bold">{category?.label}</p>
                    <p className="text-xs text-muted-foreground font-normal">Complaint Details</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Problem Image */}
                <div className="rounded-xl overflow-hidden shadow-md">
                  <div className="relative">
                    <img
                      src={selectedComplaint.imageUrl}
                      alt="Problem"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Problem Photo
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                  <span className="text-sm font-medium text-muted-foreground">Current Status</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold',
                      selectedComplaint.status === 'pending' && 'bg-amber-100 text-amber-700',
                      selectedComplaint.status === 'in-progress' && 'bg-blue-100 text-blue-700',
                      selectedComplaint.status === 'solved' && 'bg-green-100 text-green-700'
                    )}
                  >
                    {selectedComplaint.status === 'pending' && <Clock className="w-4 h-4" />}
                    {selectedComplaint.status === 'in-progress' && <Clock className="w-4 h-4 animate-spin" />}
                    {selectedComplaint.status === 'solved' && <CheckCircle2 className="w-4 h-4" />}
                    {selectedComplaint.status === 'in-progress' ? 'In Progress' : selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                  </span>
                </div>

                {/* Location Card */}
                <div className="p-4 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">Location</p>
                      <p className="font-semibold text-foreground">{selectedComplaint.address}</p>
                      <span className="inline-flex items-center gap-1 mt-2 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-semibold">
                        Ward {selectedComplaint.wardNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Submitted</span>
                    </div>
                    <p className="font-bold text-foreground">{format(selectedComplaint.createdAt, 'dd MMM yyyy')}</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Updated</span>
                    </div>
                    <p className="font-bold text-foreground">{format(selectedComplaint.updatedAt, 'dd MMM yyyy')}</p>
                  </div>
                </div>

                {/* Solution (if solved) */}
                {selectedComplaint.status === 'solved' && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      Problem Resolved!
                    </div>
                    {selectedComplaint.resolutionNote && (
                      <p className="text-sm text-green-800 bg-white/50 p-3 rounded-lg">{selectedComplaint.resolutionNote}</p>
                    )}
                    {selectedComplaint.solutionImageUrl && (
                      <div className="rounded-xl overflow-hidden shadow-md border border-green-200">
                        <img
                          src={selectedComplaint.solutionImageUrl}
                          alt="Solution"
                          className="w-full aspect-video object-cover"
                        />
                        <div className="bg-green-100 text-green-700 text-xs font-semibold text-center py-2 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          After Resolution
                        </div>
                      </div>
                    )}
                    {selectedComplaint.resolvedAt && (
                      <p className="text-xs text-green-600 text-center">
                        Resolved on {format(new Date(selectedComplaint.resolvedAt), 'dd MMM yyyy, hh:mm a')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

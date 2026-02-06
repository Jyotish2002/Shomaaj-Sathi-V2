import { Header } from '@/components/citizen/Header';
import { StatsCard } from '@/components/citizen/StatsCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { PlusCircle, ArrowRight, MapPin, Phone, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPLAINT_CATEGORIES } from '@/types';
import { format } from 'date-fns';

export default function CitizenHome() {
  const { user } = useAuth();
  const { getStats, getComplaintsByUser } = useComplaints();
  const navigate = useNavigate();

  const stats = user ? getStats(user.id) : { total: 0, pending: 0, inProgress: 0, solved: 0 };
  const recentComplaints = user ? getComplaintsByUser(user.id).slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header showGreeting />

      <main className="px-4 -mt-6 space-y-6 max-w-lg mx-auto pb-8">
        {/* Quick Action Card */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-5 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Report an Issue</h3>
              <p className="text-white/70 text-sm">Help improve your ward</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/citizen/register')}
            className="w-full h-12 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl shadow-md"
            size="lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Register New Complaint
          </Button>
        </div>

        {/* Stats Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Complaints</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/citizen/complaints')}
              className="text-primary hover:text-primary/80 gap-1 font-medium"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard label="Total" value={stats.total} variant="total" />
            <StatsCard label="Solved" value={stats.solved} variant="solved" />
            <StatsCard label="Pending" value={stats.pending} variant="pending" />
            <StatsCard label="In Progress" value={stats.inProgress} variant="progress" />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>

          {recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((complaint, index) => {
                const category = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category);
                return (
                  <button
                    key={complaint.id}
                    onClick={() => navigate('/citizen/complaints')}
                    className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-left animate-slide-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex gap-3">
                      {/* Image Preview */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={complaint.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <span>{category?.icon}</span>
                            {category?.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              complaint.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : complaint.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {complaint.status === 'solved' && <CheckCircle2 className="w-3 h-3" />}
                            {complaint.status === 'pending' && <Clock className="w-3 h-3" />}
                            {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {complaint.address}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {format(complaint.createdAt, 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No complaints yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Report issues in your area</p>
              <Button
                onClick={() => navigate('/citizen/register')}
                className="mt-4 rounded-xl"
              >
                Register your first complaint
              </Button>
            </div>
          )}
        </section>

        {/* Help Section */}
        <section className="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-5 border border-border/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contact MLA Office for urgent matters
              </p>
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center gap-2 mt-2 text-primary font-semibold text-sm hover:underline"
              >
                +91 98765 43210
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

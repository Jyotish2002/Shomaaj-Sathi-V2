import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/citizen/BottomNav';
import { Header } from '@/components/citizen/Header';

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

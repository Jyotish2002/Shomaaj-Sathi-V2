import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function BottomNav() {
  const { t } = useTranslation();
  
  const navItems = [
    { to: '/citizen', icon: Home, label: t('home') },
    { to: '/citizen/register', icon: PlusCircle, label: t('register') },
    { to: '/citizen/complaints', icon: ClipboardList, label: t('complaints') },
    { to: '/citizen/profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] safe-bottom">
      <div className="flex items-center justify-around h-18 max-w-lg mx-auto px-2 py-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/citizen'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-300 touch-target relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}
                <div className={cn(
                  'p-1.5 rounded-xl transition-all duration-300',
                  isActive && 'bg-primary/10'
                )}>
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-all duration-300',
                      isActive && 'scale-110 text-primary'
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span className={cn(
                  'text-[10px] font-medium transition-all duration-300',
                  isActive && 'font-bold text-primary'
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <nav
      className={cn(`relative hidden h-screen w-72 border-r pt-16 lg:block`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav items={navItems(auth.user?.role?.name || "")} />
          </div>
        </div>
      </div>
    </nav>
  );
}

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Posts', href: '/dashboard/posts', icon: '📝' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: '📊' },
  { name: 'Accounts', href: '/dashboard/accounts', icon: '👤' },
  { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-center border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">Social Manager</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="pl-64">
          <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                </svg>
              </button>
            </div>
          </div>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </SignedIn>
  );
}

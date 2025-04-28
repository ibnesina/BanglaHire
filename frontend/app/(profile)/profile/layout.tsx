"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import userStore from "@/lib/store";
import { observer } from "mobx-react-lite";

export default observer(function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = userStore;

  const profileLinks = [
    { name: 'Overview', href: '/profile' },
    { name: 'Create Project', href: '/profile/create-project', visibility: user?.type === 'Client' },
    { name: 'My Projects', href: '/profile/my-projects', visibility: user?.type === 'Client' },
    { name: 'Portfolio', href: '/profile/portfolio', visibility: user?.type === 'Freelancer' },
    { name: 'Work History', href: '/profile/work-history', visibility: user?.type === 'Freelancer' },
  ];

  const filteredLinks = profileLinks.filter(link => 
    link.visibility === undefined || link.visibility === true
  );

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link href="/" className="px-4 py-2 bg-slate-500 text-white rounded-md hover:bg-slate-600 transition-colors">
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <nav className="space-y-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="w-full md:w-3/4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
});

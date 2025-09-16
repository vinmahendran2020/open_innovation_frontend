'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    description: 'Data Visualization',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/upload',
    label: 'Upload Data',
    description: 'Import CSV Files',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      <Header isCollapsed={isCollapsed} onToggle={onToggle} />

      <Content pathname={pathname} isCollapsed={isCollapsed} />
    </div>
  );
}

function Content({ pathname, isCollapsed }: { pathname: string; isCollapsed: boolean }) {
  return <nav className="flex-1 p-4 space-y-2">
    {navItems.map((item) => {
      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

      return (
        <Link
          key={item.href}
          href={item.href}
          className={`
                flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
          title={isCollapsed ? item.label : undefined}
        >
          <span className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
            {item.icon}
          </span>
          {!isCollapsed && (
            <div className="flex-1">
              <div className="font-medium text-sm">{item.label}</div>
              {item.description && (
                <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {item.description}
                </div>
              )}
            </div>
          )}
        </Link>
      );
    })}
  </nav>;
}

function Header({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle?: () => void }) {
  return <div className="p-4 border-b border-gray-200">
    <div className="flex items-center justify-between">
      {!isCollapsed && (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AirQuality</h1>
            <p className="text-xs text-gray-500">Monitor & Analyze</p>
          </div>
        </div>
      )}

      {onToggle && (
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  </div>;
}

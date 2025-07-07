'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/applications', label: 'Applications', icon: '📋' },
    { path: '/applications/new', label: 'Add New', icon: '➕' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Job Tracker
          </Link>
          
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
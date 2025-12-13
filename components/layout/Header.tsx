'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import clsx from 'clsx';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Page Replacement', path: '/page-replacement' },
  { name: 'CPU Scheduling', path: '/cpu-scheduling' },
  { name: 'Disk Scheduling', path: '/disk-scheduling' },
  { name: 'Deadlock', path: '/deadlock' },
  { name: 'Compare', path: '/compare' },
  { name: 'About', path: '/about' }
];

/**
 * Header component with navigation
 */
export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100 hidden sm:inline">
              OS Algorithm Visualizer
            </span>
            <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100 sm:hidden">
              OS Algos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  {
                    'text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20': isActive(item.path),
                    'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800':
                      !isActive(item.path)
                  }
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden pb-4 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                {
                  'text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20': isActive(item.path),
                  'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800':
                    !isActive(item.path)
                }
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

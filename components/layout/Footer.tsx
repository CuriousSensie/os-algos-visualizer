import { Heart, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Footer component
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>© {currentYear} OS Algorithm Visualizer.</span>
            <span className="hidden sm:inline">Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current inline sm:inline" />
            <span className="hidden sm:inline">for learners.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/about"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              About
            </Link>
            <a
              href="https://github.com/CuriousSensie/os-algos-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        {/* Tech Stack
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-center text-zinc-500 dark:text-zinc-500">
            Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion
          </p>
        </div> */}
      </div>
    </footer>
  );
}

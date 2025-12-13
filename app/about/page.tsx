import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Cpu, FileText, Github, HardDrive, Heart, Lock, Settings } from 'lucide-react';
import Link from 'next/link';

/**
 * About page
 */
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <Cpu className="w-16 h-16 text-blue-600 dark:text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          About OS Algorithm Visualizer
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          An interactive educational tool for learning operating system algorithms
        </p>
      </div>

      <div className="space-y-8">
        {/* Purpose */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Our Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700 dark:text-zinc-300">
              Operating System algorithms are conceptually difficult for beginners due to their abstract nature.
              This visualizer transforms complex OS concepts into intuitive, visual, and interactive experiences,
              making learning engaging, simple, and effective.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Step-by-step visualization of algorithm execution</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Interactive controls (play, pause, step forward/backward)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Adjustable animation speed</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Real-time metrics and performance indicators</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Dark/Light mode support</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Educational explanations and pseudocode</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">-</span>
                <span>Responsive design (desktop, tablet, mobile)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Algorithm Categories */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Algorithm Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500 inline-block mr-2" /> Page Replacement
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• FIFO (First In First Out)</li>
                  <li>• LRU (Least Recently Used)</li>
                  <li>• Optimal Page Replacement</li>
                  <li>• LFU (Least Frequently Used)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-500 inline-block mr-2" /> CPU Scheduling
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• FCFS (First Come First Serve)</li>
                  <li>• SJF (Shortest Job First)</li>
                  <li>• Priority Scheduling</li>
                  <li>• Round Robin</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-500 inline-block mr-2" /> Disk Scheduling
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• FCFS</li>
                  <li>• SSTF (Shortest Seek Time First)</li>
                  <li>• SCAN (Elevator Algorithm)</li>
                  <li>• C-SCAN (Circular SCAN)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-500 inline-block mr-2" /> Deadlock Handling <p className='font-normal text-zinc-700 dark:text-zinc-400'> (Coming Soon) </p>
                </h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Banker's Algorithm</li>
                  <li>• Resource Allocation Graph</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'Next.js 16',
                'React 19',
                'TypeScript',
                'Tailwind CSS v4',
                'Framer Motion',
                'Lucide Icons'
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Use */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Select an algorithm category from the home page</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Choose a specific algorithm to visualize</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Configure input parameters (or use defaults)</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">4.</span>
                <span>Click "Run Algorithm" to generate the visualization</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">5.</span>
                <span>Use Play/Pause/Step controls to navigate through the execution</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">6.</span>
                <span>Adjust animation speed to your preference</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">7.</span>
                <span>Read explanations and pseudocode to understand each step</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span>Built with love for students and learners everywhere</span>
            </div>
            <Link target="_blank" href={"https://github.com/CuriousSensie/os-algos-visualizer"} className="mt-4 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Github className="w-5 h-5" />
              <span className="text-sm">Open source project</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

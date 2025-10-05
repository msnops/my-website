import { Code2, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">SaaS Academy</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#courses" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Courses
            </a>
            <a href="#why-us" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Why Us
            </a>
            <a href="#contact" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </a>
            <a
              href="#enroll"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Enroll Now
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a href="#courses" className="block text-slate-700 hover:text-blue-600 font-medium">
              Courses
            </a>
            <a href="#why-us" className="block text-slate-700 hover:text-blue-600 font-medium">
              Why Us
            </a>
            <a href="#contact" className="block text-slate-700 hover:text-blue-600 font-medium">
              Contact
            </a>
            <a
              href="#enroll"
              className="block text-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              Enroll Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

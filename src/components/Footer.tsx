import { Code2, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">SaaS Academy</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering professionals with cutting-edge DevOps and Data Engineering skills for the modern cloud era.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#courses" className="hover:text-blue-400 transition-colors">All Courses</a></li>
              <li><a href="#why-us" className="hover:text-blue-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#courses" className="hover:text-blue-400 transition-colors">DevOps Training</a></li>
              <li><a href="#courses" className="hover:text-blue-400 transition-colors">Data Engineering</a></li>
              <li><a href="#courses" className="hover:text-blue-400 transition-colors">Cloud Platforms</a></li>
            </ul>
          </div>

          <div id="contact">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@saasacademy.com" className="hover:text-blue-400 transition-colors">
                  info@saasacademy.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>123 Tech Street, San Francisco, CA 94105</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SaaS Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

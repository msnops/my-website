import { Users, Trophy, BookOpen, Briefcase } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from industry veterans with 10+ years of hands-on experience in DevOps and Data Engineering.',
  },
  {
    icon: Trophy,
    title: 'Industry Certification',
    description: 'Earn recognized certificates that boost your resume and validate your expertise to employers.',
  },
  {
    icon: BookOpen,
    title: 'Hands-on Projects',
    description: 'Build real-world projects using Jenkins, Kubernetes, Docker, Terraform, and modern data tools.',
  },
  {
    icon: Briefcase,
    title: 'Career Support',
    description: 'Get resume reviews, interview prep, and job placement assistance to land your dream role.',
  },
];

export default function Features() {
  return (
    <div id="why-us" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Our Training</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of successful graduates who transformed their careers with our comprehensive programs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

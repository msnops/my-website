import { Clock, Award, CheckCircle } from 'lucide-react';
import { Course } from '../lib/supabase';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]}`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
          <div className="text-right">
            <span className="text-3xl font-bold text-slate-900">${course.price}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <p className="text-slate-600 mb-6 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Certificate</span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {course.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-700">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onEnroll(course)}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}

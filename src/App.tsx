import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CourseCard from './components/CourseCard';
import EnrollmentModal from './components/EnrollmentModal';
import Footer from './components/Footer';
import { Course, supabase } from './lib/supabase';
import { Rocket, Database } from 'lucide-react';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filter, setFilter] = useState<'all' | 'devops' | 'data-engineering'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setCourses(data);
    }
  };

  const filteredCourses = courses.filter(
    (course) => filter === 'all' || course.category === filter
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />

      <div id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Training Programs</h2>
            <p className="text-xl text-slate-600 mb-8">
              Choose from our comprehensive courses designed for all skill levels
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Courses
              </button>
              <button
                onClick={() => setFilter('devops')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filter === 'devops'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Rocket className="w-5 h-5" />
                DevOps
              </button>
              <button
                onClick={() => setFilter('data-engineering')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  filter === 'data-engineering'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Database className="w-5 h-5" />
                Data Engineering
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={setSelectedCourse}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {selectedCourse && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

export default App;

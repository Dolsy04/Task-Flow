import { useState } from 'react';
import { CheckCircle, Calendar, Users, Bell, BarChart3, Zap, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function TaskManagerLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
      title: "Smart Task Organization",
      description: "Organize tasks with intelligent categorization, priority levels, and custom tags for maximum productivity."
    },
    {
      icon: <Calendar className="w-8 h-8 text-green-500" />,
      title: "Advanced Scheduling",
      description: "Set deadlines, recurring tasks, and time blocks with our intuitive calendar integration and smart reminders."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Team Collaboration",
      description: "Share projects, assign tasks to team members, and track progress in real-time with seamless collaboration tools."
    },
    {
      icon: <Bell className="w-8 h-8 text-orange-500" />,
      title: "Smart Notifications",
      description: "Get intelligent reminders and notifications that adapt to your work patterns and never miss important deadlines."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-red-500" />,
      title: "Analytics & Insights",
      description: "Track your productivity with detailed analytics, time tracking, and performance insights to optimize your workflow."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "AI-Powered Suggestions",
      description: "Let AI help you prioritize tasks, suggest optimal schedules, and provide productivity recommendations."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      content: "TaskFlow transformed how our team manages projects. The collaboration features are game-changing!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      content: "The AI suggestions and smart scheduling helped me increase my productivity by 40%. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "Best task manager I've used. The analytics feature gives me insights I never had before.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">TaskFlow</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">Reviews</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all">
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Productivity
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate task management solution that adapts to your workflow. 
            Organize, collaborate, and achieve more with AI-powered productivity tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-2xl">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">14-day free trial • No credit card required</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Stay
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Organized</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
            <p className="text-xl text-gray-300">See what our users are saying about TaskFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who've revolutionized their workflow with TaskFlow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-2xl">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No setup fees • Cancel anytime • 24/7 support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold text-white">TaskFlow</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-6 text-center text-gray-400 text-sm">
            © 2025 TaskFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}




// import TaskManagerLanding from "./pages/trial";
// import { useState, useEffect } from "react";
// function App() {
//   const [isDark, setIsDark] = useState(false);

//    useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     if(savedTheme === "dark"){
//       document.documentElement.classList.add("dark");
//       setIsDark(true);
//     }
//   },[])

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }else{
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [isDark])

 

//   return (
//     <>
//       <section className="bg-amber-50 w-full h-screen dark:bg-blue-600">
//         <h1 className="text-4xl text-center text-black dark:text-white">Hello Word</h1>
//         <button className="w-[30%] border-1 border-black mx-auto" onClick={()=> setIsDark(!isDark)}>{isDark ? "Dark" : "Light"}</button>
//       </section>
//     </>
//   )
// }

// export default App 
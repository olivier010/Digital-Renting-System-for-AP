import { Link } from 'react-router-dom'
import { Home, Target, Eye, Star, Users } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up">About RentWise</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Your trusted platform for finding the perfect rental property anywhere, anytime
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-6 tracking-tight">
                  Our Story
                </h2>
                <p className="text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
                  Founded in 2024, RentWise was born from a simple idea: make renting properties easier,
                  more transparent, and accessible to everyone. We saw the challenges people faced when
                  searching for their ideal rental - complicated processes, hidden fees, and lack of trust.
                </p>
                <p className="text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
                  Our team of real estate experts, technology innovators, and customer service professionals
                  came together to create a platform that puts renters and property owners first.
                </p>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">
                  Today, RentWise connects thousands of renters with their perfect properties across
                  multiple cities, with a commitment to excellence, transparency, and innovation.
                </p>
              </div>
              <div className="card-elevated p-8 text-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  10,000+
                </h3>
                <p className="text-surface-600 dark:text-surface-300 font-medium">
                  Properties Listed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              Our Mission & Values
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-3xl mx-auto">
              We're driven by a commitment to transform the rental experience for everyone involved
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Our Mission', description: 'To revolutionize the rental market by creating a seamless, transparent, and trustworthy platform that connects people with their ideal homes.', icon: <Target className="w-7 h-7" />, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { title: 'Our Vision', description: "To become the world's most trusted rental platform, where finding and listing properties is simple, secure, and satisfying for everyone.", icon: <Eye className="w-7 h-7" />, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { title: 'Our Values', description: 'Integrity, innovation, and customer-centricity guide everything we do. We believe in creating lasting relationships built on trust.', icon: <Star className="w-7 h-7" />, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            ].map((item, idx) => (
              <div key={item.title} className="card-elevated p-8 text-center hover:shadow-soft-lg dark:hover:shadow-dark-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <div className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-surface-600 dark:text-surface-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              Meet Our Team
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400">
              The passionate people behind RentWise
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder' },
              { name: 'Michael Chen', role: 'CTO' },
              { name: 'Emily Davis', role: 'Head of Operations' },
              { name: 'James Wilson', role: 'Head of Marketing' }
            ].map((member, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-md hover:shadow-glow-primary transition-shadow duration-300">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '50K+', label: 'Happy Users' },
              { value: '100+', label: 'Cities Covered' },
              { value: '4.9', label: 'Average Rating', icon: true },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, idx) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                  {stat.icon && <Star className="w-6 h-6 mr-1 fill-current" />}
                  {stat.value}
                </div>
                <p className="text-surface-600 dark:text-surface-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Become part of the thousands who trust RentWise for their rental needs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                Get Started Today
              </button>
            </Link>
            <Link to="/properties">
              <button className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:border-white/60">
                Browse Properties
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

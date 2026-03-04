import { Link } from 'react-router-dom'
import { Home, Target, Eye, Star, Users } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RentWise</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Your trusted platform for finding the perfect rental property anywhere, anytime
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2024, RentWise was born from a simple idea: make renting properties easier, 
                  more transparent, and accessible to everyone. We saw the challenges people faced when 
                  searching for their ideal rental - complicated processes, hidden fees, and lack of trust.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Our team of real estate experts, technology innovators, and customer service professionals 
                  came together to create a platform that puts renters and property owners first. We believe 
                  that finding a home should be an exciting journey, not a stressful experience.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Today, RentWise connects thousands of renters with their perfect properties across 
                  multiple cities, with a commitment to excellence, transparency, and innovation.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl p-8 text-center">
                <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6">
                  <div className="text-6xl mb-4 text-primary-600 dark:text-primary-400">
                    <Home className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    10,000+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Properties Listed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Mission & Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're driven by a commitment to transform the rental experience for everyone involved
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To revolutionize the rental market by creating a seamless, transparent, and trustworthy platform that connects people with their ideal homes.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the world's most trusted rental platform, where finding and listing properties is simple, secure, and satisfying for everyone.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Our Values</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Integrity, innovation, and customer-centricity guide everything we do. We believe in creating lasting relationships built on trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The passionate people behind RentWise
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder', icon: <Users className="w-12 h-12" /> },
              { name: 'Michael Chen', role: 'CTO', icon: <Users className="w-12 h-12" /> },
              { name: 'Emily Davis', role: 'Head of Operations', icon: <Users className="w-12 h-12" /> },
              { name: 'James Wilson', role: 'Head of Marketing', icon: <Users className="w-12 h-12" /> }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
                  {member.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">50K+</div>
              <p className="text-gray-600 dark:text-gray-300">Happy Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">100+</div>
              <p className="text-gray-600 dark:text-gray-300">Cities Covered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 mr-1 fill-current" />
                4.9
              </div>
              <p className="text-gray-600 dark:text-gray-300">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Become part of the thousands who trust RentWise for their rental needs
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Get Started Today
              </button>
            </Link>
            <Link to="/properties">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
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

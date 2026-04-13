
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Home as HomeIcon, Calendar, Star, Shield, ChevronRight, Facebook, Twitter, Linkedin, MapPin, Car, Eye } from 'lucide-react'
import { apiFetch } from '../../utils/api'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Featured properties from backend
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([])
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await apiFetch('/properties/featured?page=0&size=6')
        let apiProperties = res.data?.content || []
        apiProperties = apiProperties.map((p: any) => ({
          ...p,
          available: p.isAvailable,
          image: Array.isArray(p.images) && p.images.length > 0
            ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:8080${p.images[0]}`)
            : '',
        }))
        setFeaturedProperties(apiProperties)
      } catch {
        setFeaturedProperties([])
      }
    }
    fetchFeatured()
  }, [])

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Renter',
      content: 'RentWise made finding my dream apartment so easy! The search filters are amazing and the booking process is seamless.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Owner',
      content: 'As a property owner, RentWise has helped me find quality tenants quickly. The platform is professional and reliable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Renter',
      content: 'I love the detailed property listings and high-quality photos. It feels like you\'re actually there when you browse!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ]

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-primary"></div>
        {/* Mesh overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 py-24 lg:py-36 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
              Trusted by 10,000+ users
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Rent Assets & Properties
            <br />
            <span className="text-accent-300">Anywhere, Anytime</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Find houses, cars, and equipment near you in just a few clicks. The smartest way to rent.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft-xl p-2 flex items-center">
              <div className="pl-4 text-surface-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search properties, locations, types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 bg-transparent text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:outline-none text-base"
              />
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-soft dark:shadow-dark-soft"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {['Apartments', 'Houses', 'Luxury', 'Beachfront'].map((category) => (
              <Link
                key={category}
                to="/properties"
                className="px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white/90 text-sm font-medium hover:bg-white/20 transition-all duration-200 hover:scale-105"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              Popular Property Types
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Choose from our wide range of rental properties designed to meet your needs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Houses', icon: <HomeIcon className="w-7 h-7" />, description: 'Spacious homes for families', color: 'from-green-500 to-green-600', lightBg: 'bg-green-50 dark:bg-green-900/20' },
              { name: 'Apartments', icon: <HomeIcon className="w-7 h-7" />, description: 'Modern city apartments', color: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
              { name: 'Cars', icon: <Car className="w-7 h-7" />, description: 'Reliable rental vehicles', color: 'from-amber-500 to-amber-600', lightBg: 'bg-amber-50 dark:bg-amber-900/20' },
              { name: 'Commercial', icon: <Star className="w-7 h-7" />, description: 'Office & retail spaces', color: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50 dark:bg-purple-900/20' }
            ].map((category, idx) => (
              <Link
                key={category.name}
                to="/properties"
                className="group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="card-elevated p-6 text-center hover:shadow-soft-lg dark:hover:shadow-dark-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 ${category.lightBg} rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`bg-gradient-to-br ${category.color} bg-clip-text text-transparent`}>
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{category.description}</p>
                  <div className="text-primary-600 dark:text-primary-400 font-semibold text-sm flex items-center justify-center group-hover:gap-2 transition-all">
                    Explore
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Rent assets in 4 simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Find Property', description: 'Search and browse listings', icon: <Search className="w-6 h-6" /> },
              { step: 2, title: 'Book Easily', description: 'Choose dates and confirm', icon: <Calendar className="w-6 h-6" /> },
              { step: 3, title: 'Safe Payment', description: 'Secure online transactions', icon: <Shield className="w-6 h-6" /> },
              { step: 4, title: 'Enjoy', description: 'Move in and enjoy', icon: <HomeIcon className="w-6 h-6" /> }
            ].map((item, idx) => (
              <div key={item.step} className="text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                {/* Step number */}
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold rounded-lg flex items-center justify-center shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2 tracking-tight">
                Featured Properties
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Handpicked premium properties available for rent
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:gap-2.5 transition-all"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, idx) => (
              <div key={property.id} className="group card-elevated overflow-hidden hover:shadow-soft-lg dark:hover:shadow-dark-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-md">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">${property.price}</span>
                      <span className="text-xs text-surface-500">/mo</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-surface-500 dark:text-surface-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span className="text-sm truncate">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-primary text-xs capitalize">{property.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm font-medium text-surface-900 dark:text-white">{property.rating}</span>
                      <span className="text-xs text-surface-400">({property.reviews})</span>
                    </div>
                  </div>

                  <Link
                    to={`/properties/${property.id}`}
                    className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white text-center py-2 px-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-24 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
              Join thousands of satisfied renters and property owners who trust RentWise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <div key={testimonial.id} className="card-elevated p-6 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-surface-900 dark:text-white text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Find Your Perfect Rental?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of users already finding their ideal properties
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/properties">
              <button className="bg-white text-primary-700 hover:bg-white/90 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-soft dark:shadow-dark-soft hover:shadow-xl hover:scale-[1.02]">
                Find Properties
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:border-white/60">
                List Your Property
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md">
                  RW
                </div>
                <span className="font-bold text-lg">RentWise</span>
              </div>
              <p className="text-surface-400 text-sm leading-relaxed">
                Your trusted platform for renting assets and properties. Find the perfect space, vehicle, or equipment.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Quick Links</h4>
              <ul className="space-y-2.5 text-surface-400 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/properties" className="hover:text-white transition-colors">Explore</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Support</h4>
              <ul className="space-y-2.5 text-surface-400 text-sm">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Connect</h4>
              <p className="text-surface-400 text-sm mb-4">info@rentwise.com</p>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="w-4 h-4" />, label: 'Facebook' },
                  { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                  { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="w-9 h-9 rounded-2xl bg-surface-800 hover:bg-primary-600 text-surface-400 hover:text-white flex items-center justify-center transition-all duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-surface-800 pt-8 text-center text-surface-500 text-sm">
            <p>&copy; 2026 RentWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home



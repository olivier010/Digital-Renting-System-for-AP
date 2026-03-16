
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Search, Home as HomeIcon, Calendar, Star, Shield, ChevronRight, Facebook, Twitter, Linkedin, MapPin, Car } from 'lucide-react'
import { apiFetch } from '../../utils/api'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

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
      // Navigate to properties with search query
      console.log('Searching for:', searchQuery)
      // In a real app, this would navigate to /properties?search=${searchQuery}
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Rent Assets & Properties Anywhere, Anytime
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-primary-100">
            Find houses, cars, and equipment near you in just a few clicks.
          </p>
          
          {/* Professional Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              {/* Search Input Container */}
              <div className={`
                relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all duration-300 ease-out
                ${isExpanded ? 'ring-4 ring-primary-200 dark:ring-primary-800 scale-105' : 'hover:shadow-3xl'}
              `}>
                <div className="flex items-center">
                  {/* Search Icon Button */}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => !searchQuery && setIsExpanded(false)}
                    className={`
                      flex-1 px-0 py-4 bg-transparent text-gray-800 dark:text-white 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:outline-none transition-all duration-300
                      ${isExpanded ? 'w-64' : 'w-0 opacity-0'}
                    `}
                  />
                  
                  {/* Search Action Button */}
                  {searchQuery && (
                    <button
                      onClick={handleSearch}
                      className="p-4 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-r-2xl transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Suggestions (shown when expanded) */}
              {isExpanded && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['New York', 'Miami Beach', 'Luxury Apartments', 'Beach Houses'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion)
                          handleSearch()
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Apartments', 'Houses', 'Luxury', 'Beachfront'].map((category) => (
              <Link
                key={category}
                to="/properties"
                className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-200"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Popular Property Types</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Choose from our wide range of rental properties designed to meet your needs</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Houses', icon: <HomeIcon className="w-8 h-8" />, description: 'Spacious homes for families and individuals', color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' },
              { name: 'Apartments', icon: <HomeIcon className="w-8 h-8" />, description: 'Modern apartments in prime locations', color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' },
              { name: 'Cars', icon: <Car className="w-8 h-8" />, description: 'Reliable vehicles for daily or monthly rental', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' },
              { name: 'Commercial', icon: <Star className="w-8 h-8" />, description: 'Office and retail spaces for your business', color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' }
            ].map((category) => (
              <Link 
                key={category.name}
                to="/properties"
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center border border-gray-100 dark:border-gray-700 h-full">
                  <div className={`w-20 h-20 ${category.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{category.description}</p>
                  <div className="mt-4 text-primary-600 dark:text-primary-400 font-medium flex items-center justify-center group-hover:text-primary-700 dark:group-hover:text-primary-300">
                    Explore {category.name}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Rent assets in 4 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Find Property', description: 'Search and browse listings', icon: <Search className="w-8 h-8" /> },
              { step: 2, title: 'Book Easily', description: 'Choose dates and confirm', icon: <Calendar className="w-8 h-8" /> },
              { step: 3, title: 'Make Payment', description: 'Safe online transactions', icon: <Shield className="w-8 h-8" /> },
              { step: 4, title: 'Enjoy Property', description: 'Move in and enjoy', icon: <HomeIcon className="w-8 h-8" /> }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  {item.icon}
                </div>
                <div className="bg-accent-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties available for rent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      ${property.price}/mo
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full capitalize">
                        {property.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.rating}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        ({property.reviews})
                      </span>
                    </div>
                  </div>

                  <Link 
                    to={`/properties/${property.id}`}
                    className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/properties"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              View All Properties
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied renters and property owners who trust RentWise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Rental?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of users who are already finding their ideal properties with our platform
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/properties">
              <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                Find Properties
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
                List Your Property
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                  RW
                </div>
                <span className="font-bold text-xl">RentWise</span>
              </div>
              <p className="text-gray-400">Your trusted platform for renting assets and properties.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/properties" className="hover:text-white transition-colors">Explore</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <p className="text-gray-400 mb-4">info@rentwise.com</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 RentWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

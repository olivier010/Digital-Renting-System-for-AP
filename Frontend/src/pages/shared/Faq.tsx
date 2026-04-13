import { useState } from 'react'
import { ChevronDown, HelpCircle, Search, Home, Shield, CreditCard, Users, FileText, MessageCircle } from 'lucide-react'

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general')
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const faqCategories = [
    {
      id: 'general', name: 'General', icon: HelpCircle,
      bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400',
      questions: [
        { id: 1, question: 'What is RentWise?', answer: 'RentWise is a comprehensive rental platform that connects property owners with renters. We provide a secure, user-friendly interface for listing, discovering, and booking rental properties of all types.' },
        { id: 2, question: 'How does RentWise work?', answer: 'Property owners can list their properties with detailed information, photos, and availability. Renters can search, filter, and book properties directly through our platform. We handle secure payments and provide communication tools for both parties.' },
        { id: 3, question: 'Is RentWise available worldwide?', answer: 'Currently, RentWise operates primarily in major cities across the United States, with plans to expand internationally. Check our coverage map for specific locations.' }
      ]
    },
    {
      id: 'booking', name: 'Booking & Payments', icon: CreditCard,
      bg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-600 dark:text-green-400',
      questions: [
        { id: 4, question: 'How do I book a property?', answer: "Simply find a property you like, select your dates, review the total cost including fees, and confirm your booking. You'll receive a confirmation email with all the details." },
        { id: 5, question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our encrypted payment system.' },
        { id: 6, question: 'Can I cancel my booking?', answer: 'Cancellation policies vary by property. Most offer free cancellation up to 24-48 hours before check-in. Check the specific policy for each property before booking.' },
        { id: 7, question: 'Are there any hidden fees?', answer: 'No, we believe in transparency. All fees, including service charges and taxes, are clearly displayed before you confirm your booking.' }
      ]
    },
    {
      id: 'property', name: 'Property Owners', icon: Home,
      bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-600 dark:text-purple-400',
      questions: [
        { id: 8, question: 'How do I list my property?', answer: 'Create an account, click "List Your Property," and provide details about your rental including photos, amenities, pricing, and availability. Our team will review and approve your listing within 24 hours.' },
        { id: 9, question: 'What are the fees for property owners?', answer: 'We charge a competitive 3% commission on successful bookings. There are no upfront costs or monthly subscription fees.' },
        { id: 10, question: 'How do I manage bookings?', answer: 'Through your owner dashboard, you can view booking requests, manage your calendar, communicate with guests, and handle payments all in one place.' },
        { id: 11, question: 'Can I set my own rules and policies?', answer: 'Yes, you can set house rules, check-in/check-out times, cancellation policies, and other requirements that guests must agree to when booking.' }
      ]
    },
    {
      id: 'safety', name: 'Safety & Security', icon: Shield,
      bg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-600 dark:text-red-400',
      questions: [
        { id: 12, question: 'How does RentWise ensure safety?', answer: 'We verify user identities, secure all payments, offer 24/7 customer support, and provide a review system. We also have insurance options for additional protection.' },
        { id: 13, question: "What if there's a dispute with a guest or owner?", answer: 'Our support team mediates disputes and helps find fair solutions. We also have a resolution center for handling more serious issues.' },
        { id: 14, question: 'Is my personal information secure?', answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data without consent.' }
      ]
    },
    {
      id: 'account', name: 'Account & Support', icon: Users,
      bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400',
      questions: [
        { id: 15, question: 'How do I create an account?', answer: 'Click "Sign Up" and provide your email, create a password, and verify your email address. You can also sign up using Google or Facebook for faster registration.' },
        { id: 16, question: 'Can I have multiple accounts?', answer: 'Each person should have only one account, but you can use it both as a renter and property owner. Simply switch between roles in your account settings.' },
        { id: 17, question: 'How do I contact customer support?', answer: 'You can reach our support team 24/7 through live chat on our website, email at support@rentwise.com, or call 1-800-RENTWISE.' }
      ]
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in-up">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Find answers to common questions about RentWise
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft-xl p-2 flex items-center">
              <div className="pl-4 text-surface-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                className="flex-1 px-4 py-3 bg-transparent text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-surface-500 dark:text-surface-400">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category, catIdx) => {
                const Icon = category.icon
                return (
                  <div key={category.id} className="card-elevated overflow-hidden animate-fade-in-up" style={{ animationDelay: `${catIdx * 0.05}s` }}>
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 ${category.bg} rounded-2xl`}>
                          <Icon className={`w-5 h-5 ${category.iconColor}`} />
                        </div>
                        <div className="text-left">
                          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                            {category.name}
                          </h2>
                          <span className="text-sm text-surface-500 dark:text-surface-400">
                            {category.questions.length} questions
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-surface-400 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Questions */}
                    {expandedCategory === category.id && (
                      <div className="border-t border-surface-200 dark:border-surface-700">
                        {category.questions.map((question) => (
                          <div key={question.id} className="border-b border-surface-100 dark:border-surface-700/50 last:border-b-0">
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="w-full px-6 py-4 text-left hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-surface-900 dark:text-white pr-4 text-sm">
                                  {question.question}
                                </h3>
                                <ChevronDown className={`w-4 h-4 text-surface-400 flex-shrink-0 transition-transform duration-300 ${expandedQuestion === question.id ? 'rotate-180' : ''}`} />
                              </div>
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                expandedQuestion === question.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="px-6 pb-4">
                                <p className="text-surface-600 dark:text-surface-300 leading-relaxed text-sm">
                                  {question.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-20 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
            Still have questions?
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@rentwise.com" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-8 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg">
              <FileText className="w-4 h-4" />
              Email Support
            </a>
            <a href="tel:1-800-RENTWISE" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-surface-700 hover:bg-surface-50 dark:hover:bg-surface-600 text-surface-900 dark:text-white px-8 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 border-surface-200 dark:border-surface-600">
              <MessageCircle className="w-4 h-4" />
              Call 1-800-RENTWISE
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Faq

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Search, Home, Shield, CreditCard, Users, FileText, MessageCircle } from 'lucide-react'

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('general')
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const faqCategories = [
    {
      id: 'general',
      name: 'General',
      icon: HelpCircle,
      color: 'blue',
      questions: [
        {
          id: 1,
          question: 'What is RentWise?',
          answer: 'RentWise is a comprehensive rental platform that connects property owners with renters. We provide a secure, user-friendly interface for listing, discovering, and booking rental properties of all types.'
        },
        {
          id: 2,
          question: 'How does RentWise work?',
          answer: 'Property owners can list their properties with detailed information, photos, and availability. Renters can search, filter, and book properties directly through our platform. We handle secure payments and provide communication tools for both parties.'
        },
        {
          id: 3,
          question: 'Is RentWise available worldwide?',
          answer: 'Currently, RentWise operates primarily in major cities across the United States, with plans to expand internationally. Check our coverage map for specific locations.'
        }
      ]
    },
    {
      id: 'booking',
      name: 'Booking & Payments',
      icon: CreditCard,
      color: 'green',
      questions: [
        {
          id: 4,
          question: 'How do I book a property?',
          answer: 'Simply find a property you like, select your dates, review the total cost including fees, and confirm your booking. You\'ll receive a confirmation email with all the details.'
        },
        {
          id: 5,
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our encrypted payment system.'
        },
        {
          id: 6,
          question: 'Can I cancel my booking?',
          answer: 'Cancellation policies vary by property. Most offer free cancellation up to 24-48 hours before check-in. Check the specific policy for each property before booking.'
        },
        {
          id: 7,
          question: 'Are there any hidden fees?',
          answer: 'No, we believe in transparency. All fees, including service charges and taxes, are clearly displayed before you confirm your booking.'
        }
      ]
    },
    {
      id: 'property',
      name: 'Property Owners',
      icon: Home,
      color: 'purple',
      questions: [
        {
          id: 8,
          question: 'How do I list my property?',
          answer: 'Create an account, click "List Your Property," and provide details about your rental including photos, amenities, pricing, and availability. Our team will review and approve your listing within 24 hours.'
        },
        {
          id: 9,
          question: 'What are the fees for property owners?',
          answer: 'We charge a competitive 3% commission on successful bookings. There are no upfront costs or monthly subscription fees.'
        },
        {
          id: 10,
          question: 'How do I manage bookings?',
          answer: 'Through your owner dashboard, you can view booking requests, manage your calendar, communicate with guests, and handle payments all in one place.'
        },
        {
          id: 11,
          question: 'Can I set my own rules and policies?',
          answer: 'Yes, you can set house rules, check-in/check-out times, cancellation policies, and other requirements that guests must agree to when booking.'
        }
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Security',
      icon: Shield,
      color: 'red',
      questions: [
        {
          id: 12,
          question: 'How does RentWise ensure safety?',
          answer: 'We verify user identities, secure all payments, offer 24/7 customer support, and provide a review system. We also have insurance options for additional protection.'
        },
        {
          id: 13,
          question: 'What if there\'s a dispute with a guest or owner?',
          answer: 'Our support team mediates disputes and helps find fair solutions. We also have a resolution center for handling more serious issues.'
        },
        {
          id: 14,
          question: 'Is my personal information secure?',
          answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data without consent.'
        }
      ]
    },
    {
      id: 'account',
      name: 'Account & Support',
      icon: Users,
      color: 'yellow',
      questions: [
        {
          id: 15,
          question: 'How do I create an account?',
          answer: 'Click "Sign Up" and provide your email, create a password, and verify your email address. You can also sign up using Google or Facebook for faster registration.'
        },
        {
          id: 16,
          question: 'Can I have multiple accounts?',
          answer: 'Each person should have only one account, but you can use it both as a renter and property owner. Simply switch between roles in your account settings.'
        },
        {
          id: 17,
          question: 'How do I contact customer support?',
          answer: 'You can reach our support team 24/7 through live chat on our website, email at support@rentwise.com, or call 1-800-RENTWISE.'
        }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
            Find answers to common questions about RentWise
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`p-3 bg-${category.color}-100 dark:bg-${category.color}-900 rounded-lg mr-4`}>
                          <Icon className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {category.name}
                        </h2>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          ({category.questions.length} questions)
                        </span>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Questions */}
                    {expandedCategory === category.id && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        {category.questions.map((question) => (
                          <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-white pr-4">
                                  {question.question}
                                </h3>
                                {expandedQuestion === question.id ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                            {expandedQuestion === question.id && (
                              <div className="px-6 pb-4">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {question.answer}
                                </p>
                              </div>
                            )}
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
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <MessageCircle className="w-16 h-16 text-primary-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@rentwise.com"
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <FileText className="w-5 h-5 mr-2" />
              Email Support
            </a>
            <a
              href="tel:1-800-RENTWISE"
              className="inline-flex items-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 border border-gray-300 dark:border-gray-600"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Call 1-800-RENTWISE
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Faq

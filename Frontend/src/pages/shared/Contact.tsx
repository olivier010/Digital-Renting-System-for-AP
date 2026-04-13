import { useState } from 'react'
import { Check, MapPin, Phone, Mail } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 1500)
  }

  const inputClasses = 'w-full px-4 py-3 border-2 border-surface-200 dark:border-surface-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 text-sm transition-all'

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            We're here to help! Get in touch with our team for any questions, support, or feedback.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="card-elevated p-8 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                  Get in Touch
                </h2>

                <div className="space-y-6">
                  {[
                    { icon: <MapPin className="w-5 h-5" />, title: 'Address', line1: '123 Business Ave', line2: 'Suite 100, New York, NY 10001' },
                    { icon: <Phone className="w-5 h-5" />, title: 'Phone', line1: '+1 (555) 123-4567', line2: 'Mon-Fri: 9AM-6PM EST' },
                    { icon: <Mail className="w-5 h-5" />, title: 'Email', line1: 'support@rentwise.com', line2: 'response within 24 hours' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-surface-500 dark:text-surface-400 text-sm">
                          {item.line1}<br />{item.line2}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t border-surface-200 dark:border-surface-700">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {['Facebook', 'Twitter', 'LinkedIn'].map((name) => (
                      <a key={name} href="#" className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center text-surface-500 dark:text-surface-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200">
                        <span className="text-xs font-bold">{name[0]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card-elevated p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">
                  Send us a Message
                </h2>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl animate-fade-in">
                    <p className="text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      Thank you for your message! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Your Name *
                      </label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                        Email Address *
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Subject *
                    </label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClasses}>
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Message *
                    </label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className={`${inputClasses} resize-none`} placeholder="Tell us how we can help you..." />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-surface-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-surface-500 dark:text-surface-400">
              Quick answers to common questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { question: "How do I list my property on RentWise?", answer: "Listing your property is simple! Create an account, click 'List Property', fill in the details, upload photos, and set your pricing. Your listing will be live within minutes." },
              { question: "What are the fees for using RentWise?", answer: "For renters, RentWise is completely free to use. Property owners pay a small service fee only when their property is successfully rented through our platform." },
              { question: "How do I know if a property is available?", answer: "Each property listing shows real-time availability. You can also contact the property owner directly through our messaging system to confirm specific dates." },
              { question: "Is my payment information secure?", answer: "Yes, we use industry-standard encryption and secure payment processors. Your financial information is never stored on our servers." }
            ].map((faq, index) => (
              <div key={index} className="card-elevated p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DMCA Policy - ImageGenFree | Copyright Protection',
  description: 'Learn about our DMCA policy and how to report copyright infringement. We respect intellectual property rights and respond promptly to valid claims.',
  keywords: 'DMCA, copyright, intellectual property, takedown, policy',
  openGraph: {
    title: 'DMCA Policy - ImageGenFree',
    description: 'Our DMCA policy and procedures for handling copyright claims.',
    type: 'website',
  },
}

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            DMCA <span className="text-blue-600">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ImageGenFree respects intellectual property rights and complies with the 
            Digital Millennium Copyright Act (DMCA). Learn about our policies and procedures.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> All images on ImageGenFree are AI-generated and do not infringe on existing copyrights. 
                However, if you believe any content violates your rights, please follow our DMCA procedures below.
              </p>
            </div>
          </div>
        </div>

        {/* DMCA Overview */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">DMCA Overview</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              The Digital Millennium Copyright Act (DMCA) is a United States copyright law that provides a framework 
              for addressing copyright infringement claims in the digital environment. ImageGenFree is committed to 
              complying with the DMCA and protecting the rights of copyright holders.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We have implemented procedures to receive and respond to notifications of claimed copyright infringement 
              in accordance with the DMCA. If you believe that your copyrighted work has been used in a way that 
              constitutes copyright infringement, please follow the procedures outlined below.
            </p>
          </div>
        </section>

        {/* Filing a DMCA Notice */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Filing a DMCA Notice</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Information</h3>
            <p className="text-gray-700 mb-4">
              To file a valid DMCA notice, your notification must include the following information:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Identification of the copyrighted work:</strong> A description of the copyrighted work 
                that you claim has been infringed, including the URL or other specific location where the 
                material is located on our site.
              </li>
              <li>
                <strong>Your contact information:</strong> Your name, address, telephone number, and email address.
              </li>
              <li>
                <strong>Good faith statement:</strong> A statement that you have a good faith belief that the 
                use of the material is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                <strong>Accuracy statement:</strong> A statement that the information in the notification is 
                accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner 
                of an exclusive right that is allegedly infringed.
              </li>
              <li>
                <strong>Physical or electronic signature:</strong> Your physical or electronic signature.
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">How to Submit a DMCA Notice</h4>
            <p className="text-blue-800 mb-4">
              Please send your DMCA notice to our designated agent:
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-900 font-medium">DMCA Agent</p>
              <p className="text-gray-700">Email: <a href="mailto:dmca@imagegenfree.com" className="text-blue-600 hover:text-blue-800">dmca@imagegenfree.com</a></p>
              <p className="text-gray-700">Subject Line: "DMCA Takedown Notice"</p>
            </div>
          </div>
        </section>

        {/* Our Response Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Response Process</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receipt and Review</h3>
                <p className="text-gray-700">
                  We will acknowledge receipt of your DMCA notice within 24 hours and begin reviewing 
                  the claim to ensure it meets all legal requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Investigation</h3>
                <p className="text-gray-700">
                  If the notice is valid, we will investigate the alleged infringement and take 
                  appropriate action, which may include removing or disabling access to the material.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Response</h3>
                <p className="text-gray-700">
                  We will respond to your notice within 10 business days, informing you of the 
                  actions taken and any additional information required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Counter-Notification */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Counter-Notification</h2>
          
          <p className="text-gray-700 mb-6">
            If you believe that material you posted was removed or disabled by mistake or misidentification, 
            you may file a counter-notification. Your counter-notification must include:
          </p>

          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
            <li>Identification of the material that was removed or disabled</li>
            <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
            <li>Your name, address, and telephone number</li>
            <li>Consent to the jurisdiction of the federal court in your district</li>
            <li>Your physical or electronic signature</li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-2">Submit Counter-Notification</h4>
            <p className="text-green-800 mb-4">
              Send your counter-notification to:
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-900 font-medium">DMCA Agent</p>
              <p className="text-gray-700">Email: <a href="mailto:dmca@imagegenfree.com" className="text-green-600 hover:text-green-800">dmca@imagegenfree.com</a></p>
              <p className="text-gray-700">Subject Line: "DMCA Counter-Notification"</p>
            </div>
          </div>
        </section>

        {/* Repeat Infringer Policy */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Repeat Infringer Policy</h2>
          
          <p className="text-gray-700 mb-6">
            ImageGenFree has a policy of terminating, in appropriate circumstances, the accounts of users 
            who are repeat infringers. We will terminate accounts that have been the subject of multiple 
            valid DMCA notices.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h4 className="font-semibold text-red-900 mb-2">Warning</h4>
            <p className="text-red-800">
              <strong>False Claims:</strong> Knowingly making a false claim of copyright infringement 
              may result in liability for damages, including costs and attorney's fees. Please ensure 
              your claims are valid before submitting a DMCA notice.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
          <p className="text-blue-100 mb-6">
            If you have questions about our DMCA policy or need assistance with a copyright claim, 
            please don't hesitate to contact us.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">DMCA Inquiries</h3>
              <p className="text-blue-100 mb-2">For copyright-related matters:</p>
              <a href="mailto:dmca@imagegenfree.com" className="text-white font-medium hover:text-blue-200">
                dmca@imagegenfree.com
              </a>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">General Support</h3>
              <p className="text-blue-100 mb-2">For other questions:</p>
              <a href="mailto:support@imagegenfree.com" className="text-white font-medium hover:text-blue-200">
                support@imagegenfree.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

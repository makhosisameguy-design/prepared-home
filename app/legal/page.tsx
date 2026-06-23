import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#0075ff] hover:text-[#0053d1] font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Legal & Policies</h1>
          <p className="text-slate-600 leading-relaxed mb-4">
            This page is a placeholder for legal and policy information. You can add terms of service, privacy policy, and other important notices here.
          </p>
          <div className="space-y-6 mt-8 text-slate-600">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Privacy Policy</h2>
              <p>Explain how user data is handled, stored, and shared, and describe privacy protections.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Terms of Service</h2>
              <p>Describe the rules and expectations for using Prepared Home, including user responsibilities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

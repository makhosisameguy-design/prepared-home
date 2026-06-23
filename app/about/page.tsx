import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 mb-4">About Prepared Home</h1>
          <p className="text-slate-600 leading-relaxed mb-4">
            Prepared Home helps tenants connect with landlords, browse verified rental listings, and pay deposits securely.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            This page is a placeholder for the About content. You can add details about your mission, features, values, and how the platform works.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 mt-8">
            <div className="rounded-2xl bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">For Tenants</h2>
              <p className="text-slate-600">Browse listings, book with confidence, and pay deposits securely through the platform.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">For Landlords</h2>
              <p className="text-slate-600">List properties, manage bookings, and keep your listings updated in one place.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function BookingSuccessPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Confirmed</h1>
                    <p className="text-slate-500 mb-6">Your payment was successful. The landlord will review and confirm your booking shortly.</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/dashboard" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-[#0075ff] hover:bg-[#0053d1] text-white font-semibold px-5 py-3 rounded-xl transition">Go to My Bookings</button>
                        </Link>

                        <Link href="/" className="w-full sm:w-auto">
                            <button className="w-full sm:w-auto border border-slate-200 bg-white text-slate-700 px-5 py-3 rounded-xl transition">Back to Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
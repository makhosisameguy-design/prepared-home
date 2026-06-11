'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CalendarCheck, Clock, MessageSquare } from 'lucide-react'

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const [listingId, setListingId] = useState('')
    const router = useRouter()
    const [date, setDate] = useState('')
    const [duration, setDuration] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function getParams() {
            const { id } = await params
            setListingId(id)
        }
        getParams()
    }, [])

    async function handleBooking() {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
            router.push('/login')
            return
        }
        const { error } = await supabase.from('Bookings').insert({
            listing_id: listingId,
            tenant_id: data.session?.user.id,
            date: date,
            duration: duration,
            message: message,
            status: 'pending',
        })
        if (error) {
            alert(error.message)
        } else {
            const payfastparams = new URLSearchParams({
                merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID!,
                merchant_key: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY!,
                amount: '500.00',
                item_name: 'Rental Deposit',
                return_url: 'https://prepared-home.vercel.app/booking/success',
                cancel_url: 'https://prepared-home.vercel.app/booking/cancel',
            })
            window.location.href = `https://sandbox.payfast.co.za/eng/process?${payfastparams}`
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CalendarCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Book Your Stay</h1>
                    <p className="text-slate-500 mt-2">Fill in the details to complete your booking</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex flex-col gap-5">

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-violet-500" />
                                Move in Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <Clock className="w-4 h-4 text-violet-500" />
                                Duration of Stay (months)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 6"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-violet-500" />
                                Message to Host (optional)
                            </label>
                            <textarea
                                placeholder="Introduce yourself or ask any questions..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            />
                        </div>

                        <div className="bg-violet-50 rounded-xl p-4 text-sm text-violet-700">
                            💳 You will be redirected to PayFast to pay your deposit securely after confirming.
                        </div>

                        <button
                            type="button"
                            onClick={handleBooking}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <CalendarCheck className="w-5 h-5" />
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { MapPin, DollarSign, Building2, MessageSquare, CalendarCheck } from 'lucide-react'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: listing } = await supabase.from('Listings').select('*').eq('id', id).single()

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                
                {/* Images */}
                {listing?.image_url ? (
                    <div className="w-full h-72 rounded-2xl overflow-hidden mb-8">
                        <img
                            src={listing.image_url}
                            alt={listing.Title || 'Listing photo'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-8">
                        <Building2 className="w-24 h-24 text-violet-300" />
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    
                    {/* Main Details */}
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold text-slate-900 mb-3">{listing.Title}</h1>
                        
                        <div className="flex items-center gap-2 text-slate-500 mb-6">
                            <MapPin className="w-4 h-4" />
                            <span>{listing.Location}</span>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">About this property</h2>
                            <p className="text-slate-500">A great space available for rent in {listing.Location}.</p>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-3xl font-bold text-violet-600">R {listing.Price}</span>
                                <span className="text-slate-500 text-sm">/month</span>
                            </div>

                            <Link href={`/booking/${id}`}>
                                <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mb-3 transition">
                                    <CalendarCheck className="w-5 h-5" />
                                    Book Now
                                </button>
                            </Link>

                            <Link href={`/messages/new?listing_id=${id}&landlord_id=${listing.landlord_id}`}>
                                <button className="w-full border border-violet-200 text-violet-600 hover:bg-violet-50 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition">
                                    <MessageSquare className="w-5 h-5" />
                                    Contact Landlord
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
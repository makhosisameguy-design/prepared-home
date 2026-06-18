import Link from 'next/link'
import ListingCarousel from '@/app/components/ListingCarousel'
import { supabase } from '@/lib/supabase'
import { MapPin, DollarSign, Building2, MessageSquare, CalendarCheck, Calendar, User, HomeIcon } from 'lucide-react'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { data: listing } = await supabase.from('Listings').select('*').eq('id', id).single()
    const landlordId = listing?.landlord_id

    let images: string[] = []

    if (listing?.image_url) {
      const rawImage = listing.image_url
      if (typeof rawImage === 'string' && rawImage.startsWith('[')) {
        try {
          images = JSON.parse(rawImage)
        } catch {
          images = [rawImage]
        }
      } else if (Array.isArray(rawImage)) {
        images = rawImage
      } else {
        images = [rawImage]
      }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                
                {/* Images */}
                {images.length > 0 ? (
                    <ListingCarousel images={images} alt={listing?.Title || 'Listing photo'} />
                ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-[#eff4ff] to-[#d2e7ff] rounded-2xl flex items-center justify-center mb-8">
                        <Building2 className="w-24 h-24 text-[#80b3ff]" />
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
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Property Details</h2>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                            {(listing.about_property || listing.requirements) && (
                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                  <p className="text-sm text-slate-500">About this property</p>
                                  <p className="mt-1 text-slate-900">{listing.about_property || listing.requirements}</p>
                                </div>
                              )}

                              {listing.accommodation_type && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                  <p className="text-sm text-slate-500">Accommodation Type</p>
                                  <p className="mt-1 font-medium text-slate-900">{listing.accommodation_type}</p>
                                </div>
                              )}
                              {listing.room_type && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                  <p className="text-sm text-slate-500">Room Type</p>
                                  <p className="mt-1 font-medium text-slate-900">{listing.room_type}</p>
                                </div>
                              )}
                              {listing.rooms && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                  <p className="text-sm text-slate-500">Number of Rooms</p>
                                  <p className="mt-1 font-medium text-slate-900">{listing.rooms}</p>
                                </div>
                              )}
                              {listing.address && (
                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                  <p className="text-sm text-slate-500">Full Address</p>
                                  <p className="mt-1 font-medium text-slate-900">{listing.address}</p>
                                </div>
                              )}
                              {listing.availability_date && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                  <p className="text-sm text-slate-500">Available From</p>
                                  <p className="mt-1 font-medium text-slate-900">{new Date(listing.availability_date).toLocaleDateString()}</p>
                                </div>
                              )}
                              {listing.deposit && (
                                <div className="rounded-2xl bg-slate-50 p-4">
                                  <p className="text-sm text-slate-500">Deposit</p>
                                  <p className="mt-1 font-medium text-slate-900">R {listing.deposit}</p>
                                </div>
                              )}
                              {listing.amenities && (
                                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                  <p className="text-sm text-slate-500">Amenities</p>
                                  <p className="mt-1 font-medium text-slate-900">{listing.amenities}</p>
                                </div>
                              )}
                            </div>
                        </div>

                    </div>

                    {/* Booking Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-3xl font-bold text-[#0075ff]">R {listing.Price}</span>
                                <span className="text-slate-500 text-sm">/month</span>
                            </div>

                            <Link href={`/booking/${id}`}>
                                <button className="w-full bg-[#0075ff] hover:bg-[#0053d1] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mb-3 transition">
                                    <CalendarCheck className="w-5 h-5" />
                                    Book Now
                                </button>
                            </Link>

                            <Link href={`/messages/new?listing_id=${id}&landlord_id=${listing.landlord_id}`}>
                                <button className="w-full border border-[#b3d7ff] text-[#0075ff] hover:bg-[#eff4ff] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition">
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
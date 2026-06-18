'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin, CalendarCheck, Clock, Building2, DollarSign, Home } from 'lucide-react'
import ListingCarousel from '@/app/components/ListingCarousel'

// Helper function to parse image URLs from listing
function getListingImages(imageUrl: string): string[] {
    if (!imageUrl) return []
    try {
        // Try to parse as JSON array
        const parsed = JSON.parse(imageUrl)
        return Array.isArray(parsed) ? parsed : [imageUrl]
    } catch {
        // If parsing fails, treat as single URL string
        return imageUrl ? [imageUrl] : []
    }
}

export default function DashboardPage() {
    const router = useRouter()
    const [bookings, setBookings] = useState<any[]>([])

    useEffect(() => {
        async function loadBookings() {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.push('/login')
                return
            }
            const { data: bookingsData } = await supabase
                .from('Bookings')
                .select('*, Listings(*)')
                .eq('tenant_id', data.session.user.id)
            setBookings(bookingsData || [])
        }
        loadBookings()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
                    <p className="text-slate-500 mt-1">Track and manage your rental bookings</p>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings yet</h3>
                        <p className="text-slate-500">Start exploring properties to make your first booking</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {bookings.map((booking: any) => {
                            const images = getListingImages(booking.Listings?.image_url)
                            return (
                            <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                {/* Listing Images */}
                                {images.length > 0 && <ListingCarousel images={images} alt={booking.Listings?.Title} />}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900">{booking.Listings?.Title}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1 mb-3">
                                            <MapPin className="w-4 h-4" />
                                            {booking.Listings?.Location}
                                        </div>
                                        <p className="text-[#0075ff] font-bold text-lg mb-3">R {booking.Listings?.Price}/month</p>

                                        {/* Listing Details */}
                                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                            {booking.Listings?.rooms && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Building2 className="w-4 h-4 text-[#0075ff]" />
                                                    <span>{booking.Listings.rooms} rooms</span>
                                                </div>
                                            )}
                                            {booking.Listings?.room_type && (
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Home className="w-4 h-4 text-[#0075ff]" />
                                                    <span>{booking.Listings.room_type}</span>
                                                </div>
                                            )}
                                            {booking.Listings?.amenities && (
                                                <div className="col-span-2 flex items-start gap-2 text-slate-600">
                                                    <DollarSign className="w-4 h-4 text-[#0075ff] mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{booking.Listings.amenities}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ml-4 ${
                                        booking.status === 'confirmed' 
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : booking.status === 'cancelled'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-amber-100 text-amber-600'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Booking Dates */}
                                <div className="flex items-center gap-6 text-sm text-slate-500 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <CalendarCheck className="w-4 h-4 text-[#0075ff]" />
                                        {booking.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-[#0075ff]" />
                                        {booking.duration} months
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
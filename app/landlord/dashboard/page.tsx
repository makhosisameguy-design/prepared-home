'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building2, MapPin, Plus, Pencil, Trash2, Grid3X3, Tag, Calendar, Clock } from 'lucide-react'
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

export default function LandlordDashboardPage() {
    const router = useRouter()
    const [listings, setListings] = useState<any[]>([])
    const [bookingRequests, setBookingRequests] = useState<any[]>([])
    const [requestLoading, setRequestLoading] = useState<{ [key: number]: boolean }>({})
    const [requestBanner, setRequestBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    async function fetchBookingRequests(listingIds: number[]) {
        if (listingIds.length === 0) {
            setBookingRequests([])
            return
        }

        const { data: bookingsData, error } = await supabase
            .from('Bookings')
            .select('*, Listings(*)')
            .in('listing_id', listingIds)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to load booking requests:', error)
            setBookingRequests([])
            return
        }

        setBookingRequests(bookingsData || [])
    }

    async function loadData() {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
            router.push('/login')
            return
        }

        const userId = data.session.user.id
        const { data: listingsData, error: listingsError } = await supabase
            .from('Listings')
            .select('*')
            .eq('landlord_id', userId)

        if (listingsError) {
            console.error('Failed to load listings:', listingsError)
            setListings([])
            setBookingRequests([])
            return
        }

        setListings(listingsData || [])

        const listingIds = (listingsData || []).map((listing: any) => listing.id)
        await fetchBookingRequests(listingIds)
    }

    useEffect(() => {
        loadData()
    }, [])

    // Subscribe to realtime booking changes for landlord's listings
    useEffect(() => {
        if (!listings || listings.length === 0) return

        const listingIds = listings.map((l) => l.id)

        const channel = supabase
            .channel('public:bookings-listener')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Bookings' }, (payload) => {
                const changedListingId = (payload.new as any)?.listing_id ?? (payload.old as any)?.listing_id
                if (listingIds.includes(changedListingId)) {
                    // Re-fetch pending requests for current listings
                    fetchBookingRequests(listingIds)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [listings])

    async function handleDelete(id: number) {
        const { error } = await supabase.from('Listings').delete().eq('id', id)
        if (error) {
            alert(error.message)
        } else {
            setListings(listings.filter((listing) => listing.id !== id))
        }
    }

    async function handleBookingDecision(bookingId: number, newStatus: string) {
        setRequestLoading((prev) => ({ ...prev, [bookingId]: true }))

        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
            router.push('/login')
            return
        }

        const bookingRequest = bookingRequests.find((request) => request.id === bookingId) as any
        if (!bookingRequest) {
            setRequestLoading((prev) => ({ ...prev, [bookingId]: false }))
            setRequestBanner({ type: 'error', message: 'Unable to find the booking request.' })
            return
        }

        const { data: updatedRows, error: updateError } = await supabase.from('Bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)
            .select()

        setRequestLoading((prev) => ({ ...prev, [bookingId]: false }))

        if (updateError || !updatedRows || updatedRows.length === 0) {
            setRequestBanner({ type: 'error', message: updateError?.message || 'Failed to update booking status.' })
            return
        }

        if (newStatus === 'confirmed') {
            const { error: deleteError } = await supabase.from('Listings')
                .delete()
                .eq('id', bookingRequest.listing_id)

            if (deleteError) {
                setRequestBanner({ type: 'error', message: `Booking confirmed, but failed to remove listing: ${deleteError.message}` })
                return
            }

            setListings((current) => current.filter((listing) => listing.id !== bookingRequest.listing_id))
        }

        const messageContent = newStatus === 'confirmed'
            ? `Your booking request for ${bookingRequest.Listings?.Title || 'the property'} has been approved.`
            : `Your booking request for ${bookingRequest.Listings?.Title || 'the property'} has been declined.`

        const { error: messageError } = await supabase.from('messages').insert({
            sender_id: sessionData.session.user.id,
            receiver_id: bookingRequest.tenant_id,
            listing_id: bookingRequest.listing_id,
            content: messageContent,
        })

        if (messageError) {
            setRequestBanner({ type: 'error', message: `Booking updated, but message failed: ${messageError.message}` })
            return
        }

        const listingIds = listings
            .filter((listing) => listing.id !== bookingRequest.listing_id)
            .map((listing) => listing.id)
        await fetchBookingRequests(listingIds)

        setRequestBanner({
            type: 'success',
            message: newStatus === 'confirmed'
                ? 'Booking approved successfully and listing taken down.'
                : 'Booking request declined.',
        })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Listings</h1>
                        <p className="text-slate-500 mt-1">Manage your rental properties</p>
                    </div>
                    <Link href="/landlord/listings/new">
                        <button className="flex items-center gap-2 bg-[#0075ff] hover:bg-[#0053d1] text-white font-semibold px-5 py-3 rounded-xl transition">
                            <Plus className="w-5 h-5" />
                            New Listing
                        </button>
                    </Link>
                </div>

                {/* Listings */}
                {listings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No listings yet</h3>
                        <p className="text-slate-500 mb-6">Create your first listing to start renting</p>
                        <Link href="/landlord/listings/new">
                            <button className="flex items-center gap-2 bg-[#0075ff] hover:bg-[#0053d1] text-white font-semibold px-5 py-3 rounded-xl transition mx-auto">
                                <Plus className="w-5 h-5" />
                                Create Listing
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            {requestBanner && (
                                <div className={`rounded-2xl p-4 mb-4 text-sm font-medium flex items-start justify-between gap-4 ${
                                    requestBanner.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    <div>{requestBanner.message}</div>
                                    <button
                                        type="button"
                                        onClick={() => setRequestBanner(null)}
                                        className="text-slate-500 hover:text-slate-900 transition"
                                        aria-label="Dismiss banner"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Booking Requests</h2>
                                    <p className="text-slate-500 text-sm">Review tenant requests after payment and confirm reservations.</p>
                                </div>
                            </div>

                            {bookingRequests.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                                    No booking requests yet. Once a tenant pays, requests will appear here.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookingRequests.map((request: any) => {
                                        const images = getListingImages(request.Listings?.image_url)
                                        return (
                                            <div key={request.id} className="rounded-2xl border border-slate-200 p-5">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-28 h-20 rounded-2xl overflow-hidden bg-slate-100">
                                                        {images.length > 0 ? (
                                                            <img src={images[0]} alt={request.Listings?.Title ?? 'Listing image'} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-slate-400 text-xs">No image</div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div>
                                                                <p className="text-sm text-slate-500">{request.Listings?.Title}</p>
                                                                <h3 className="text-lg font-semibold text-slate-900">{request.Listings?.Location}</h3>
                                                            </div>
                                                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                                request.status === 'confirmed'
                                                                    ? 'bg-emerald-100 text-emerald-600'
                                                                    : request.status === 'cancelled'
                                                                    ? 'bg-red-100 text-red-600'
                                                                    : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                                {request.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-[#0075ff]" />
                                                                <span>{request.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-[#0075ff]" />
                                                                <span>{request.duration} months</span>
                                                            </div>
                                                        </div>
                                                        <p className="mt-3 text-sm text-slate-500 line-clamp-2">{request.message || 'No additional message provided.'}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <button
                                                        disabled={requestLoading[request.id] || request.status !== 'pending'}
                                                        onClick={() => handleBookingDecision(request.id, 'confirmed')}
                                                        className="rounded-xl bg-[#0075ff] hover:bg-[#0053d1] text-white px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={requestLoading[request.id] || request.status !== 'pending'}
                                                        onClick={() => handleBookingDecision(request.id, 'cancelled')}
                                                        className="rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-2 text-sm font-semibold transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </section>

                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">Your Listings</h2>
                                    <p className="text-slate-500 text-sm">Manage and edit all properties you currently have listed.</p>
                                </div>
                            </div>

                            {listings.map((listing: any) => {
                                const images = getListingImages(listing.image_url)
                                return (
                                <div key={listing.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                    {/* Listing Images */}
                                    {images.length > 0 && <ListingCarousel images={images} alt={listing.Title} />}

                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">{listing?.Title}</h3>
                                            
                                            {/* Location & Price */}
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    {listing?.Location}
                                                </div>
                                                <p className="text-[#0075ff] font-bold text-lg">R {listing?.Price}/month</p>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                                {listing?.rooms && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Building2 className="w-4 h-4 text-[#0075ff]" />
                                                        <span>{listing.rooms} rooms</span>
                                                    </div>
                                                )}
                                                {listing?.room_type && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Tag className="w-4 h-4 text-[#0075ff]" />
                                                        <span>{listing.room_type}</span>
                                                    </div>
                                                )}
                                                {listing?.amenities && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Grid3X3 className="w-4 h-4 text-[#0075ff]" />
                                                        <span className="line-clamp-1">{listing.amenities}</span>
                                                    </div>
                                                )}
                                                {listing?.availability_date && (
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Calendar className="w-4 h-4 text-[#0075ff]" />
                                                        <span>{new Date(listing.availability_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {listing?.deposit && (
                                                <p className="text-xs text-slate-500 mb-4">
                                                    <span className="font-medium">Deposit:</span> R {listing.deposit}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 ml-4">
                                            <Link href={`/landlord/listings/${listing.id}/edit`}>
                                                <button className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:border-[#7fb8ff] hover:text-[#0075ff] text-sm font-medium px-4 py-2 rounded-xl transition">
                                                    <Pencil className="w-4 h-4" />
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-500 text-sm font-medium px-4 py-2 rounded-xl transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
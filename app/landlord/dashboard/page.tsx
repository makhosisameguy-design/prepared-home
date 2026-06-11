'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building2, MapPin, Plus, Pencil, Trash2 } from 'lucide-react'

export default function LandlordDashboardPage() {
    const router = useRouter()
    const [listings, setListings] = useState<any[]>([])

    useEffect(() => {
        async function loadListings() {
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.push('/login')
                return
            }
            const { data: listingsData } = await supabase
                .from('Listings')
                .select('*')
                .eq('landlord_id', data.session.user.id)
            setListings(listingsData || [])
        }
        loadListings()
    }, [])

    async function handleDelete(id: number) {
        const { error } = await supabase.from('Listings').delete().eq('id', id)
        if (error) {
            alert(error.message)
        } else {
            setListings(listings.filter((listing) => listing.id !== id))
        }
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
                        <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl transition">
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
                            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl transition mx-auto">
                                <Plus className="w-5 h-5" />
                                Create Listing
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {listings.map((listing: any) => (
                            <div key={listing.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{listing?.Title}</h3>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                                            <MapPin className="w-4 h-4" />
                                            {listing?.Location}
                                        </div>
                                        <p className="text-violet-600 font-bold text-xl">R {listing?.Price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/landlord/listings/${listing.id}/edit`}>
                                            <button className="flex items-center gap-1 border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 text-sm font-medium px-4 py-2 rounded-xl transition">
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
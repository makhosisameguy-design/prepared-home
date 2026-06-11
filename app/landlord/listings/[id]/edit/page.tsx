'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building2, MapPin, DollarSign, Save } from 'lucide-react'

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState('')

    useEffect(() => {
        async function loadListing() {
            const { id } = await params
            setId(id)
            const { data } = await supabase.from('Listings').select('*').eq('id', id).single()
            if (data) {
                setTitle(data.Title)
                setLocation(data.Location)
                setPrice(data.Price)
            }
        }
        loadListing()
    }, [])

    async function handleUpdate() {
        const { error } = await supabase.from('Listings').update({
            Title: title,
            Location: location,
            Price: price,
        }).eq('id', id)

        if (error) {
            alert(error.message)
        } else {
            router.push('/landlord/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Listing</h1>
                    <p className="text-slate-500 mt-2">Update your property details</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex flex-col gap-5">

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-violet-500" />
                                Property Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sandton Conference Room"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-violet-500" />
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sandton, Johannesburg"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-violet-500" />
                                Monthly Price (R)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition mt-2"
                        >
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
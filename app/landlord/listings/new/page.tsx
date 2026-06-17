'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building2, MapPin, DollarSign, Plus, Calendar, ListChecks } from 'lucide-react'

export default function NewListingPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState('')
    const [accommodationType, setAccommodationType] = useState('room')
    const [roomType, setRoomType] = useState('')
    const [rooms, setRooms] = useState('')
    const [address, setAddress] = useState('')
    const [amenities, setAmenities] = useState('')
    const [availabilityDate, setAvailabilityDate] = useState('')
    const [deposit, setDeposit] = useState('')
    const [requirements, setRequirements] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)


    async function handleCreate() {
        const { data } = await supabase.auth.getSession()
    if (!data.session) {
        router.push('/login')
        return
    }

    let imageUrl = ''

    if (imageFile) {
        const fileName = `${data.session.user.id}/${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
            .from('listing-photos')
            .upload(fileName, imageFile)

        if (uploadError) {
            alert(uploadError.message)
            return
        }

        const { data: urlData } = supabase.storage
            .from('listing-photos')
            .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('Listings').insert({
        Title: title,
        Location: location,
        Price: price,
        landlord_id: data.session?.user.id,
        accommodation_type: accommodationType,
        room_type: roomType,
        rooms: rooms,
        address: address,
        amenities: amenities,
        availability_date: availabilityDate,
        deposit: deposit,
        requirements: requirements,
        image_url: imageUrl,
    })
    if (error) {
        alert(error.message)
    } else {
        router.push('/landlord/dashboard')
    }
}

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-lg">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create a Listing</h1>
                    <p className="text-slate-500 mt-2">Add your property to Prepared Home</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex flex-col gap-5">

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Accommodation Type</label>
                            <select
                                value={accommodationType}
                                onChange={(e) => setAccommodationType(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            >
                                <option value="room">Room</option>
                                <option value="house">Standalone house</option>
                                <option value="house">Estate house</option>
                                <option value="apartment">Apartment</option>
                                <option value="informal">Informal (eg. shack)</option>
                            </select>
                        </div>

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

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Number of Rooms</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 2"
                                    value={rooms}
                                    onChange={(e) => setRooms(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Room Type</label>
                                <input
                                    type="text"
                                    placeholder="e.g. ensuite"
                                    value={roomType}
                                    onChange={(e) => setRoomType(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-violet-500" />
                                Location (suburb/city)
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
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Full Address</label>
                            <input
                                type="text"
                                placeholder="Street address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-violet-500" />
                                Amenities (comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. WiFi, Parking, Furnished"
                                value={amenities}
                                onChange={(e) => setAmenities(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
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
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Deposit (R)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={deposit}
                                    onChange={(e) => setDeposit(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-500" />
                                Available From
                            </label>
                            <input
                                type="date"
                                value={availabilityDate}
                                onChange={(e) => setAvailabilityDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Requirements before move-in</label>
                            <textarea
                                placeholder="e.g. First and last month's rent, proof of income"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                rows={3}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            />
                        </div>
                        <div>
                                <label className="text-sm font-medium text-slate-700 mb-1 block">Property Photo</label>
                                 <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition mt-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Listing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
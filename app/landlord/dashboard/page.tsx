'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
        
            const { data: listingsData } = await supabase.from('Listings').select('*').eq('landlord_id', data.session.user.id)
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
        <main>
            <h1>Landlord Dashboard</h1>
        <Link href={`/landlord/listings/new/`}> 
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              New listing
            </button>
          </Link> 
            <p>Your listings:</p>
             {listings.map((listing: any) => (
    <div key={listing.id}>
        <p>{listing?.Title}</p>
        <p>{listing?.Location}</p>
        <p>Price: R{listing?.Price}</p>
        <Link href={`/landlord/listings/${listing.id}/edit`}>
            <button>Edit </button>
        </Link>
        <button onClick={() => handleDelete(listing.id)}>Delete</button>
    </div>
                ))}
        </main>
    )
}
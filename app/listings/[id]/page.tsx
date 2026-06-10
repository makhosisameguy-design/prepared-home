import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params
    const { data: listing } = await supabase.from('Listings').select('*').eq('id', id).single()
    return (
        <main>
        <div>
            <h1>{listing.Title}</h1>
            <h1>{listing.Location}</h1>
            <h1>{listing.Price}</h1>
        </div>
        <Link href={`/booking/${id}`}>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              Verify ID to Book
            </button>
        </Link>
    <Link href={`/messages/new?listing_id=${id}&landlord_id=${listing.landlord_id}`}>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">
        Contact Landlord
        </button>
    </Link>
        </main>
    )
}
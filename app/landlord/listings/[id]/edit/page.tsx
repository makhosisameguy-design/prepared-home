'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
        <main>
            <h1>Edit Listing</h1>
            <form>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <button type="button" onClick={handleUpdate}>Save Changes</button>
            </form>
        </main>
    )
}
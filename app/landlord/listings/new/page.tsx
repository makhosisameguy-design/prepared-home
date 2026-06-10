'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewListingPage () {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [price, setPrice] = useState('')  

    async function handleCreate() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.push('/login')
      return
        }
    
    
        const { error } = await supabase.from('Listings').insert({
            Title: title,
            Location: location,
            Price: price,
            landlord_id: data.session?.user.id,
        })
        if (error) {
            console.error('Error creating listing:', error)
        } else {
            router.push('/landlord/dashboard')
        }
    }

return (
        <main>
          
          <h1>Create Listing</h1>
          <form>
            <input 
                type="text" 
                placeholder="Name of Property"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <input 
                type="number" 
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
    
            <button type="button" onClick={handleCreate}>
                Create Listing
            </button>
          </form>
            
        </main>
    )
}
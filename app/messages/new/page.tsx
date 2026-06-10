'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

export default function NewMessagePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const listingId = searchParams.get('listing_id')
    const landlordId = searchParams.get('landlord_id')
    const [content, setContent] = useState('')

    async function handleSend() {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
            router.push('/login')
            return
        }

        const { data, error } = await supabase.from('messages').insert({
            sender_id: sessionData.session.user.id,
            receiver_id: landlordId,
            listing_id: listingId,
            content: content,
        }).select().single()

        if (error) {
            alert(error.message)
        } else {
            router.push(`/messages/${data.id}`)
        }
    }

    return (
        <main>
            <h1>Contact Landlord</h1>
            <div>
                <textarea
                    placeholder="Type your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="button" onClick={handleSend}>Send Message</button>
            </div>
        </main>
    )
}
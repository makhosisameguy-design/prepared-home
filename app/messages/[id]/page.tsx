'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [listingId, setListingId] = useState('')
    const [receiverId, setReceiverId] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(() => {
        async function loadConversation() {
            const { id } = await params
            const { data: sessionData } = await supabase.auth.getSession()
            if (!sessionData.session) {
                router.push('/login')
                return
            }

            setUserId(sessionData.session.user.id)

            const { data: messageData } = await supabase
                .from('messages')
                .select('*')
                .eq('id', id)
                .single()

            if (messageData) {
                setListingId(messageData.listing_id)
                setReceiverId(
                    messageData.sender_id === sessionData.session.user.id
                        ? messageData.receiver_id
                        : messageData.sender_id
                )
            }

            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${sessionData.session.user.id},receiver_id.eq.${sessionData.session.user.id}`)
                .eq('listing_id', messageData?.listing_id)
                .order('created_at', { ascending: true })

            setMessages(data || [])
        }
        loadConversation()
    }, [])

    async function handleSend() {
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) return

        const { error } = await supabase.from('messages').insert({
            sender_id: sessionData.session.user.id,
            receiver_id: receiverId,
            listing_id: listingId,
            content: newMessage,
        })

        if (error) {
            alert(error.message)
        } else {
            setNewMessage('')
            // Reload messages
            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${sessionData.session.user.id},receiver_id.eq.${sessionData.session.user.id}`)
                .eq('listing_id', listingId)
                .order('created_at', { ascending: true })
            setMessages(data || [])
        }
    }

    return (
        <main>
            <h1>Conversation</h1>
            <div>
                {messages.map((message: any) => (
                    <div key={message.id}>
                        <p>{message.sender_id === userId ? 'You' : 'Them'}: {message.content}</p>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="button" onClick={handleSend}>Send</button>
            </div>
        </main>
    )
}

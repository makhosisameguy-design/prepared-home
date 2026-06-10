'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MessagesPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        async function loadMessages() {
            const { data: sessionData } = await supabase.auth.getSession()
            if (!sessionData.session) {
                router.push('/login')
                return
            }

            const { data } = await supabase
                .from('messages')
                .select('*, Listings(*)')
                .or(`sender_id.eq.${sessionData.session.user.id},receiver_id.eq.${sessionData.session.user.id}`)
                .order('created_at', { ascending: false })

            setMessages(data || [])
            console.log('messages:', data)
        }
        loadMessages()
    }, [])

    return (
        <main>
            <h1>Messages</h1>
            <div>
                {messages.map((message: any) => (
                    <div key={message.id}>
                        <p>{message.Listings?.Title}</p>
                        <p>{message.content}</p>
                        <Link href={`/messages/${message.id}`}>
                            <button>View</button>
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    )
}
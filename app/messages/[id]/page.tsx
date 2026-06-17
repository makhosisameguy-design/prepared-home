'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Send } from 'lucide-react'

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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col flex-1">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Conversation</h1>
                </div>

                {/* Messages */}
                <div className="flex-1 flex flex-col gap-3 mb-6">
                    {messages.map((message: any) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                                message.sender_id === userId
                                    ? 'bg-[#0075ff] text-white rounded-br-sm'
                                    : 'bg-white border border-slate-100 text-slate-900 rounded-bl-sm'
                            }`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        className="bg-[#0075ff] hover:bg-[#0053d1] text-white p-2 rounded-xl transition"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </div>
    )
}
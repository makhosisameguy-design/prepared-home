'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MessageSquare, Building2, ArrowRight } from 'lucide-react'

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
        }
        loadMessages()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
                    <p className="text-slate-500 mt-1">Your conversations with landlords and tenants</p>
                </div>

                {/* Messages List */}
                {messages.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No messages yet</h3>
                        <p className="text-slate-500">Contact a landlord from a listing to start a conversation</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {messages.map((message: any) => (
                            <div key={message.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:border-[#b3d7ff] transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#e6f0ff] rounded-xl flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-[#0075ff]" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{message.Listings?.Title}</p>
                                            <p className="text-slate-500 text-sm truncate max-w-xs">{message.content}</p>
                                        </div>
                                    </div>
                                    <Link href={`/messages/${message.id}`}>
                                        <button className="flex items-center gap-1 text-[#0075ff] hover:text-[#0053d1] text-sm font-medium transition">
                                            View
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
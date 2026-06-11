'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { MessageSquare, Send } from 'lucide-react'

function NewMessageContent() {
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Contact Landlord</h1>
                    <p className="text-slate-500 mt-2">Send a message to the property owner</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">
                                Your Message
                            </label>
                            <textarea
                                placeholder="Introduce yourself or ask any questions about the property..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSend}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function NewMessagePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewMessageContent />
        </Suspense>
    )
}
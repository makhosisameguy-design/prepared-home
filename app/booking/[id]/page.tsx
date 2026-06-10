'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const [listingId, setListingId] = useState('')
    const router = useRouter()
    const [date, setDate] = useState('')
    const [duration, setDuration] = useState('')
    const [message, setMessage] = useState('')

useEffect(() => {
        async function getParams() {
            const { id } = await params
            setListingId(id)
        }
        getParams()
    }, [])

async function handleBooking() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      router.push('/login')
      return
}
    const { error } = await supabase.from('Bookings').insert({

        listing_id: listingId,
        tenant_id: data.session?.user.id,
        date: date,
        duration: duration,
        message: message,
        status: 'pending',
    })
        if (error) {alert(error.message)}
         else {
  const payfastparams = new URLSearchParams({
  merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID!,
  merchant_key: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY!,
  amount: '500.00',
  item_name: 'Rental Deposit',
  return_url: 'http://localhost:3000/booking/success',
  cancel_url: 'http://localhost:3000/booking/cancel',
})
window.location.href = `https://sandbox.payfast.co.za/eng/process?${payfastparams}`
    }}


    return (
        <main>
          
          <h1>Book Your Stay</h1>
          <form>
            <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <input 
                type="number" 
                placeholder="Duration of Stay (months)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
            />
            <textarea 
                placeholder="Message to Host (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="button" onClick={handleBooking}>
                Confirm booking
            </button>
          </form>
            
        </main>
    )
}
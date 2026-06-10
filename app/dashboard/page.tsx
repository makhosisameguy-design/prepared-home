'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
    const router = useRouter()
    const [bookings, setBookings] = useState<any[]>([])

    useEffect(() => {
        console.log('useEffect fired')
        async function loadBookings() {
            // 1. Check if user is logged in
            const { data } = await supabase.auth.getSession()
            if (!data.session) {
                router.push('/login')
                return
            }

            const { data: bookingsData } = await supabase.from('Bookings').select('*, Listings(*)').eq('tenant_id', data.session.user.id)

            setBookings(bookingsData || [])
            console.log('bookings:', bookingsData)
        }

        loadBookings()
    }, [])

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Your bookings:</p>
            <div>
                {bookings.map((booking: any) => (
    <div key={booking.id}>
        <p>{booking.Listings?.Title}</p>
        <p>{booking.Listings?.Location}</p>
        <p>Date: {booking.date}</p>
        <p>Duration: {booking.duration} months</p>
        <p>Status: {booking.status}</p>
    </div>
                ))}
            </div>
        </main>
    )
}
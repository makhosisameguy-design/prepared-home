'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        async function checkSession() {
            const { data } = await supabase.auth.getSession()
            setIsLoggedIn(!!data.session)
        }
        checkSession()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <nav style={{ padding: '16px', borderBottom: '1px solid #ccc', display: 'flex', gap: '16px' }}>
            <Link href="/">Prepared Home</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/dashboard">My Bookings</Link>
            <Link href="/landlord/dashboard">Landlord Dashboard</Link>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <>
                    <Link href="/login">Login</Link>
                    <Link href="/signup">Sign Up</Link>
                </>
            )}
        </nav>
    )
}
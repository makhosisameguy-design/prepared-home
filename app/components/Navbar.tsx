'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Home, MessageSquare, LayoutDashboard, Building2, LogOut, LogIn, UserPlus } from 'lucide-react'

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)

   useEffect(() => {
    async function checkSession() {
        const { data } = await supabase.auth.getSession()
        setIsLoggedIn(!!data.session)
    }
    checkSession()

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsLoggedIn(!!session)
    })

    // Cleanup listener when navbar unmounts
    return () => subscription.unsubscribe()
}, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-violet-600 font-bold text-xl">
                    <Home className="w-5 h-5" />
                    Prepared Home
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-6">
                    {isLoggedIn && (
                        <>
                            <Link href="/messages" className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium transition">
                                <MessageSquare className="w-4 h-4" />
                                Messages
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium transition">
                                <LayoutDashboard className="w-4 h-4" />
                                My Bookings
                            </Link>
                            <Link href="/landlord/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium transition">
                                <Building2 className="w-4 h-4" />
                                Landlord
                            </Link>
                        </>
                    )}

                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-1 text-slate-600 hover:text-red-500 text-sm font-medium transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium transition">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
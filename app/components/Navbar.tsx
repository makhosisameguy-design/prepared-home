'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Home, MessageSquare, LayoutDashboard, Building2, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react'

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

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
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-16 flex items-center justify-start sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-violet-600 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 text-violet-600 font-bold text-lg sm:text-xl">
                        <Home className="w-5 h-5" />
                        <span className="hidden sm:inline">Prepared Home</span>
                        <span className="sm:hidden">Prepared Home</span>
                    </Link>
                </div>

                <div className="hidden sm:flex flex-row items-center gap-6">
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
                        <div className="flex flex-row items-center gap-3 w-auto">
                            <Link href="/login" className="flex items-center gap-1 text-slate-600 hover:text-violet-600 text-sm font-medium transition">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition w-auto justify-center">
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${mobileOpen ? 'flex' : 'hidden'} sm:hidden flex-col gap-2 bg-white border-b border-slate-100 px-4 pb-4`}>                
                {isLoggedIn && (
                    <>
                        <Link href="/messages" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            Messages
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            My Bookings
                        </Link>
                        <Link href="/landlord/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition text-sm font-medium">
                            <Building2 className="w-4 h-4" />
                            Landlord
                        </Link>
                    </>
                )}

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-slate-50 transition text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                ) : (
                    <>
                        <Link href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition text-sm font-medium">
                            <LogIn className="w-4 h-4" />
                            Login
                        </Link>
                        <Link href="/signup" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white transition text-sm font-medium justify-center">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
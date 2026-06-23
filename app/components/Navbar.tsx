'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { MessageSquare, LayoutDashboard, Building2, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Navbar() {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLandlord, setIsLandlord] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

   useEffect(() => {
    async function checkSession() {
        const { data } = await supabase.auth.getSession()
        const session = data.session
        setIsLoggedIn(!!session)

        if (session) {
            const accountType = (session.user.user_metadata as any)?.account_type
if (accountType === 'landlord')  {
                setIsLandlord(true)
            } else {
                try {
                    const { data: listingsData } = await supabase.from('Listings').select('id').eq('landlord_id', session.user.id).limit(1)
                    setIsLandlord(!!(listingsData && listingsData.length > 0))
                } catch (err) {
                    setIsLandlord(false)
                }
            }
        } else {
            setIsLandlord(false)
        }
    }
    checkSession()

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsLoggedIn(!!session)
        if (session) {
            const accountType = (session.user.user_metadata as any)?.account_type
            if (accountType === 'landlord') {
                setIsLandlord(true)
            } else {
                ;(async () => {
    try {
        const { data: listingsData } = await supabase.from('Listings').select('id').eq('landlord_id', session.user.id).limit(1)
            setIsLandlord(!!(listingsData && listingsData.length > 0))
            } catch {
                setIsLandlord(false)
            }
        })()
            }
        } else {
            setIsLandlord(false)
        }
    })

    // Cleanup listener when navbar unmounts
    return () => {
        subscription.unsubscribe()
    }
}, [])

// derive visibility from current pathname so it updates on client navigation

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (pathname?.startsWith('/booking/success') || pathname?.startsWith('/booking/cancel')) return null

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-16 flex items-center justify-start sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-[#0075ff] transition focus:outline-none focus:ring-2 focus:ring-[#0075ff]"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2 text-[#0075ff] font-bold text-lg sm:text-xl">
                        {/* Desktop / tablet logo */}
                        <Image src="/Logo.png" alt="Prepared Home" width={160} height={40} priority className="hidden sm:block" />
                        {/* Mobile logo (smaller) */}
                        <Image src="/Logo.png" alt="Prepared Home" width={120} height={30} priority className="block sm:hidden" />
                    </Link>
                </div>

                <div className="hidden sm:flex flex-row items-center gap-6">
                    <Link href="/about" className="text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                        About
                    </Link>
                    <Link href="/legal" className="text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                        Legal
                    </Link>
                    {isLoggedIn && (
                        <>
                            <Link href="/messages" className="flex items-center gap-1 text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                                <MessageSquare className="w-4 h-4" />
                                Messages
                            </Link>
                            <Link href="/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                                <LayoutDashboard className="w-4 h-4" />
                                My Bookings
                            </Link>
                            {isLandlord && (
                                <Link href="/landlord/dashboard" className="flex items-center gap-1 text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                                    <Building2 className="w-4 h-4" />
                                    Landlord
                                </Link>
                            )}
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
                            <Link href="/login" className="flex items-center gap-1 text-slate-600 hover:text-[#0075ff] text-sm font-medium transition">
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-1 bg-[#0075ff] hover:bg-[#0053d1] text-white text-sm font-medium px-4 py-2 rounded-lg transition w-auto justify-center">
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${mobileOpen ? 'flex' : 'hidden'} sm:hidden flex-col gap-2 bg-white border-b border-slate-100 px-4 pb-4`}>                
                <Link href="/about" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                    About
                </Link>
                <Link href="/legal" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                    Legal
                </Link>
                {isLoggedIn && (
                    <>
                        <Link href="/messages" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            Messages
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                            <LayoutDashboard className="w-4 h-4" />
                            My Bookings
                        </Link>
                        {isLandlord && (
                            <Link href="/landlord/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                                <Building2 className="w-4 h-4" />
                                Landlord
                            </Link>
                        )}
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
                        <Link href="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:text-[#0075ff] hover:bg-slate-50 transition text-sm font-medium">
                            <LogIn className="w-4 h-4" />
                            Login
                        </Link>
                        <Link href="/signup" className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[#0075ff] hover:bg-[#0053d1] text-white transition text-sm font-medium justify-center">
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
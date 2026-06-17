'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Home, UserPlus, User, Building2 } from 'lucide-react'

export default function SignupPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [accountType, setAccountType] = useState('tenant')

    async function handleSignup() {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    account_type: accountType
                }
            }
        })
       if (error) {
    alert(error.message)
} else {
    window.location.href = '/'
}
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#0075ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Home className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
                    <p className="text-slate-500 mt-2">Join Prepared Home today</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex flex-col gap-4">

                        {/* Account Type Selector */}
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAccountType('tenant')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition ${
                                        accountType === 'tenant'
                                            ? 'border-[#0075ff] bg-[#eff4ff] text-[#0075ff]'
                                            : 'border-slate-200 text-slate-500 hover:border-[#7fb8ff]'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    Tenant
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccountType('landlord')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition ${
                                        accountType === 'landlord'
                                            ? 'border-[#0075ff] bg-[#eff4ff] text-[#0075ff]'
                                            : 'border-slate-200 text-slate-500 hover:border-[#7fb8ff]'
                                    }`}
                                >
                                    <Building2 className="w-4 h-4" />
                                    Landlord
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0075ff]"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                            <input
                                type="text"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0075ff]"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0075ff]"
                            />
                        </div>

                        <button
                            onClick={handleSignup}
                            className="w-full bg-[#0075ff] hover:bg-[#0053d1] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition mt-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Sign Up
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#0075ff] hover:text-[#0053d1] font-medium">
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    )
}
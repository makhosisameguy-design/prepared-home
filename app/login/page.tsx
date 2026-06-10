'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

async function handleLogin() {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) {
  alert(error.message)
} else {
  router.push('/')
}
}

    return (
        <main>
            <h1>Welcome Back</h1>
            <div>
                <input 
                    type="text" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleLogin}>
                Log In
            </button>
        
        </main>
    )
}
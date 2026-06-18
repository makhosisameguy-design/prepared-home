import React from 'react'

export default function BookingSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">{children}</div>
    </div>
  )
}

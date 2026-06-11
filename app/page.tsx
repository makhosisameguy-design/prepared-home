import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Search, Shield, DollarSign, Building2, ArrowRight } from 'lucide-react'

export default async function Home() {
  const { data: listings } = await supabase.from('Listings').select('*')

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/50" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 text-white text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              🏠 Find your mansion
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block text-violet-200">Prepared Home</span>
            </h1>
            <p className="text-xl text-violet-100 mb-10 leading-relaxed">
              Connect with verified landlords, explore properties, and find your next home with confidence.
            </p>
           
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                description: 'All properties can be verified for authenticity and quality assurance',
                color: 'bg-emerald-100 text-emerald-600'
              },
              {
                icon: DollarSign,
                title: 'Secure Deposits',
                description: 'Pay deposits safely through our platform with full protection',
                color: 'bg-violet-100 text-violet-600'
              },
              {
                icon: Building2,
                title: 'Wide Selection',
                description: 'Rooms, offices, and event venues — find exactly what you need',
                color: 'bg-blue-100 text-blue-600'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Featured Properties</h2>
              <p className="text-slate-500">Discover our latest listings</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-violet-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{listing.Title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{listing.Location}</p>
                    <p className="text-violet-600 font-bold text-xl">R {listing.Price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your mansion?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of happy tenants and landlords on Prepared Home
          </p>
          <Link href="/signup">
            <button className="bg-violet-600 hover:bg-violet-700 h-14 px-10 rounded-xl text-lg font-semibold text-white flex items-center gap-2 mx-auto">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

    </div>
  )
}
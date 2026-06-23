import Link from 'next/link'
import ListingSearchMap from '@/app/components/ListingSearchMap'
import { supabase } from '@/lib/supabase'
import { Search, Shield, DollarSign, Building2, ArrowRight, MapPin, Calendar, User, HomeIcon } from 'lucide-react'

export default async function Home() {
  const { data: listings } = await supabase.from('Listings').select('*')
  const activeListings = (listings || []).filter((listing: any) => !listing.archived)

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0075ff] via-[#0075ff] to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0053d1]/50" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block text-[#cce4ff]">Prepared Home</span>
            </h1>
            <p className="text-xl text-[#e6f0ff] mb-10 leading-relaxed">
              Connect with verified landlords, explore properties, and find your next home with confidence.
            </p>

            <div className="mx-auto w-full">
              <ListingSearchMap listings={activeListings} />
            </div>
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
                color: 'bg-[#e6f0ff] text-[#0075ff]'
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
            {activeListings.map((listing) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-slate-100 overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    {(() => {
                      const rawImage = listing?.image_url
                      if (rawImage) {
                        if (typeof rawImage === 'string' && rawImage.startsWith('[')) {
                          try {
                            const parsed = JSON.parse(rawImage)
                            return parsed[0]
                          } catch {
                            return rawImage
                          }
                        }
                        if (Array.isArray(rawImage)) {
                          return rawImage[0]
                        }
                        return rawImage
                      }
                      return null
                    })() ? (
                      <img
                        src={(() => {
                          const rawImage = listing?.image_url
                          if (rawImage) {
                            if (typeof rawImage === 'string' && rawImage.startsWith('[')) {
                              try {
                                return JSON.parse(rawImage)[0]
                              } catch {
                                return rawImage
                              }
                            }
                            if (Array.isArray(rawImage)) {
                              return rawImage[0]
                            }
                            return rawImage
                          }
                          return ''
                        })()}
                        alt={listing.Title || 'Listing photo'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-[#eff4ff] to-[#d2e7ff] flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-[#80b3ff]" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{listing.Title}</h3>

                  {(listing.about_property || listing.requirements) && (
                      <h4 className="text-slate-500 text-sm mb-3 line-clamp-2">{listing.about_property || listing.requirements}</h4>
                    )}
                    
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{listing.Location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                      <HomeIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{listing.room_type || listing.accommodation_type || 'Room'}</span>
                    </div>

                    {listing.availability_date && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(listing.availability_date).toLocaleDateString()}</span>
                      </div>
                    )}

                    {listing.landlord_name && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span>{listing.landlord_name}</span>
                      </div>
                    )}

                    <p className="text-[#0075ff] font-bold text-xl">R {listing.Price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xl font-semibold text-white">Prepared Home</p>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Your trusted rental marketplace for tenants and landlords. Find secure listings and manage bookings all in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-8">
              <Link href="/about" className="text-slate-300 hover:text-white font-medium">
                About
              </Link>
              <Link href="/legal" className="text-slate-300 hover:text-white font-medium">
                Legal
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Prepared Home. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}
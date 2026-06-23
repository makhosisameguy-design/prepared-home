'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

interface Listing {
  id: number
  Title: string
  Location?: string
  address?: string
  Price?: number
  deposit?: number
  image_url?: string | string[]
  room_type?: string
  accommodation_type?: string
  availability_date?: string
}

interface Props {
  listings: Listing[]
}

function buildMapUrl(lat: number, lng: number) {
  const delta = 0.02
  const south = lat - delta
  const north = lat + delta
  const west = lng - delta
  const east = lng + delta
  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lng}`
}

export default function ListingSearchMap({ listings }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [mapUrl, setMapUrl] = useState('')
  const [mapAddress, setMapAddress] = useState('')
  const [loadingMap, setLoadingMap] = useState(false)
  const [mapError, setMapError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!expanded) return

    function handleDocumentClick(event: MouseEvent) {
      if (!containerRef.current) return
      if (event.target instanceof Node && !containerRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [expanded])

  const filteredListings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return listings.filter((listing) => {
      const location = listing.Location || ''
      return term === '' || location.toLowerCase().includes(term)
    })
  }, [listings, searchTerm])

  const groupedListings = useMemo(() => {
    const groups: Record<string, Listing[]> = {}
    filteredListings.forEach((listing) => {
      const key = listing.Location?.trim() || 'Other'
      if (!groups[key]) groups[key] = []
      groups[key].push(listing)
    })
    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({ location: key, listings: groups[key] }))
  }, [filteredListings])

  useEffect(() => {
    if (!filteredListings.length) {
      setSelectedListing(null)
      setMapUrl('')
      setMapAddress('')
      setMapError('')
      return
    }

    if (!selectedListing || !filteredListings.some((listing) => listing.id === selectedListing.id)) {
      setSelectedListing(filteredListings[0])
    }
  }, [filteredListings, selectedListing])

  useEffect(() => {
    if (!selectedListing) return

    const listing = selectedListing
    const addressQuery = listing.address || listing.Location || ''
    if (!addressQuery) {
      setMapUrl('')
      setMapAddress('No address available')
      return
    }

    async function loadMap() {
      setLoadingMap(true)
      setMapError('')
      try {
        const query = encodeURIComponent(addressQuery + ', South Africa')
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`)
        const results = await response.json()
        if (!results || results.length === 0) {
          setMapError('Unable to locate this address on the map.')
          setMapUrl('')
          setMapAddress(addressQuery)
        } else {
          const { lat, lon } = results[0]
          setMapUrl(buildMapUrl(Number(lat), Number(lon)))
          setMapAddress(`${listing.address || listing.Location}`)
        }
      } catch (err) {
        setMapError('Map lookup failed. Please try again.')
        setMapUrl('')
        setMapAddress(addressQuery)
      } finally {
        setLoadingMap(false)
      }
    }

    loadMap()
  }, [selectedListing])

  return (
    <div ref={containerRef} className="space-y-10">
      <div className="mx-auto w-full max-w-3xl">
        <label className="sr-only" htmlFor="hero-search">Location search</label>
        <div className="relative">
          <input
            id="hero-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Find your mansion"
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-lg transition focus:border-[#0075ff] focus:outline-none focus:ring-2 focus:ring-[#0075ff]/20"
          />
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0075ff] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#0053d1]"
          >
            Search
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid gap-10 xl:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6">
            {groupedListings.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No listings found for that location.
              </div>
            ) : (
              groupedListings.map((group) => (
                <div key={group.location} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{group.location}</h3>
                      <p className="text-slate-500 text-sm">{group.listings.length} listing{group.listings.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.listings.map((listing) => (
                      <div
                        key={listing.id}
                        className={`rounded-3xl border px-4 py-4 transition ${selectedListing?.id === listing.id ? 'border-[#0075ff] bg-[#f5faff]' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <Link href={`/listings/${listing.id}`} className="text-lg font-semibold text-slate-900 hover:text-[#0075ff]">
                              {listing.Title}
                            </Link>
                            <p className="mt-1 text-sm text-slate-500">{listing.address || listing.Location}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {listing.Price != null && <span className="font-semibold text-slate-900">R {listing.Price}</span>}
                            {listing.deposit != null && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">Deposit: R {listing.deposit}</span>}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedListing(listing)}
                            className="rounded-2xl bg-[#0075ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0053d1]"
                          >
                            Show on map
                          </button>
                          <Link
                            href={`/listings/${listing.id}`}
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0075ff] hover:text-[#0075ff]"
                          >
                            View listing
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">Map preview</h3>
                <p className="text-sm text-slate-500">Showing the selected listing address.</p>
              </div>
              <div className="min-h-[360px] bg-slate-100 p-4">
                {loadingMap ? (
                  <div className="flex h-full items-center justify-center text-slate-500">Loading map…</div>
                ) : mapUrl ? (
                  <iframe
                    title="Listing location map"
                    src={mapUrl}
                    className="h-[360px] w-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-center text-slate-500">
                    <p>{mapError || 'Select a listing to show its location on the map.'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-base font-semibold text-slate-900">Selected address</h4>
              <p className="mt-2 text-slate-500">{mapAddress || 'No listing selected yet.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

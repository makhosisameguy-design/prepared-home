'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ListingCarouselProps = {
  images: string[]
  alt?: string
}

export default function ListingCarousel({ images, alt }: ListingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  function goPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  function goNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  return (
    <div className="mb-8">
      <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
        <img
          src={images[activeIndex]}
          alt={alt ?? `Image ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === activeIndex ? 'bg-[#0075ff]' : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

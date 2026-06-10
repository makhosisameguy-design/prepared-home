import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: listings } = await supabase.from('Listings').select('*')

  return (
    <main className="p-24">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Prepared Home</h1>
      
      <div className="grid gap-6">
        {listings?.map((item) => (
          <Link href={`/listings/${item.id}`}>
           <div key={item.id} className="border p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold">{item.title}</h2>
            <p className="text-gray-500">{item.location}</p>
            <p className="text-green-600 font-bold text-xl mt-2">R {item.price}</p>  
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">
              View listing
            </button>
           </div>
          </Link> 
        ))}
      </div>
    </main>
  )
}
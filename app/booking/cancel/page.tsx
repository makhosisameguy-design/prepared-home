import Link from 'next/link'

export default function BookingCancelPage() {
    return (
        <main>
            <h1>Booking Cancelled</h1>
            <p>Your booking has been cancelled.</p>
            <Link href="/">
                Back to Home
            </Link>
        </main>
    )
}
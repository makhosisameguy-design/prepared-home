import Link from 'next/link'

export default function BookingSuccessPage() {
    return (
        <main>
            <h1>Booking Successful!</h1>
            <p>Your booking has been successfully processed. We look forward to hosting you!</p>
            <Link href="/">
              Back to Home
            </Link>
        </main>
    )
}
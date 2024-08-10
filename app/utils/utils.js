import { redirect } from 'next/navigation'

export function ClientRedirect(route) {
    redirect(route)
}
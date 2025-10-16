import { redirect } from 'next/navigation'

export default function GeneratePage() {
  // Redirect to homepage since AI Generator is temporarily disabled
  redirect('/')
}
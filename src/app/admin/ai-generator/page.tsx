import { redirect } from 'next/navigation'

export default function AdminAIGeneratorPage() {
  // Redirect to admin dashboard since AI Generator is temporarily disabled
  redirect('/admin')
}
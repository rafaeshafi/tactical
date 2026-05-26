import { Suspense } from 'react'
import { TeamHubNav } from '@/components/ui/TeamHubNav'

interface Props {
  children: React.ReactNode
  params: Promise<{ teamId: string }>
}

export default async function TeamLayout({ children, params }: Props) {
  const { teamId } = await params

  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-10" />}>
        <TeamHubNav teamId={teamId} />
      </Suspense>
      {children}
    </div>
  )
}

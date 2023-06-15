import { ReactNode } from "react"

type SmallCardProps = {
  children: ReactNode
}

export function SmallCard({ children }: SmallCardProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-1/3">{children}</div>
    </div>
  )
}

SmallCard.Body = function ({ children }: SmallCardProps) {
  return <div className="shadow bg-white p-6 rounded-lg">{children}</div>
}

SmallCard.BelowCard = function ({ children }: SmallCardProps) {
  return <div className="mt-2 justify-center flex gap-3">{children}</div>
}

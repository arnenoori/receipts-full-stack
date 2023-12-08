import { BaseUser } from '@/types/user-types'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function BaseUserTableCell({ user }: { user: BaseUser }) {
  return (
    <div className="flex gap-2 items-center whitespace-nowrap">
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <AvatarFallback></AvatarFallback>
      </Avatar>
      {user.firstName} {user.lastName}
    </div>
  )
}

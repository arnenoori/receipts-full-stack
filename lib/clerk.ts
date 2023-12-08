import { BaseUser } from '@/types/user-types'
import { User } from '@clerk/nextjs/dist/types/server'

export const ClerkStyledElements = {
  card: 'bg-card border dark:border-2 border-border shadow-sm rounded-md',
  footerActionLink:
    'hover:underline text-sky-500 dark:text-sky-400 transition-colors duration-150 ease-in-out',
  footerActionText: 'text-foreground',
  headerTitle: 'text-foreground font-bold',
  headerSubtitle: 'text-muted-foreground',
  socialButtonsBlockButton:
    'text-foreground border-2 border-muted hover:bg-muted hover:text-foreground transition-colors duration-150 ease-in-out',
}

export const getBaseUserFromClerkUser = (user: User): BaseUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.emailAddresses[0] ? user.emailAddresses[0].emailAddress : '',
    imageUrl: user.imageUrl,
  }
}

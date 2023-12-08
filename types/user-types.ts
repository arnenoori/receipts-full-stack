/**
 * A clerk user object but with only the fields that are safe to expose to the client
 */
export type BaseUser = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  imageUrl: string
}

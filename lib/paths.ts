import { ValuesOf } from '@/types/utility-types'

/**
 * Define the paths for the app
 *
 * We use a const assertion to make sure that the values are not changed and
 * can be used as a type.
 *
 * By defining the paths in one place we can easily change them and make sure
 * that they are consistent. In addition, below we can use these enums to
 * create paths with type safety.
 */

export const PublicPath = {
  Home: '/',
  Api: '/api(.*)',
} as const
type PublicPathValues = ValuesOf<typeof PublicPath>

export const AuthPath = {
  SignIn: '/sign-in(.*)',
  SignUp: '/sign-up(.*)',
} as const
type AuthPathValues = ValuesOf<typeof AuthPath>

export const PrivatePath = {
  Home: '/s',
  Budget: '/s/budget',
} as const
type PrivatePathValues = ValuesOf<typeof PrivatePath>

export const ReceiptPath = {
  Home: '/s/:receiptId',
} as const
type ReceiptPathValues = ValuesOf<typeof ReceiptPath>

export type Path =
  | PublicPathValues
  | AuthPathValues
  | PrivatePathValues
  | ReceiptPathValues

/**
 * The keys for the search params of a route that has a table (pagination)
 */

export const TableSearchParamsKeys = {
  Page: 'page',
  PageSize: 'pageSize',
  SortBy: 'sortBy',
  SortDirection: 'sortDirection',
  Query: 'query',
} as const

type TableSearchParams = {
  [key in ValuesOf<typeof TableSearchParamsKeys>]?: key extends 'sortDirection'
    ? 'asc' | 'desc'
    : string
}

/**
 * Define the search params for paths
 */

export type PathToSearchParamsMap = {
  [AuthPath.SignIn]: {
    redirect?: string
  }
  [AuthPath.SignUp]: {
    redirect?: string
  }
  [PrivatePath.Home]: TableSearchParams
}

type SearchParams<P> = P extends keyof PathToSearchParamsMap
  ? PathToSearchParamsMap[P]
  : never

/**
 * Parse the search params from a url into a type-safe object
 * based on the path.
 *
 * @param path The path to parse the search params for
 * @param searchParams The search params to parse
 *
 * @returns The parsed search params
 */
export const parseUrlSearchParamsForPath = <P extends Path>(
  _: P,
  searchParams: URLSearchParams
): SearchParams<P> => {
  type Result = SearchParams<P>

  const result: Partial<Result> = {}

  searchParams.forEach((value, key) => {
    const k = key as keyof SearchParams<P>
    result[k] = value as SearchParams<P>[keyof SearchParams<P>]
  })

  return result as Result
}

/**
 * Build a path with the valid params and search params
 *
 * This is a type-safe way to build paths. It will make sure that the path
 * exists and that the search params are valid.
 */

type PathParams<P extends Path> = P extends ReceiptPathValues
  ? { receiptId: string }
  : undefined

// Define overloads
export function buildPath<P extends Path>(options: {
  searchParams?: SearchParams<P>
  path: P
  params: Exclude<PathParams<P>, undefined>
}): string

export function buildPath<P extends Path>(options: {
  searchParams?: SearchParams<P>
  path: P
}): string

// Implementation of the function
export function buildPath<P extends Path>(options: {
  searchParams?: SearchParams<P>
  path: P
  params?: PathParams<P>
}): string {
  let path: string = options.path

  // replace params in path
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      path = path.replace(`:${key}`, value)
    }
  }

  // remove regex from path
  if (path.includes('(.*)')) {
    path = path.replace('(.*)', '')
  }

  const dummyBase = 'http://localhost'

  const url = new URL(path, dummyBase)

  if (!options.searchParams) {
    return url.pathname
  }

  // add search params
  for (const [key, value] of Object.entries(options.searchParams)) {
    url.searchParams.set(key, value)
  }

  return url.pathname + url.search
}

/**
 * Define the permissions for paths
 */

type PathPermissions = {
  readonly authState: 'any' | 'logged-in' | 'logged-out'
}

export const PermissionsMap: {
  [P in Path]: PathPermissions
} = {
  [PublicPath.Home]: {
    authState: 'any',
  },
  [PublicPath.Api]: {
    authState: 'any',
  },
  [AuthPath.SignIn]: {
    authState: 'logged-out',
  },
  [AuthPath.SignUp]: {
    authState: 'logged-out',
  },
  [PrivatePath.Home]: {
    authState: 'logged-in',
  },
  [PrivatePath.Budget]: {
    authState: 'logged-in',
  },
  [ReceiptPath.Home]: {
    authState: 'logged-in',
  },
}

export function getPermissions<P extends Path>(path: P): PathPermissions {
  return PermissionsMap[path]
}

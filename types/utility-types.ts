export type ValuesOf<T> = T[keyof T]
export type PickValue<T, K extends keyof T> = T[K]

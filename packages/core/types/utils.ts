// ユーティリティ型

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type Prettify<T> = {
    [K in keyof T]: T[K]
} & {}

export type MaybeRef<T> = T | { value: T }

export type Arrayable<T> = T | T[]

import { useRoute } from "#app"
import { computed, type ComputedRef } from "vue"
import type { RouteLocationNormalizedLoaded } from "vue-router"

export interface TypedRouteOptions<
    TParams extends Record<string, string> = Record<string, string>,
    TQuery extends Record<string, string | string[]> = Record<string, string | string[]>
> {
    params?: TParams
    query?: TQuery
}

export interface TypedRoute<
    TParams extends Record<string, string> = Record<string, string>,
    TQuery extends Record<string, string | string[]> = Record<string, string | string[]>
> extends RouteLocationNormalizedLoaded {
    params: TParams
    query: TQuery
}

export function defineRoute<
    TParams extends Record<string, string> = Record<string, string>,
    TQuery extends Record<string, string | string[]> = Record<string, string | string[]>
>(): TypedRoute<TParams, TQuery> {
    const route = useRoute() as TypedRoute<TParams, TQuery>
    return route
}

export function useTypedParams<T extends Record<string, string>>(): ComputedRef<T> {
    const route = useRoute()
    return computed(() => route.params as T)
}

export function useTypedQuery<T extends Record<string, string | string[]>>(): ComputedRef<T> {
    const route = useRoute()
    return computed(() => route.query as T)
}

export function useParam<T extends string = string>(key: string): ComputedRef<T | undefined> {
    const route = useRoute()
    return computed(() => route.params[key] as T | undefined)
}

export function useQueryParam<T extends string | string[] = string>(key: string): ComputedRef<T | undefined> {
    const route = useRoute()
    return computed(() => route.query[key] as T | undefined)
}

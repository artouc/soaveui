export interface SoaveNuxtModuleOptions {
    prefix?: string
    global?: boolean
    i18n?: {
        enabled?: boolean
        default_locale?: string
    }
}

export interface BreadcrumbItem {
    label: string
    href?: string
    icon?: string
    disabled?: boolean
    current?: boolean
}

export interface PaginationState {
    current_page: number
    total_pages: number
    total_items: number
    per_page: number
    has_previous: boolean
    has_next: boolean
}

export interface TableColumn<T = unknown> {
    key: keyof T | string
    label: string
    sortable?: boolean
    width?: string
    align?: "left" | "center" | "right"
    render?: (value: unknown, row: T) => string
}

export interface TableSortState {
    column: string
    direction: "asc" | "desc"
}

export interface DataTableOptions<T = unknown> {
    columns: TableColumn<T>[]
    data: T[]
    sortable?: boolean
    selectable?: boolean
    pagination?: boolean
    per_page?: number
}

export interface RouteTypedParams {
    params: Record<string, string>
    query: Record<string, string | string[]>
}

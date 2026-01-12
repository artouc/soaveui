import { computed, ref, type ComputedRef, type Ref } from "vue"
import type { PaginationState } from "../../types"

export interface UsePaginationOptions {
    initial_page?: number
    per_page?: number
    total_items?: number
    sibling_count?: number
    boundary_count?: number
}

export interface UsePaginationReturn {
    state: ComputedRef<PaginationState>
    current_page: Ref<number>
    per_page: Ref<number>
    total_items: Ref<number>
    pages: ComputedRef<(number | "ellipsis")[]>
    setPage: (page: number) => void
    nextPage: () => void
    previousPage: () => void
    firstPage: () => void
    lastPage: () => void
    setPerPage: (count: number) => void
    setTotalItems: (count: number) => void
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const {
        initial_page = 1,
        per_page: initial_per_page = 10,
        total_items: initial_total_items = 0,
        sibling_count = 1,
        boundary_count = 1
    } = options

    const current_page = ref(initial_page)
    const per_page = ref(initial_per_page)
    const total_items = ref(initial_total_items)

    const total_pages = computed(() => {
        return Math.max(1, Math.ceil(total_items.value / per_page.value))
    })

    const has_previous = computed(() => current_page.value > 1)
    const has_next = computed(() => current_page.value < total_pages.value)

    const state = computed<PaginationState>(() => ({
        current_page: current_page.value,
        total_pages: total_pages.value,
        total_items: total_items.value,
        per_page: per_page.value,
        has_previous: has_previous.value,
        has_next: has_next.value
    }))

    const pages = computed<(number | "ellipsis")[]>(() => {
        const total = total_pages.value
        const current = current_page.value
        const result: (number | "ellipsis")[] = []

        // Calculate ranges
        const start_pages = range(1, Math.min(boundary_count, total))
        const end_pages = range(Math.max(total - boundary_count + 1, boundary_count + 1), total)

        const sibling_start = Math.max(
            Math.min(
                current - sibling_count,
                total - boundary_count - sibling_count * 2 - 1
            ),
            boundary_count + 2
        )

        const sibling_end = Math.min(
            Math.max(
                current + sibling_count,
                boundary_count + sibling_count * 2 + 2
            ),
            end_pages.length > 0 ? end_pages[0] - 2 : total - 1
        )

        // Build page list
        result.push(...start_pages)

        // Start ellipsis
        if (sibling_start > boundary_count + 2) {
            result.push("ellipsis")
        } else if (boundary_count + 1 < total - boundary_count) {
            result.push(boundary_count + 1)
        }

        // Sibling pages
        result.push(...range(sibling_start, sibling_end))

        // End ellipsis
        if (sibling_end < total - boundary_count - 1) {
            result.push("ellipsis")
        } else if (total - boundary_count > boundary_count) {
            result.push(total - boundary_count)
        }

        result.push(...end_pages)

        // Remove duplicates and sort
        const unique = [...new Set(result.filter(p => p === "ellipsis" || (p >= 1 && p <= total)))]
        return unique
    })

    const setPage = (page: number): void => {
        if (page >= 1 && page <= total_pages.value) {
            current_page.value = page
        }
    }

    const nextPage = (): void => {
        if (has_next.value) {
            current_page.value++
        }
    }

    const previousPage = (): void => {
        if (has_previous.value) {
            current_page.value--
        }
    }

    const firstPage = (): void => {
        current_page.value = 1
    }

    const lastPage = (): void => {
        current_page.value = total_pages.value
    }

    const setPerPage = (count: number): void => {
        per_page.value = count
        // Reset to first page when changing per_page
        current_page.value = 1
    }

    const setTotalItems = (count: number): void => {
        total_items.value = count
        // Adjust current page if it's now out of bounds
        if (current_page.value > total_pages.value) {
            current_page.value = total_pages.value
        }
    }

    return {
        state,
        current_page,
        per_page,
        total_items,
        pages,
        setPage,
        nextPage,
        previousPage,
        firstPage,
        lastPage,
        setPerPage,
        setTotalItems
    }
}

function range(start: number, end: number): number[] {
    const result: number[] = []
    for (let i = start; i <= end; i++) {
        result.push(i)
    }
    return result
}

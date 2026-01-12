<template>
    <div :class="cn('space-y-4', props.class)">
        <!-- Header slot for search, filters, etc. -->
        <slot name="header" />

        <!-- Table -->
        <Table>
            <TableHeader>
                <TableRow>
                    <!-- Selection checkbox column -->
                    <TableHead v-if="selectable" class="w-12">
                        <input
                            type="checkbox"
                            :checked="is_all_selected"
                            :indeterminate="is_some_selected && !is_all_selected"
                            class="h-4 w-4 rounded border-gray-300"
                            aria-label="Select all rows"
                            @change="toggleSelectAll"
                        />
                    </TableHead>

                    <!-- Column headers -->
                    <TableHead
                        v-for="column in columns"
                        :key="String(column.key)"
                        :sortable="sortable && column.sortable !== false"
                        :sort_direction="getSortDirection(column.key)"
                        :class="column.width ? `w-[${column.width}]` : ''"
                        :style="{ textAlign: column.align || 'left' }"
                        @sort="handleSort(column.key)"
                    >
                        <slot :name="`header-${String(column.key)}`" :column="column">
                            {{ column.label }}
                        </slot>
                    </TableHead>

                    <!-- Actions column -->
                    <TableHead v-if="$slots.actions" class="w-12">
                        <span class="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <!-- Empty state -->
                <TableRow v-if="paginated_data.length === 0">
                    <TableCell
                        :colspan="column_count"
                        class="h-24 text-center"
                    >
                        <slot name="empty">
                            No results found.
                        </slot>
                    </TableCell>
                </TableRow>

                <!-- Data rows -->
                <TableRow
                    v-for="(row, row_index) in paginated_data"
                    :key="getRowKey(row, row_index)"
                    :selected="isRowSelected(row)"
                >
                    <!-- Selection checkbox -->
                    <TableCell v-if="selectable">
                        <input
                            type="checkbox"
                            :checked="isRowSelected(row)"
                            class="h-4 w-4 rounded border-gray-300"
                            :aria-label="`Select row ${row_index + 1}`"
                            @change="toggleRowSelection(row)"
                        />
                    </TableCell>

                    <!-- Data cells -->
                    <TableCell
                        v-for="column in columns"
                        :key="String(column.key)"
                        :style="{ textAlign: column.align || 'left' }"
                    >
                        <slot
                            :name="`cell-${String(column.key)}`"
                            :row="row"
                            :value="getCellValue(row, column)"
                            :column="column"
                            :index="row_index"
                        >
                            {{ getCellValue(row, column) }}
                        </slot>
                    </TableCell>

                    <!-- Actions cell -->
                    <TableCell v-if="$slots.actions">
                        <slot name="actions" :row="row" :index="row_index" />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <!-- Pagination -->
        <div v-if="pagination && pagination_state.total_pages > 1" class="flex items-center justify-between">
            <div class="text-sm text-muted-foreground">
                <slot name="pagination-info" :state="pagination_state">
                    Showing {{ start_item }} to {{ end_item }} of {{ pagination_state.total_items }} results
                </slot>
            </div>
            <Pagination
                :state="pagination_state"
                :pages="pagination_pages"
                @page="handlePageChange"
                @previous="handlePreviousPage"
                @next="handleNextPage"
                @first="handleFirstPage"
                @last="handleLastPage"
            />
        </div>

        <!-- Footer slot -->
        <slot name="footer" />
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref, watch } from "vue"
import { cn } from "@soave/ui"
import { usePagination } from "../composables/usePagination"
import type { TableColumn, TableSortState } from "../../types"
import Table from "./Table.vue"
import TableHeader from "./TableHeader.vue"
import TableBody from "./TableBody.vue"
import TableRow from "./TableRow.vue"
import TableHead from "./TableHead.vue"
import TableCell from "./TableCell.vue"
import Pagination from "./Pagination.vue"

export interface DataTableProps<T> {
    columns: TableColumn<T>[]
    data: T[]
    row_key?: keyof T | ((row: T) => string | number)
    sortable?: boolean
    selectable?: boolean
    pagination?: boolean
    per_page?: number
    class?: string
}

const props = withDefaults(defineProps<DataTableProps<T>>(), {
    sortable: false,
    selectable: false,
    pagination: false,
    per_page: 10
})

const emit = defineEmits<{
    sort: [state: TableSortState]
    select: [rows: T[]]
    "page-change": [page: number]
}>()

// Sort state
const sort_state = ref<TableSortState | null>(null)

// Selected rows
const selected_rows = ref<Set<T>>(new Set())

// Pagination
const {
    state: pagination_state,
    pages: pagination_pages,
    setPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setTotalItems
} = usePagination({
    per_page: props.per_page
})

// Watch data changes to update total items
watch(
    () => props.data,
    (new_data) => {
        setTotalItems(new_data.length)
    },
    { immediate: true }
)

// Computed
const sorted_data = computed<T[]>(() => {
    if (!sort_state.value || !props.sortable) {
        return props.data
    }

    const { column, direction } = sort_state.value
    const sorted = [...props.data].sort((a, b) => {
        const a_value = a[column as keyof T]
        const b_value = b[column as keyof T]

        if (a_value === b_value) return 0
        if (a_value === null || a_value === undefined) return 1
        if (b_value === null || b_value === undefined) return -1

        const comparison = a_value < b_value ? -1 : 1
        return direction === "asc" ? comparison : -comparison
    })

    return sorted
})

const paginated_data = computed<T[]>(() => {
    if (!props.pagination) {
        return sorted_data.value
    }

    const start = (pagination_state.value.current_page - 1) * pagination_state.value.per_page
    const end = start + pagination_state.value.per_page
    return sorted_data.value.slice(start, end)
})

const column_count = computed(() => {
    let count = props.columns.length
    if (props.selectable) count++
    return count
})

const is_all_selected = computed(() => {
    return props.data.length > 0 && selected_rows.value.size === props.data.length
})

const is_some_selected = computed(() => {
    return selected_rows.value.size > 0
})

const start_item = computed(() => {
    return (pagination_state.value.current_page - 1) * pagination_state.value.per_page + 1
})

const end_item = computed(() => {
    return Math.min(
        pagination_state.value.current_page * pagination_state.value.per_page,
        pagination_state.value.total_items
    )
})

// Methods
const getRowKey = (row: T, index: number): string | number => {
    if (!props.row_key) {
        return index
    }
    if (typeof props.row_key === "function") {
        return props.row_key(row)
    }
    return String(row[props.row_key])
}

const getCellValue = (row: T, column: TableColumn<T>): unknown => {
    const value = row[column.key as keyof T]
    if (column.render) {
        return column.render(value, row)
    }
    return value
}

const getSortDirection = (column_key: keyof T | string): "asc" | "desc" | null => {
    if (!sort_state.value || sort_state.value.column !== column_key) {
        return null
    }
    return sort_state.value.direction
}

const handleSort = (column_key: keyof T | string): void => {
    if (!props.sortable) return

    let direction: "asc" | "desc" = "asc"

    if (sort_state.value && sort_state.value.column === column_key) {
        direction = sort_state.value.direction === "asc" ? "desc" : "asc"
    }

    sort_state.value = {
        column: String(column_key),
        direction
    }

    emit("sort", sort_state.value)
}

const isRowSelected = (row: T): boolean => {
    return selected_rows.value.has(row)
}

const toggleRowSelection = (row: T): void => {
    if (selected_rows.value.has(row)) {
        selected_rows.value.delete(row)
    } else {
        selected_rows.value.add(row)
    }
    emit("select", Array.from(selected_rows.value))
}

const toggleSelectAll = (): void => {
    if (is_all_selected.value) {
        selected_rows.value.clear()
    } else {
        selected_rows.value = new Set(props.data)
    }
    emit("select", Array.from(selected_rows.value))
}

const handlePageChange = (page: number): void => {
    setPage(page)
    emit("page-change", page)
}

const handlePreviousPage = (): void => {
    previousPage()
    emit("page-change", pagination_state.value.current_page)
}

const handleNextPage = (): void => {
    nextPage()
    emit("page-change", pagination_state.value.current_page)
}

const handleFirstPage = (): void => {
    firstPage()
    emit("page-change", pagination_state.value.current_page)
}

const handleLastPage = (): void => {
    lastPage()
    emit("page-change", pagination_state.value.current_page)
}
</script>

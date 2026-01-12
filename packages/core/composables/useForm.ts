import { reactive, computed, readonly } from "vue"
import { z, type ZodSchema, ZodError, type ZodObject, type ZodRawShape } from "zod"
import type { FormState, FormReturn, FieldArrayHelpers } from "../types/form"
import { FORM_ERRORS } from "../constants/errors"

/**
 * フォーム状態管理とZodバリデーションを提供するComposable
 * スキーマに基づいた型安全なフォーム管理を実現
 */
export const useForm = <T extends ZodSchema>(schema: T): FormReturn<z.infer<T>> => {
    type FormData = z.infer<T>

    const form_state = reactive<FormState<FormData>>({
        values: {} as FormData,
        errors: {} as Partial<Record<keyof FormData, string>>,
        touched: {} as Partial<Record<keyof FormData, boolean>>,
        is_submitting: false,
        is_dirty: false
    })

    const is_valid = computed(() => {
        const result = schema.safeParse(form_state.values)
        return result.success
    })

    const validateField = (field: keyof FormData): void => {
        form_state.touched[field] = true
        form_state.is_dirty = true

        try {
            const zod_object = schema as ZodObject<ZodRawShape>
            const field_schema = zod_object.shape[field as string]

            if (!field_schema) {
                throw new Error(FORM_ERRORS.FIELD_NOT_FOUND)
            }

            field_schema.parse(form_state.values[field])
            form_state.errors[field] = undefined
        } catch (error) {
            if (error instanceof ZodError) {
                form_state.errors[field] = error.errors[0].message
            } else if (error instanceof Error) {
                form_state.errors[field] = error.message
            }
        }
    }

    const validateAll = (): boolean => {
        try {
            schema.parse(form_state.values)
            form_state.errors = {} as Partial<Record<keyof FormData, string>>
            return true
        } catch (error) {
            if (error instanceof ZodError) {
                form_state.errors = {} as Partial<Record<keyof FormData, string>>
                error.errors.forEach((err) => {
                    const field = err.path[0] as keyof FormData
                    form_state.errors[field] = err.message
                    form_state.touched[field] = true
                })
            }
            return false
        }
    }

    const reset = (): void => {
        form_state.values = {} as FormData
        form_state.errors = {} as Partial<Record<keyof FormData, string>>
        form_state.touched = {} as Partial<Record<keyof FormData, boolean>>
        form_state.is_dirty = false
    }

    const setValues = (values: Partial<FormData>): void => {
        Object.assign(form_state.values, values)
        form_state.is_dirty = true
    }

    const setFieldValue = (field: keyof FormData, value: FormData[keyof FormData]): void => {
        form_state.values[field] = value
        form_state.is_dirty = true
    }

    const submit = async (on_submit: (data: FormData) => Promise<void>): Promise<void> => {
        if (!validateAll()) {
            return
        }

        form_state.is_submitting = true

        try {
            const validated_data = schema.parse(form_state.values)
            await on_submit(validated_data)
        } catch (error) {
            if (error instanceof ZodError) {
                error.errors.forEach((err) => {
                    const field = err.path[0] as keyof FormData
                    form_state.errors[field] = err.message
                })
            }
            throw error
        } finally {
            form_state.is_submitting = false
        }
    }

    /**
     * 配列フィールドの操作ヘルパーを取得
     */
    const getFieldArray = <K extends keyof FormData>(
        field: K
    ): FormData[K] extends Array<infer U> ? FieldArrayHelpers<U> : never => {
        type TItem = FormData[K] extends Array<infer U> ? U : never

        const getArray = (): TItem[] => {
            const value = form_state.values[field]
            if (!Array.isArray(value)) {
                form_state.values[field] = [] as FormData[K]
                return [] as TItem[]
            }
            return value as TItem[]
        }

        const helpers: FieldArrayHelpers<TItem> = {
            get fields() {
                return getArray()
            },

            append: (value: TItem) => {
                const array = getArray()
                array.push(value)
                form_state.is_dirty = true
            },

            prepend: (value: TItem) => {
                const array = getArray()
                array.unshift(value)
                form_state.is_dirty = true
            },

            insert: (index: number, value: TItem) => {
                const array = getArray()
                array.splice(index, 0, value)
                form_state.is_dirty = true
            },

            remove: (index: number) => {
                const array = getArray()
                array.splice(index, 1)
                form_state.is_dirty = true
            },

            move: (from_index: number, to_index: number) => {
                const array = getArray()
                const item = array.splice(from_index, 1)[0]
                array.splice(to_index, 0, item)
                form_state.is_dirty = true
            },

            swap: (index_a: number, index_b: number) => {
                const array = getArray()
                const temp = array[index_a]
                array[index_a] = array[index_b]
                array[index_b] = temp
                form_state.is_dirty = true
            },

            replace: (index: number, value: TItem) => {
                const array = getArray()
                array[index] = value
                form_state.is_dirty = true
            },

            clear: () => {
                form_state.values[field] = [] as FormData[K]
                form_state.is_dirty = true
            }
        }

        return helpers as FormData[K] extends Array<infer U> ? FieldArrayHelpers<U> : never
    }

    return {
        values: form_state.values,
        errors: readonly(form_state.errors) as FormReturn<FormData>["errors"],
        touched: readonly(form_state.touched) as FormReturn<FormData>["touched"],
        is_valid,
        is_submitting: readonly(computed(() => form_state.is_submitting)) as FormReturn<FormData>["is_submitting"],
        is_dirty: readonly(computed(() => form_state.is_dirty)) as FormReturn<FormData>["is_dirty"],
        validateField,
        validateAll,
        reset,
        setValues,
        setFieldValue,
        submit,
        getFieldArray
    }
}

<template>
    <div
        :data-dragging="is_dragging"
        :data-disabled="disabled"
        :data-has-files="has_files"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
    >
        <input
            ref="input_ref"
            type="file"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled"
            @change="handleChange"
        />
        <slot
            :files="files"
            :is_dragging="is_dragging"
            :open="openFilePicker"
            :clear="clearFiles"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = withDefaults(defineProps<{
    accept?: string
    multiple?: boolean
    disabled?: boolean
    maxSize?: number
    maxFiles?: number
}>(), {
    multiple: false,
    disabled: false
})

const emit = defineEmits<{
    change: [files: File[]]
    error: [message: string]
}>()

const input_ref = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const is_dragging = ref(false)

const has_files = computed(() => files.value.length > 0)

const validateFiles = (file_list: FileList | null): File[] => {
    if (!file_list) return []

    const validated: File[] = []
    const max_files = props.maxFiles ?? (props.multiple ? Infinity : 1)

    for (let i = 0; i < Math.min(file_list.length, max_files); i++) {
        const file = file_list[i]

        if (props.maxSize && file.size > props.maxSize) {
            emit("error", `File "${file.name}" exceeds maximum size`)
            continue
        }

        validated.push(file)
    }

    return validated
}

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const validated = validateFiles(target.files)
    files.value = validated
    emit("change", validated)
}

const handleDragOver = (event: DragEvent) => {
    if (props.disabled) return
    is_dragging.value = true
}

const handleDragLeave = () => {
    is_dragging.value = false
}

const handleDrop = (event: DragEvent) => {
    if (props.disabled) return
    is_dragging.value = false

    const validated = validateFiles(event.dataTransfer?.files ?? null)
    files.value = validated
    emit("change", validated)
}

const openFilePicker = () => {
    if (!props.disabled && input_ref.value) {
        input_ref.value.click()
    }
}

const clearFiles = () => {
    files.value = []
    if (input_ref.value) {
        input_ref.value.value = ""
    }
    emit("change", [])
}

defineOptions({
    name: "FileInput"
})

defineExpose({
    files,
    is_dragging,
    openFilePicker,
    clearFiles
})
</script>

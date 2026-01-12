<template>
    <div :class="composable.base_classes.value">
        <input
            ref="input_ref"
            type="file"
            :accept="accept"
            :multiple="multiple"
            :disabled="composable.is_disabled.value"
            class="sr-only"
            @change="handleChange"
        />

        <div
            :class="composable.dropzone_classes.value"
            v-bind="composable.aria_attributes.value"
            @click="composable.openFilePicker"
            @dragenter="composable.handleDragEnter"
            @dragleave="composable.handleDragLeave"
            @dragover.prevent
            @drop="composable.handleDrop"
        >
            <slot name="dropzone">
                <svg
                    class="w-10 h-10 mb-3 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p class="text-sm text-muted-foreground">
                    <span class="font-semibold text-primary">クリック</span>
                    または ドラッグ&ドロップ
                </p>
                <p v-if="accept" class="mt-1 text-xs text-muted-foreground">
                    {{ accept }}
                </p>
            </slot>
        </div>

        <p
            v-if="composable.error.value"
            class="mt-2 text-sm text-destructive"
        >
            {{ composable.error.value }}
        </p>

        <ul
            v-if="composable.files.value.length > 0"
            class="mt-4 space-y-2"
        >
            <li
                v-for="(file, index) in composable.files.value"
                :key="file.name + index"
                class="flex items-center gap-3 p-2 rounded-md border bg-muted/50"
            >
                <img
                    v-if="file.preview_url"
                    :src="file.preview_url"
                    :alt="file.name"
                    class="w-10 h-10 object-cover rounded"
                />
                <svg
                    v-else
                    class="w-10 h-10 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">{{ file.name }}</p>
                    <p class="text-xs text-muted-foreground">
                        {{ formatSize(file.size) }}
                    </p>
                </div>
                <button
                    type="button"
                    class="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    @click.stop="composable.removeFile(index)"
                >
                    <svg
                        class="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from "vue"
import { useFileInput } from "../../composables/useFileInput"
import type { FileInputProps, FileInfo } from "../../types/file-input"

interface Props extends FileInputProps {
    modelValue?: File | File[] | null
}

const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    disabled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: File | File[] | null]
}>()

const input_ref = ref<HTMLInputElement | null>(null)
const composable = useFileInput(toRef(() => props), input_ref)

const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    composable.handleFiles(target.files)
    target.value = ""
}

watch(
    () => composable.files.value,
    (new_files: FileInfo[]) => {
        if (props.multiple) {
            emit("update:modelValue", new_files.map(f => f.file))
        } else {
            emit("update:modelValue", new_files[0]?.file ?? null)
        }
    },
    { deep: true }
)
</script>

<template>
    <CoreFileInput
        :class="computedClasses"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :max_size="maxSize"
        :max_files="maxFiles"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #default="{ isDragging, openFilePicker }">
            <div
                class="file-input__dropzone"
                :class="{ 'file-input__dropzone--dragging': isDragging }"
                @click="openFilePicker"
            >
                <svg
                    class="file-input__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span class="file-input__text">
                    <slot>
                        Drop files here or click to upload
                    </slot>
                </span>
            </div>
        </template>
    </CoreFileInput>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { FileInput as CoreFileInput } from "@soave/ui"
import type { FileInfo } from "@soave/ui"

const props = withDefaults(defineProps<{
    accept?: string
    multiple?: boolean
    disabled?: boolean
    maxSize?: number
    maxFiles?: number
    modelValue?: FileInfo[]
    class?: string
}>(), {
    multiple: false,
    disabled: false
})

const emit = defineEmits<{
    "update:modelValue": [value: FileInfo[]]
}>()

const computedClasses = computed(() => {
    return [
        "file-input",
        props.disabled && "file-input--disabled",
        props.class
    ].filter(Boolean).join(" ")
})
</script>

<style>
@import "../styles/file-input.css";
</style>

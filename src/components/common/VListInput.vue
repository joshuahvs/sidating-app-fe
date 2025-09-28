<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string[]
  label?: string
  placeholder?: string
  allowDuplicates?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const items = ref<string[]>(props.modelValue ? [...props.modelValue] : [])
const inputValue = ref('')

watch(
  () => props.modelValue,
  (val) => {
    if (val && val !== items.value) {
      items.value = [...val]
    }
  }
)

const addCurrent = () => {
  const raw = inputValue.value.trim()
  if (!raw) return
  if (!props.allowDuplicates && items.value.includes(raw)) {
    inputValue.value = ''
    return
  }
  items.value.push(raw)
  emit('update:modelValue', [...items.value])
  inputValue.value = ''
}

const removeAt = (idx: number) => {
  items.value.splice(idx, 1)
  emit('update:modelValue', [...items.value])
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addCurrent()
  } else if (e.key === 'Backspace' && !inputValue.value && items.value.length) {
    const last = items.value.pop()!
    inputValue.value = last
    emit('update:modelValue', [...items.value])
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium" :for="label">{{ label }}</label>
    <div class="flex flex-wrap items-center gap-2 border rounded px-2 py-1">
      <span
        v-for="(t, i) in items"
        :key="t + i"
        class="flex items-center gap-1 bg-slate-200 text-slate-800 px-2 py-0.5 rounded-sm"
      >
        {{ t }}
        <button
          type="button"
          aria-label="remove"
          class="text-xs"
          @click="removeAt(i)"
        >×</button>
      </span>
      <input
        :id="label"
        :placeholder="placeholder || 'Type and press Enter'"
        v-model="inputValue"
        @keydown="onKey"
        @blur="addCurrent"
        class="flex-1 min-w-[120px] outline-none py-1 text-sm bg-transparent"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  id: string;
  label?: string | null;
  name?: string;
  modelValue: string;
}>(), {
  modelValue: '',
});

const emit = defineEmits(['update:modelValue'])

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target) {
    emit('update:modelValue', target.value);
  }
}
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label :for="id" v-if="label">{{ label }}</label>
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      class="rounded-lg"
      @input="handleInput"
    >
      <slot></slot>
    </select>
  </div>
</template>
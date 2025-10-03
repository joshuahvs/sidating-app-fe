<script setup lang="ts">
withDefaults(defineProps<{
  id: string;
  label?: string | null;
  type?: string;
  name?: string;
  modelValue: string;
}>(), {
  type: 'text',
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
    <input
      :id="id"
      :type="type"
      :name="name"
      :value="modelValue"
      class="rounded-lg"
      @input="handleInput"
    />
  </div>
</template>
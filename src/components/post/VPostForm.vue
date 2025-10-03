<script setup lang="ts">
import VInput from '@/components/common/VInput.vue';
import VTextArea from '@/components/common/VTextArea.vue';
import VButton from '@/components/common/VButton.vue';
import { type PropType, toRefs, watch } from 'vue';
import type { PostRequest } from '@/interfaces/post.interface';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  action: {
    type: Function as PropType<(data: PostRequest) => Promise<void> | void>,
    required: true,
  },
  postModel: {
    type: Object as PropType<PostRequest>,
    required: true,
  }
})

const model = toRefs(props).postModel;

const emit = defineEmits(['update:modelValue']);

watch(() => model, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

const handleSubmit = async () => await props.action(model.value)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 py-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VInput v-model="model.userId" id="userId" name="userId" label="User ID" />
      <VInput v-model="model.imageUrl" id="imageUrl" name="imageUrl" label="Image URL" />
    </div>
    <VTextArea v-model="model.caption" id="caption" name="caption" label="Caption" />

    <div class="flex justify-end gap-2 pt-4">
      <VButton @click="router.back()" type="button" class="bg-slate-600 hover:bg-slate-800 text-white">Kembali</VButton>
      <VButton type="submit" class="bg-pink-600 hover:bg-pink-800 text-white">Simpan</VButton>
    </div>
  </form>
</template>

<style scoped></style>

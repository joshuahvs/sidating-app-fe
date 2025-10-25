<script setup lang="ts">
import VInput from '@/components/common/VInput.vue';
import VSelect from '@/components/common/VSelect.vue';
import VTextArea from '@/components/common/VTextArea.vue';
import VButton from '@/components/common/VButton.vue';
import { type PropType, ref, watch } from 'vue';
import type { PostRequest } from '@/interfaces/post.interface';
import { useRouter } from 'vue-router';

const router = useRouter();

type UserOption = { id: string; name: string };

const props = defineProps({
  action: {
    type: Function as PropType<(data: PostRequest) => Promise<void> | void>,
    required: true,
  },
  postModel: {
    type: Object as PropType<PostRequest>,
    required: true,
  },
  userOptions: {
    type: Array as PropType<UserOption[]>,
    required: true,
  }
})

// Create a local editable copy to avoid mutating readonly props
const model = ref<PostRequest>({ ...props.postModel });

// Keep local model in sync if parent prop changes (e.g., when data loads async)
watch(() => props.postModel, (val) => {
  if (val) model.value = { ...val };
}, { deep: true, immediate: true });

const handleSubmit = async () => await props.action(model.value)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 py-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <VSelect v-model="model.userId" id="userId" name="userId" label="User">
        <option value="">Pilih User</option>
        <option v-for="u in userOptions" :key="u.id" :value="u.id">
          {{ u.name }}
        </option>
      </VSelect>
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

<script setup lang="ts">
import VInput from '../common/VInput.vue';
import VTextArea from '../common/VTextArea.vue';
import VButton from '../common/VButton.vue';
import VSelect from '../common/VSelect.vue';
import VListInput from '../common/VListInput.vue';
import { type PropType, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { UserProfileRequest } from '@/interfaces/profile.interface';

const router = useRouter();

const props = defineProps({
  action: {
    type: Function as PropType<(data: UserProfileRequest) => Promise<void>>,
    required: true,
  },
  profileModel: {
    type: Object as PropType<UserProfileRequest>,
    required: true,
  }
})

const model = toRefs(props).profileModel;

const emit = defineEmits(['update:modelValue']);

watch(() => model, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true }
)

const handleSubmit = async () => await props.action(model.value)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 py-4">
    <div class="grid grid-cols-2 gap-4">
      <VInput v-model="model.name" id="name" name="name" label="Nama" />
      <VInput v-model="model.nickname" id="nickname" name="nickname" label="Nickname" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <VInput v-model="model.email" id="email" name="email" type="email" label="Email" />
      <VInput v-model="model.phoneNumber" id="phone" name="phone" type="tel" label="Nomor Telepon" />
    </div>

    <VTextArea v-model="model.bio" id="description" name="description" label="Bio" />

    <div class="grid grid-cols-2 gap-4">
      <VInput v-model="model.birthdate" id="birthdate" name="birthdate" type="date" label="Tanggal Lahir" />
      <VSelect v-model="model.gender" id="gender" name="gender" label="Jenis Kelamin">
        <option value="">Pilih Jenis Kelamin...</option>
        <option value="MALE">Laki-laki</option>
        <option value="FEMALE">Perempuan</option>
        <option value="OTHER">Lainnya</option>
      </VSelect>
    </div>

    <VInput v-model="model.location" id="location" name="location" label="Lokasi" />

    <div class="grid grid-cols-2 gap-4">
      <VListInput v-model="model.hobbies" label="Hobi" placeholder="Tambah hobi lalu Enter" />
      <VListInput v-model="model.interests" label="Minat" placeholder="Tambah minat lalu Enter" />
    </div>

    <div class="flex justify-end gap-2 pt-4">
      <VButton @click="router.back()" type="button" class="bg-slate-600 hover:bg-slate-800 text-white">Kembali</VButton>
      <VButton type="submit" class="bg-pink-600 hover:bg-pink-800 text-white">Simpan</VButton>
    </div>
  </form>
</template>

<style scoped>
</style>
import type { UserProfile, UserProfileRequest } from '@/interfaces/profile.interface';
import { defineStore } from 'pinia'
import axios from "axios";
import { toast } from 'vue-sonner';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';

const baseUserProfileUrl = import.meta.env.VITE_API_URL + '/profile';

export const useUserProfileStore = defineStore('userProfile', {
    state: () => ({
        profiles: [] as UserProfile[],
        loading: false,
        error: null as null | string,
    }),
    actions: {
        async fetchProfiles() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get<CommonResponseInterface<UserProfile[]>>(baseUserProfileUrl);
                this.profiles = response.data.data;
                if (this.profiles.length === 0) {
                    toast.warning('Data profil kosong')
                }
                else {
                    toast.success('Data profil berhasil dimuat')
                }
                return response.data.data;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat profil: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        async getProfileById(profileId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get<CommonResponseInterface<UserProfile>>(`${baseUserProfileUrl}/${profileId}`);
                return response.data.data;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat profil: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createProfile(profileData: UserProfileRequest) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.post<CommonResponseInterface<UserProfile>>(`${baseUserProfileUrl}/create`, profileData);
                if (response.status === 201) {
                    this.profiles.push(response.data.data);
                    toast.success('Profil berhasil dibuat')
                    return response.data.data;
                }
                else if (response.status === 400) {
                    toast.warning('Gagal membuat profil: Data tidak valid atau ada kesalahan pada permintaan.')
                }
            }
            catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat membuat profil: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        async updateProfile(profileData: UserProfileRequest) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.put<CommonResponseInterface<UserProfile>>(`${baseUserProfileUrl}/update`, profileData);

                if (response.status === 200) {
                    toast.success('Profil berhasil diperbarui')
                    return response.data.data;
                }
                else if (response.status === 400) {
                    toast.warning('Gagal memperbarui profil: Data tidak valid atau ada kesalahan pada permintaan.')
                }
                else if (response.status === 404) {
                    toast.warning('Profil tidak ditemukan: Data profil yang akan diperbarui tidak ditemukan.')
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memperbarui profil: ${this.error}`);

            } finally {
                this.loading = false;
            }
        },
        async deleteProfile(profileId: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.delete<CommonResponseInterface<UserProfile>>(`${baseUserProfileUrl}/delete/${profileId}`);
                if (response.status === 200) {
                    await this.fetchProfiles();
                    toast.success('Profil berhasil dihapus: Data profil telah berhasil dihapus.');
                }
                else if (response.status === 404) {
                    toast.warning('Profil tidak ditemukan: Data profil yang akan dihapus tidak ditemukan.');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat menghapus profil: ${this.error}`);
            } finally {
                this.loading = false;
            }
        }

    }
})
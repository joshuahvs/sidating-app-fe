import type { LoginRequest } from '@/interfaces/auth.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { CurrentUser } from '@/interfaces/profile.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';

import {
    setLocalStorage,
    clearLocalStorage
} from '@/lib/auth';

const basePostUrl = import.meta.env.VITE_API_URL + '/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as CurrentUser | null,
        token: null as string | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        // user login
        async login(payload: LoginRequest) {
            try {
                this.loading = true;
                const response = await axios.post<
                    CommonResponseInterface<{ token: string } & CurrentUser>
                >(`${basePostUrl}/login`, payload);

                const respData = response.data.data;

                this.token = respData.token;
                const { token, ...userFields } = respData;
                this.user = userFields as CurrentUser;

                toast.success(response.data.message || 'Login successful');
                this.error = null;

                // Store token and user in LocalStorage
                setLocalStorage('token', this.token);
                setLocalStorage('user', this.user);
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat post: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            try {
                this.loading = true;

                clearLocalStorage();
                this.user = null;
                this.token = null;

                toast.success('Logout successful');
                this.error = null;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat logout: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },
    }
});
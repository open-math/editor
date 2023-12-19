import { defineStore } from "pinia";
import Cookie from 'js-cookie';

export const useAuthStore = defineStore('auth', () => {
    const token = ref('');
    const userId = ref(0);

    function reset()
    {
        token.value = '';
        userId.value = 0;
        Cookie.remove('token');
    }

    function setToken(value: string) {
        token.value = value;
        Cookie.remove('token')
        Cookie.set('token', value,{ expires: 1, sameSite: "Lax"});
    }

    function isLogged()
    {
        return userId.value !== 0;
    }

    async function fetchUser()
    {
        const { data: retrievedUserId } = await useFetch('/api/token/' + token.value, {
            method: 'post',
            body: { action: 'get' },
        });

        userId.value = retrievedUserId.value as number;
    }

    async function logout()
    {
        await $fetch('/api/token/' + token.value, {
            method: 'post',
            body: { action: 'delete' }
        });
        reset();
    }

    return { token, userId, setToken, reset, isLogged, fetchUser, logout };
});
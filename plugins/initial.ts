import Cookie from "js-cookie";
import type { Pinia } from "pinia";
import { useAuthStore } from "~/store/auth";

function cookieFromRequestHeaders(key: string)
{
    const headers = useRequestHeaders(['cookie']);
    if ('cookie' in headers)
    {
        const cookie = headers.cookie?.split(';').find(
            c => c.trim().startsWith(`${key}=`)
        );
        if (cookie)
            return cookie.split('=')[1];
    }

    return undefined;
}

export default defineNuxtPlugin(async nuxtApp =>
{
    let token = cookieFromRequestHeaders('token') ?? Cookie.get('token') ?? '';

    if (token)
    {
        const authStore = useAuthStore(nuxtApp.$pinia as Pinia);
        authStore.setToken(token);
        await authStore.fetchUser();
    }
});
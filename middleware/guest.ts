import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) =>
{
    const authStore = useAuthStore();
    const isLogged = authStore.isLogged();

    if (isLogged)
        return navigateTo('/');
});
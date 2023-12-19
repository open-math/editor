import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async to =>
{
    const userId = useAuthStore().userId;
    const topicId = +to.params.id;

    const canOpen = await $fetch('/api/topic/canOpen', {
        method: 'post',
        body: {
            userId,
            topicId,
        }
    })

    if (!canOpen)
        return abortNavigation('Темы не существует или доступ к ней ограничен!');
});
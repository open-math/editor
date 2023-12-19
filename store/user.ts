import type Topic from "~/server/db/entity/Topic";

export const useUser = defineStore('user', () => {
    const id =          ref(0);
    const login =       ref('');
    const isEditor =    ref(false);
    const topics =      ref<Topic[]>([]);

    const isLogged = computed(() => id.value !== 0);

    const canCreateTopic = computed(() => {
        if (isEditor.value)
            return true;

        const config = useRuntimeConfig();

        return topics.value.length < config.public.maxTopics;
    });

    //

    async function fetchUser()
    {
        const { data } = await useFetch(`/api/user/info`, {
            headers: useRequestHeaders(['cookie']),
        });

        if (!data || !data.value)
            throw createError('Ошибка при полученные данных пользователя!');

        id.value =          data.value.id;
        login.value =       data.value.login;
        isEditor.value =    data.value.isEditor;
        topics.value =      data.value.topics;
    }

    //

    return {
        id,
        login,
        isEditor,
        topics,

        isLogged,
        canCreateTopic,

        fetchUser,
    }
});
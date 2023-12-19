<script setup lang="ts">
    definePageMeta({
        middleware: 'guest'
    });

    import type { TResult } from '~/server/api/auth.post';
    import { useAuthStore } from '~/store/auth';

    const login =       ref('');
    const email =       ref('');
    const password =    ref('');
    const error =       ref('');

    const inProcess =   ref(false);
    const regSuccess =  ref(false);

    //
    //
    //

    const isLogin = ref(true);

    useHead({
        title: () => { return isLogin.value ? 'Вход' : 'Регистрация' }
    });

    const modeLabels = computed(() =>
    {
        return {
            title:          isLogin.value ? 'Вход в аккаунт' : 'Новый аккаунт',
            submit:         isLogin.value ? 'Войти' : 'Создать',
            switchLabel:    isLogin.value ? 'Первый раз?' : 'Есть аккаунт?',
            switchText:     isLogin.value ? 'Зарегистрируйтесь!' : 'Выполните вход!',
        }
    });

    //
    // Dummy data
    //

    const dummyData = [
        ['Евклид', 'euclid@greece.old'],
        ['Карл Гаусс', 'gauss@math.king'],
        ['Альберт Эйнштейн', 'albert@relative.phys'],
    ];

    const cDummy = useState('cDummy', () => dummyData[Math.floor(Math.random()*dummyData.length)]);

    //
    // Confirmed message
    //

    const url = useRequestURL();
    const confirmed = url.searchParams.has('confirmed');

    //
    // Submit
    //

    async function submit()
    {
        inProcess.value = true;

        let result = await submitRequest();

        if (result.error) {
            error.value = result.error;
        }
        else if (result.token) {
            const authStore = useAuthStore();
            authStore.setToken(result.token);
            await authStore.fetchUser();
            return navigateTo('/');
        }

        regSuccess.value = !isLogin.value;
        inProcess.value = false;
    }

    async function submitRequest(): Promise<TResult>
    {
        let requestBody = {
            isLogin:    isLogin.value,
            login:      login.value,
            email:      email.value.toLowerCase(),
            password:   password.value,
        }

        try
        {
            const fetchResult = await $fetch('/api/auth', {
                method: 'post',
                body: requestBody
            });

            return fetchResult;
        }
        catch { return { error: 'При обработке данных возникла ошибка!' }; }
    }
</script>

<template>
    <div class="bg-slate-100 min-h-screen h-full flex justify-center items-center">
        <div class="relative min-h-screen h-full sm:max-w-sm sm:min-h-full w-full bg-white sm:shadow-lg sm:rounded-lg flex items-center">
            <div class="flex w-full flex-col space-y-3 p-8 justify-center">
                <header class="flex flex-col items-center space-y-5">
                    <img src="/images/logo.svg" class="w-[60px]">
                    <h1 class="text-2xl font-semibold">{{ modeLabels.title }}</h1>
                </header>
                
                <form @submit.prevent="submit" class="flex flex-col space-y-5">
                    <label class="authInput" v-if="!isLogin">
                        <div>Имя</div>
                        <input type="text" v-model="login" :placeholder="cDummy[0]" required>
                    </label>
                    <label class="authInput">
                        <div>Почта</div>
                        <input type="email" v-model="email" :placeholder="cDummy[1]" required>
                    </label>
                    <label class="authInput">
                        <div>Пароль</div>
                        <input type="password" v-model="password" placeholder="•••••••••" required>
                    </label>
                    <div v-if="error" class="bg-red-100 rounded-lg border p-2 text-sm border-red-300 text-red-500 text-center">{{ error }}</div>
                    <div v-if="confirmed && isLogin" class="bg-green-100 border-green-300 text-green-600 rounded-lg border p-2 text-sm text-center">Почта подтверждена!<br>Теперь вы можете войти в аккаунт!</div>
                    <button type="submit"
                            class="w-full bg-blue-500 py-2 rounded-lg text-white text-lg ease-in duration-150 hover:bg-blue-600">
                        {{ modeLabels.submit }}
                    </button>
                </form>

                <div class="flex space-x-3 justify-center">
                    <div class="text-gray-500">{{ modeLabels.switchLabel }}</div>
                    <a @click="() => { isLogin = !isLogin }" class="ease-in duration-150 text-blue-400 hover:cursor-pointer hover:text-blue-500">{{ modeLabels.switchText }}</a>
                </div>
            </div>

            <div class="regSuccess text-justify z-10" :class="{ showing: regSuccess }">
                <i class="ie-envelope-open-text text-8xl text-gray-600 mb-5"></i>
                <h2 class="font-semibold text-xl">Подтвердите почту!</h2>
                <p class="w-[250px]">На указанную вами почту было отправлено письмо. Перейдите по ссылке внутри письма для завершения регистрации!</p>
            </div>

            <div class="processOverlay z-20" :class="{ showing: inProcess }">
                <img src="/images/logo.svg" class="w-[100px] animate-pulse">
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .authInput
    {
        @apply flex flex-col space-y-3;

        > div
        {
            @apply font-semibold text-gray-600;
        }

        > input
        {
            @apply w-full px-4 bg-gray-100 py-2 border rounded-lg text-gray-700 outline-none hover:ring-blue-300 hover:ring-1 focus:ring-blue-500 focus:ring-2;
        }
    }

    .processOverlay,
    .regSuccess
    {
        @apply ease-in duration-200;
        @apply absolute top-0 left-0 rounded-lg w-full h-full flex justify-center items-center;

        opacity: 0;

        &:not(.showing)
        {
            pointer-events: none;
            touch-action: none;
        }

        &.showing
        {
            opacity: 1;
        }
    }

    .processOverlay
    {
        &.showing
        {
            @apply backdrop-blur-xl;
        }
    }

    .regSuccess
    {
        @apply bg-white p-8 flex-col gap-3;
    }
</style>
import type { Nitro } from 'nitropack';

export default defineNuxtConfig({
    devtools: { enabled: true },
    pages: true,
    css: [
        '~/assets/global.scss'
    ],
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
    ],
    tailwindcss: {
        exposeConfig: true
    },
    hooks: {
        'nitro:build:before': (nitro: Nitro) => { nitro.options.moduleSideEffects.push('reflect-metadata'); }
    },
    nitro: {
        esbuild: {
            options: {
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: true
                    }
                }
            }
        }
    },
    vite: {
        server: {
            fs: {
                allow: ['../..']
            }
        }
    },
    //
    //
    //
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' },
                { rel: 'stylesheet', href: '/fonts/icons/style.css' }
            ]
        }
    },
    //
    //
    //
    runtimeConfig: {
        url: '',
        dbPath: '',

        adminId: '',

        smtpHost: '',
        smtpLogin: '',
        smtpPassword: '',
        fakeMailPath: '',

        helpEmail: '',
        helpPassword: '',

        public: {
            maxTopics: 10,
            maxAssets: 100,
            maxAssetSize: 5,
            maxTopicTotalSize: 15,

            assetsRoot: '',
        }
    }
})

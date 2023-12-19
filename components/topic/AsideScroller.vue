<template>
    <div class="asideScroller">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
    .asideScroller
    {
        overflow: auto;

        &::-webkit-scrollbar {
            width: 7px;
        }

        &::-webkit-scrollbar-thumb
        {
            @apply bg-slate-700;
        }
    }
</style>
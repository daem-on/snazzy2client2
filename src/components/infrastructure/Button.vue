<script setup lang="ts">

defineProps<{
	icon?: string,
	filled?: true
}>();

</script>

<template>
	<button
	class="
		rounded-lg
		px-4
		py-2
		flex
		flex-row
		justify-start
		items-center
		gap-1
		active:outline-white-500
		disabled:outline
		disabled:outline-2
		disabled:outline-white-500
		disabled:bg-white-stripe
		disabled:hover:ring-0
	"
	:class="{
		'bg-white text-black hover:border-gray-500 border-2 border-b-4 border-gray-300 dark:bg-black dark:text-white dark:border-gray-800 dark:hover:border-gray-500': filled,
		'bg-wood-transparent text-white ring-white-transparent hover:ring-4 transition-shadow': !filled,
	}"
	>
		<span v-if="icon" class="material-icons">{{ icon }}</span>
		<slot></slot>
	</button>
</template>
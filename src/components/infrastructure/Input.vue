<script setup lang="ts">
defineOptions({
  inheritAttrs: false
});

const model = defineModel();
</script>

<template>
	<label class="flex flex-col">
		<slot></slot>
		<input class="my-2 p-2 rounded-lg border-2 border-gray-300 invalid:border-red-300 invalid:outline-red-500" v-bind="$attrs" v-model="model">
	</label>
</template>

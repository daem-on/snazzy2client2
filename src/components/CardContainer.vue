<script setup lang="ts">
import Card from "./Card.vue";

defineProps<{
	list: (number | undefined)[],
	listName: string,
	active: boolean,
}>();

</script>

<template>
	<vue-draggable-container class="flex flex-row flex-wrap justify-center outline-none gap-4">
		<div
			v-for="(entry, index) in list"
			class="dropzone w-32 h-44 outline-white-transparent outline-4 empty:outline-dashed -outline-offset-8"
			:list="listName"
			:key="index"
			:index="index"
			:class="{ 'draggable-dropzone--occupied': entry !== undefined }">

			<div v-if="entry !== undefined" class="item" :cardId="entry">
				<Card :id="entry" type="white" :interactive="active" />
			</div>

		</div>
	</vue-draggable-container>
</template>

<style scoped>
.draggable-source--is-dragging .card {
	color: transparent;
	background: none;
	box-shadow: none;
	outline: white 3px dashed;
}

.draggable-mirror .card {
	box-shadow: 0px 12px 29px -16px rgba(0,0,0,0.75);
	transform: scale(1.2);
	cursor: grabbing;
}

.draggable-mirror {
	z-index: 2;
}
</style>
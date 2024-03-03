<script setup lang="ts">
import { ref } from "vue";
import type { RoomOptions } from "./components/RoomForm.vue";
import RoomForm from "./components/RoomForm.vue";
import Game from "./components/Game.vue";
import { checkOnline } from "./connect";

const options = ref<RoomOptions | null>(null);

const isOnline = ref(null as boolean | null);

async function init() {
	isOnline.value = await checkOnline();
}

init();

</script>

<template>
	<div v-if="isOnline === false">Server could not be reached.</div>
	<template v-if="isOnline">
		<template v-if="options == null">
			<div class="page">
				<RoomForm @submit="options = $event"></RoomForm>
			</div>
		</template>
		<template v-else>
			<Game :options="options" @quit="options = null"></Game>
		</template>
	</template>
</template>

<style scoped>
.page {
	background: white;
	padding: 1em;
	max-width: 20rem;
	margin: 0 auto;
}

input {
	margin: 0.5rem 0;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: 1px solid #ccc;
}

label {
	display: flex;
	flex-direction: column;
}
</style>

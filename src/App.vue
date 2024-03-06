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
			<div class="mx-auto mt-2 bg-white p-4 max-w-80">
				<RoomForm @submit="options = $event"></RoomForm>
			</div>
		</template>
		<template v-else>
			<Game :options="options" @quit="options = null"></Game>
		</template>
	</template>
</template>

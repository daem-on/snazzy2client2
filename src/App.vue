<script setup lang="ts">
import { ref } from "vue";
import type { RoomOptions } from "./components/RoomForm.vue";
import RoomForm from "./components/RoomForm.vue";
import Game from "./components/Game.vue";
import { checkOnline, join } from "./connect";

const ws = ref<WebSocket | null>(null);
const username = ref("Username");
const connecting = ref(false);

const isOnline = ref(null as boolean | null);

async function init() {
	isOnline.value = await checkOnline();
}

async function joinRoom(options: RoomOptions) {
	if (connecting.value) return;
	try {
		connecting.value = true;
		username.value = options.username;
		ws.value = await join(options.title, options.deck);
		window.location.hash = options.title;
	} finally {
		connecting.value = false;
	}
}

init();

</script>

<template>
	<div v-if="isOnline === false">Server could not be reached.</div>
	<template v-if="isOnline">
		<template v-if="ws == null">
			<div class="page">
				<RoomForm @submit="joinRoom"></RoomForm>
			</div>
		</template>
		<template v-else>
			<Game :ws="ws" :username="username" @disconnect="ws = null"></Game>
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

<script setup lang="ts">
import { ref } from "vue";
import type { RoomOptions } from "./components/RoomForm.vue";
import RoomForm from "./components/RoomForm.vue";
import Game from "./components/Game.vue";
import { join } from "./connect";

const ws = ref<WebSocket | null>(null);
const username = ref("Username");
const connecting = ref(false);

async function init() {
	
}

async function joinRoom(options: RoomOptions) {
	if (connecting.value) return;
	try {
		connecting.value = true;
		ws.value = await join(options.title, options.deck);
		window.location.hash = options.title;
	} finally {
		connecting.value = false;
	}
}

init();

</script>

<template>
	<template v-if="ws == null">
		<div class="page">
			<form>
				<label>
					Username
					<input type="text" v-model="username" />
				</label>
			</form>
			<RoomForm @submit="joinRoom"></RoomForm>
		</div>
	</template>
	<template v-else>
		<Game :ws="ws" :username="username"></Game>
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

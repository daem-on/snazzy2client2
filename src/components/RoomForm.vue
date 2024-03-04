<script setup lang="ts">
import { reactive } from 'vue';
import Button from './Button.vue';

const emit = defineEmits<{
	(e: "submit", options: RoomOptions): void
}>();

const lastDeckKey = "lastDeck";

const defaultName = 
	window.location.hash.slice(1)
	|| "Room" + Math.floor(Math.random() * 1000);

export type RoomOptions = {
	username: string,
	title: string,
	deck: string,
	dealNumber?: number,
};

const options: RoomOptions = reactive({
	username: "Username",
	title: defaultName,
	deck: localStorage.getItem(lastDeckKey) || "",
	dealNumber: undefined,
})

function submit() {
	localStorage.setItem(lastDeckKey, options.deck);
	emit("submit", {
		username: options.username,
		title: options.title,
		deck: options.deck,
		dealNumber: options.dealNumber || undefined,
	});
}

const predefinedDecks: Map<string, string> = new Map([
	["Base Set", "https://gist.githubusercontent.com/daem-on/68db4cdd7abc6b738ee5059ba9a60e17/raw/4c268b9399267606e4dc41bc8be9d3a18bff0ef1/us.json"],
]);

</script>

<template>
	<div class="room-options">
		<form @submit="submit">
			<label>
				Username
				<input type="text" v-model="options.username" />
			</label>
			<label>
				Title
				<input type="text" v-model="options.title" />
			</label>
			<label>
				Deck URL
				<div class="deck-presets">
					<button type="button" v-for="[name, url] in predefinedDecks" @click="options.deck = url" :key="name">
						{{ name }}
					</button>
				</div>
				<input type="text" v-model="options.deck" />
			</label>
			<label>
				Deal Number
				<input type="number" v-model.number="options.dealNumber" />
			</label>
		</form>
	</div>
	<Button icon="login" black @click="submit">Join</Button>
</template>

<style scoped>
.room-options {
	display: flex;
	flex-direction: column;
}

.room-options input {
	margin: 0.5rem 0;
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: 1px solid #ccc;
}

.room-options label {
	display: flex;
	flex-direction: column;
}

.deck-presets {
	display: flex;
	flex-direction: row;
	gap: 0.5rem;
	margin: 0.5rem 0;
	max-width: 100%;
	overflow-x: auto;
}

.deck-presets button {
	padding: 0.5rem;
	border-radius: 0.5rem;
	border: 1px solid #ccc;
	cursor: pointer;
	white-space: nowrap;
}

</style>
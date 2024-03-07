<script setup lang="ts">
import { reactive } from 'vue';
import Button from './infrastructure/Button.vue';
import Input from './infrastructure/Input.vue';
import logoUrl from "@/assets/cards-logo.svg";

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
	["Base Set", "https://gist.githubusercontent.com/daem-on/68db4cdd7abc6b738ee5059ba9a60e17/raw/21662cb4a800b61f24c89d293c6aa1508cec6d13/us.json"],
]);

</script>

<template>
	<h2 class="text-4xl text-center mb-3">
		<img class="inline size-11" :src="logoUrl" alt="Logo">
		Snazzy
	</h2>
	<div>
		<form @submit="submit">
			<Input type="text" v-model="options.username" required>
				Username
			</Input>
			<Input type="text" v-model="options.title" required>
				Title
			</Input>
			<Input type="url" v-model="options.deck">
				Deck URL
			</Input>
			<div class="flex flex-row gap-2 my-2">
				<button class="p-2 rounded-lg bg-gray-100 border-2 border-gray-300" type="button" v-for="[name, url] in predefinedDecks" @click="options.deck = url" :key="name">
					{{ name }}
				</button>
			</div>
			<Input type="number" v-model.number="options.dealNumber" placeholder="7" min="1">
				Deal Number
			</Input>
			<div class="flex justify-center">
				<Button icon="login" black type="submit">Join</Button>
			</div>
		</form>
	</div>
</template>

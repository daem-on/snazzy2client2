<script setup lang="ts">
import { reactive } from 'vue';
import Button from './Button.vue';

const emit = defineEmits<{
	(e: "submit", options: RoomOptions): void
}>();

const defaultName = 
	window.location.hash.slice(1)
	|| "Room" + Math.floor(Math.random() * 1000);

export type RoomOptions = {
	username: string,
	title: string,
	deck: string,
	dealNumber?: number,
	winLimit?: number,
};

const options: RoomOptions = reactive({
	username: "Username",
	title: defaultName,
	deck: "https://gist.githubusercontent.com/daem-on/82632a44fece3017f45e4feb5b87bc4a/raw/494df51787a05fbe73b9b023f864fe3f0c7ba595/12b.json",
	dealNumber: undefined,
	winLimit: undefined,
})

function submit() {
	// fix v-model empty numbers
	emit("submit", {
		username: options.username,
		title: options.title,
		deck: options.deck,
		dealNumber: options.dealNumber || undefined,
		winLimit: options.winLimit || undefined,
	});
}

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
				<input type="text" v-model="options.deck" />
			</label>
			<label>
				Deal Number
				<input type="number" v-model.number="options.dealNumber" />
			</label>
			<label>
				Win Limit
				<input type="number" v-model.number="options.winLimit" />
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

</style>
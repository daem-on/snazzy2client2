<script setup lang="ts">
import { computed, reactive } from 'vue';
import { PlayerStatus } from '../../server2/dtos';
import Button from './infrastructure/Button.vue';
import Card from './Card.vue';
import BlockerDisplay from './BlockerDisplay.vue'

const props = defineProps<{
	hand: Set<number>,
	status?: PlayerStatus,
	cardsInRound: number
}>();

const emit = defineEmits<{
	(e: "play", cards: number[]): void
}>();

const picked: number[] = reactive([]);

const cantPlay = computed(() => props.status !== PlayerStatus.Responding);

function pick(card: number) {
	if (props.status !== PlayerStatus.Responding) return;
	if (picked.includes(card)) picked.splice(picked.indexOf(card), 1);
	else if (picked.length >= props.cardsInRound) return;
	else picked.push(card);
}

function playCards() {
	if (picked.length !== props.cardsInRound) return;
	emit("play", [...picked]);
	picked.length = 0;
}

</script>

<template>
	<div class="flex flex-row flex-nowrap justify-start items-center gap-3 m-3">
		<Button icon="front_hand" @click="playCards" :disabled="picked.length !== props.cardsInRound">Play card</Button>
		<Button icon="undo" @click="picked.length = 0" :disabled="picked.length === 0">Clear picked</Button>
	</div>
	<div class="flex flex-row flex-nowrap justify-start items-center w-100 overflow-x-auto p-6 gap-4">
		<Card
			v-for="card in hand"
			:key="card"
			:id="card"
			class="flex-shrink-0"
			:class="{
				'shadow-lg -translate-y-5': picked.includes(card),
				'opacity-60': cantPlay
			}"
			type="white"
			@click="pick(card)"
		/>
		<div v-if="cantPlay" class="absolute w-full bg-white text-center p-5 size-6 rounded-lg h-auto left-0">
			<BlockerDisplay :status="status" />
		</div>
	</div>
</template>

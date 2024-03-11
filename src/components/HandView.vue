<script setup lang="ts">

import type { DroppableDroppedEvent, DroppableStartEvent, DroppableStopEvent } from "@shopify/draggable";
import { reactive, watch } from "vue";
import { PlayerStatus } from '../../server2/dtos';
import Button from "./infrastructure/Button.vue";
import CardContainer from "./CardContainer.vue";
import BlockerDisplay from "./BlockerDisplay.vue";

const props = defineProps<{
	hand: Set<number>,
	status?: PlayerStatus,
	cardsInRound: number
}>();

const emit = defineEmits<{
	(e: "play", cards: number[]): void
}>();

const picked: (number | undefined)[] = reactive([undefined]);
const hand: (number | undefined)[] = reactive([...props.hand]);

while (picked.length < props.cardsInRound) picked.push(undefined);
while (hand.length < props.hand.size) hand.push(undefined);

const lists: Record<string, (number | undefined)[]> = {picked, hand};

const options = {
	draggable: ".item",
	dropzone: ".dropzone",
}

let dragging: DroppableStartEvent | undefined = undefined;
let currentTarget: DroppableDroppedEvent | undefined = undefined;

function start(e: DroppableStartEvent) {
	if (props.status === PlayerStatus.Picking) return e.cancel();
	dragging = e;
}
function dropped(e: DroppableDroppedEvent) { currentTarget = e; }
function returned() { currentTarget = undefined; }
function stop(e: DroppableStopEvent) {
	try {
		if (currentTarget == undefined) {
			if (dragging != undefined && dragging.dropzone !== e.dropzone)
				throw new Error("No target, but different dropzone");
			return;
		}
	
		if (dragging == undefined || (currentTarget?.dropzone !== e.dropzone))
			throw new Error("Target has incorrect dropzone");
		
		const sourceList = lists[dragging.dropzone.getAttribute("list")!];
		const targetList = lists[currentTarget.dropzone.getAttribute("list")!];
		const sourceIndex = parseInt(dragging.dropzone.getAttribute("index")!);
		const targetIndex = parseInt(currentTarget.dropzone.getAttribute("index")!);
	
		if (targetList[targetIndex] != undefined)
			throw new Error("Target already occupied");
	
		const card = sourceList.splice(sourceIndex, 1, undefined)[0];
		targetList.splice(targetIndex, 1, card);
	} catch (e) {
		console.error(e);
	} finally {
		dragging = undefined;
		currentTarget = undefined;
	}
}

function returnToHand() {
	for (let i = 0; i < picked.length; i++) {
		const card = picked[i];
		if (card == undefined) continue;
		const index = hand.findIndex(x => x == undefined);
		if (index == -1) {
			hand.push(card);
			continue;
		}
		hand.splice(index, 1, card);
		picked.splice(i, 1, undefined);
	}
}

function addToHand(card: number) {
	const index = hand.findIndex(x => x == undefined);
	if (index == -1) {
		hand.push(card);
		return;
	}
	hand.splice(index, 1, card);
}

watch(props.hand, newHand => {
	newHand.forEach(card => { if (!hand.includes(card)) addToHand(card) });
	for (let i = 0; i < hand.length; i++) {
		if (hand[i] == undefined) continue;
		if (!newHand.has(hand[i]!)) hand.splice(i, 1, undefined);
	}
});

watch(() => props.cardsInRound, (newValue) => {
	returnToHand();
	picked.length = newValue;
	for (let i = 0; i < picked.length; i++) picked[i] = undefined;
});

function playPicked() {
	const cards = picked.filter(x => x != undefined) as number[];
	if (cards.length !== props.cardsInRound) return;
	emit("play", cards);
	for (let i = 0; i < cards.length; i++) {
		const index = picked.findIndex(x => x == cards[i]);
		picked.splice(index, 1, undefined);
	}
}

</script>

<template>
	<div v-if="status !== PlayerStatus.Responding" class="bg-white p-5 rounded-lg text-center m-4">
		<p>
			<BlockerDisplay :status="status" />
		</p>
	</div>
	<template v-else>
		<vue-droppable :options="options" @droppable:start="start" @droppable:dropped="dropped" @droppable:returned="returned" @droppable:stop="stop">
			<div class="flex flex-row flex-wrap justify-center items-center gap-3">
				<div class="flex flex-col items-end justify-center gap-3 shrink-0">
					<Button icon="front_hand" @click="playPicked">Play card</Button>
					<Button icon="undo" @click="returnToHand">Clear picked</Button>
				</div>
				<CardContainer class="shrink-0" :list="picked" listName="picked" :active="props.status !== PlayerStatus.Picking"></CardContainer>
			</div>
			<CardContainer class="my-2" :list="hand" listName="hand" :active="props.status !== PlayerStatus.Picking"></CardContainer>
		</vue-droppable>
	</template>
</template>

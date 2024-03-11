<script setup lang="ts">
import type { DeckClientState } from "../../server2/dtos";
import { inject, type Ref } from "vue";

const props = defineProps<{
	type: "black" | "white" | "played",
	id: number,
	winner?: boolean,
	interpolateIds?: number[],
	hide?: boolean
}>();

const deckSync: Ref<DeckClientState | undefined> = inject("deckSync")!;

function getText() {
	if (props.hide) return "";
	const deck = deckSync.value?.deck;
	if (deck == undefined) return "";
	switch (props.type) {
		case "black":
			return deck.calls[props.id].join(" ____ ");
		case "white":
			return deck.responses[props.id][0];
		case "played": {
			const list = deck.calls[props.id];
			if (!list || !props.interpolateIds || list.length-1 !== props.interpolateIds.length) {
				return "ERROR";
			}
			return list.map((item, index) => {
				const id = props.interpolateIds![index];
				if (id === undefined) return item;
				const response = deck.responses[id][0];
				return item + response;
			}).join("");
		}
	}
}

</script>

<template>
	<div
		class="transition-transform w-32 h-44 rounded-lg p-3 overflow-hidden break-words whitespace-pre-line card"
		:class="{
			'bg-black text-white': type === 'black',
			'bg-white': type !== 'black',
			'outline-blue-500 outline-4 outline shadow-lg scale-110 z-10': winner,
			'rotate-y-180': hide,
			'w-44': type === 'played'
		}">
		<p class="my-1 leading-5">{{ getText() }}</p>
	</div>
</template>
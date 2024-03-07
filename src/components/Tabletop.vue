<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { PlayerStatus } from '../../server2/dtos';
import type { GameStateSlice } from '../../server2/dtos';
import Card from "./Card.vue";

const props = defineProps<{
	state: GameStateSlice;
	myStatus?: PlayerStatus;
}>();

const emit = defineEmits<{
	(e: "pickCard", index: number): void;
}>();

const state = reactive({
	call: props.state.call,
	revealedResponses: props.state.revealedResponses,
	reveal: props.state.revealedResponses != null
});
const localWinner = ref<number | undefined>(undefined);

watch(() => props.state, () => {
	if (props.state.lastWinner) localWinner.value = undefined;
	state.call = props.state.call;
	state.revealedResponses = props.state.revealedResponses;
	state.reveal = props.state.revealedResponses != null;
});

const realWinner = computed(() => 
	props.state.lastWinner?.revealIndex
);

function pickCard(index: number) {
	if (
		props.myStatus !== PlayerStatus.Picking
		|| !state.reveal
		|| realWinner.value != null
	) return;
	emit("pickCard", index);
	localWinner.value = index;
}

</script>

<template>
	<div id="tabletop" class="flex flex-row flex-nowrap justify-start outline-none overflow-x-auto gap-4 flex-shrink-0 px-7 py-5 max-w-full">
		<Card class="flex-shrink-0" v-if="state.call != undefined" :id="state.call" type="black" />
		<div v-if="state.revealedResponses?.length" class="flex-shrink-0 flex flex-row gap-4">
			<Card
				v-for="(response, index) in state.revealedResponses"
				class="white card"
				@click="pickCard(index)"
				:key="index"
				:id="state.call!"
				:winner="realWinner === index || localWinner === index"
				:interpolate-ids="response"
				:hide="false"
				type="played"
				/>
		</div>
	</div>
</template>
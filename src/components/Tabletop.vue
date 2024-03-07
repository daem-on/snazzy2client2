<script setup lang="ts">
import { computed, ref, watch } from "vue";
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

const localWinner = ref<number | undefined>(undefined);

watch(() => props.state, () => {
	if (props.state.lastWinner) localWinner.value = undefined;
});

const reveal = computed(() => props.state.revealedResponses != null);

const realWinner = computed(() => 
	props.state.lastWinner?.revealIndex
);

const finishedPlayerCount = computed(() => 
	props.state.players.filter(p => p.status === PlayerStatus.Finished).length
);

function pickCard(index: number) {
	if (
		props.myStatus !== PlayerStatus.Picking
		|| !reveal.value
		|| realWinner.value != null
	) return;
	emit("pickCard", index);
	localWinner.value = index;
}

</script>

<template>
	<div id="tabletop" class="flex flex-row flex-nowrap justify-start outline-none overflow-x-auto gap-4 flex-shrink-0 px-7 py-5 max-w-full">
		<Card class="flex-shrink-0" v-if="state.call != undefined" :id="state.call" type="black" />
		<div class="flex-shrink-0 flex flex-row gap-4">
			<template v-if="state.revealedResponses?.length">
				<Card
					v-for="(response, index) in state.revealedResponses"
					class="card"
					@click="pickCard(index)"
					:key="index"
					:id="state.call!"
					:winner="realWinner === index || localWinner === index"
					:interpolate-ids="response"
					:hide="false"
					type="played"
					/>
			</template>
			<template v-else>
				<Card v-for="index in finishedPlayerCount" :key="index" :id="state.call!" :hide="true" type="played"></Card>
			</template>
		</div>
	</div>
</template>
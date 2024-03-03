<script setup lang="ts">

import { computed, onBeforeUnmount, provide, reactive, ref, watch, type Ref } from "vue";
import { type ServerMessage, type ClientMessage, type GameStateSlice, PlayerStatus } from "../../server2/dtos";
import Button from "./Button.vue";
import HandView from "./HandView.vue";
import PlayerList from "./PlayerList.vue";
import SimpleHandView from "./SimpleHandView.vue";
import Tabletop from "./Tabletop.vue";
import { fetchDeck } from "@/fetchDeck.js";
import type { DeckSync } from "@/DeckSync";
import logoUrl from "@/assets/cards-logo.svg";

export type CardType = { id: number, text: string };

const props = defineProps<{
	ws: WebSocket;
	username: string;
}>();

const emit = defineEmits<{
	(e: "disconnect"): void
}>();

const state: Ref<GameStateSlice | null> = ref(null);
const hand = reactive(new Set<number>());
const deckSync: Ref<DeckSync | undefined> = ref(undefined);
const cardsInRound = ref(1);
let myId: Ref<string | undefined> = ref(undefined);
let useSimpleView = ref(localStorage.getItem("useSimpleView") === "true");

provide("deckSync", deckSync);

async function updateDeck(url: string) {
	deckSync.value = await fetchDeck(url);
}

function updateCardsInRound() {
	const def = deckSync.value?.definition;
	if (!def || !state.value?.call) return;
	cardsInRound.value = def.callLengths[state.value.call] - 1;
}

const myStatus = computed(() => {
	if (state.value == null || myId.value == undefined) return undefined;
	return state.value.status;
});

const started = computed(() => {
	return (state.value?.roundNumber ?? 0) <= 0;
})

watch(useSimpleView,
	() => localStorage.setItem("useSimpleView", useSimpleView.value.toString())
);

const ws = ref(props.ws as WebSocket | null);

function send(message: ClientMessage) {
	ws.value?.send(JSON.stringify(message));
}

ws.value!.onopen = () => {
	console.log("connected");
}

ws.value!.onclose = ev => {
	console.log("disconnected", ev.code, ev.reason);
	ws.value = null;
	emit("disconnect");
}

ws.value!.onmessage = ev => {
	console.log("message", ev.data);
	const message = JSON.parse(ev.data) as ServerMessage;
	switch (message.type) {
		case "init": {
			myId.value = message.id;
			updateDeck(message.deckUrl);
			send({ type: "join", username: props.username });
			break;
		}
		case "state": {
			state.value = message.state;
			setHand(state.value);
			updateCardsInRound();
			break;
		}
		case "error": {
			console.error(message.message);
		}
	}
}

const setHand = ({ hand: ids }: { hand?: number[] }) => {
	if (!ids) return;
	hand.clear();
	for (const id of ids) hand.add(id);
};

function startGame() {
	send({ type: "start" });
}

function playCard(cards: number[]) {
	send({ type: "response", response: cards });
	for (const card of cards) hand.delete(card);
}

function pickCard(index: number) {
	send({ type: "pick", pickedIndex: index });
}

onBeforeUnmount(() => ws.value?.close());

</script>

<template>
	<template v-if="started">
		<div class="column">
			<div class="waiting">
				<h2>
					<img :src="logoUrl" alt="Logo">
					Snazzy.
				</h2>
				<p>The game has not started yet.</p>
				<ul>
					<li v-for="{ status, username } in state?.players" :key="username">
						{{ username }}
						<span v-if="status === PlayerStatus.Disconnected">t/o</span>
					</li>
				</ul>
			</div>
			<Button icon="play_circle" @click="startGame" v-if="state?.isHost">Start</Button>
		</div>
	</template>
	<template v-else>
		<div class="margin-10">
			<PlayerList v-if="state != null" :state="state" />
		</div>

		<div v-if="deckSync && state" class="center">
			<Tabletop :my-status="myStatus" :state="state" @pick-card="pickCard" />
		</div>
		<div v-if="deckSync">
			<SimpleHandView v-if="useSimpleView" :cards-in-round="cardsInRound" :status="myStatus" :hand="hand" @play="playCard"></SimpleHandView>
			<HandView v-else :cards-in-round="cardsInRound" :status="myStatus" :hand="hand" @play="playCard"></HandView>
		</div>
		<div class="center margin-10">
			<Button icon="autorenew" @click="useSimpleView = !useSimpleView">Switch view</Button>
		</div>
	</template>
</template>

<style scoped>
.margin-10 {
	margin: 10px;
}

.center {
	display: flex;
	justify-content: center;
}

.column {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 10px;
	gap: 10px;
}

.waiting {
	background-color: white;
	padding: 2em;
	border-radius: 10px;
}

.waiting h2 {
	margin: 6px 0;
}

.waiting ul {
	margin: 0;
	padding: 0;
	list-style: none;
}

.waiting li {
	border-top: 1px solid black;
	padding: 4px 0;
}
</style>

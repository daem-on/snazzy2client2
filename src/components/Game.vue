<script setup lang="ts">

import { computed, onBeforeUnmount, provide, reactive, ref, shallowRef, watch } from "vue";
import { type ServerMessage, type ClientMessage, type GameStateSlice, PlayerStatus, type DeckClientState } from "../../server2/dtos";
import Button from "./Button.vue";
import HandView from "./HandView.vue";
import PlayerList from "./PlayerList.vue";
import SimpleHandView from "./SimpleHandView.vue";
import Tabletop from "./Tabletop.vue";
import { fetchDeck } from "@/fetchDeck.js";
import logoUrl from "@/assets/cards-logo.svg";
import type { RoomOptions } from "./RoomForm.vue";
import { join } from "@/connect";

export type CardType = { id: number, text: string };

const props = defineProps<{
	options: RoomOptions;
}>();

const emit = defineEmits<{
	(e: "quit"): void
}>();

const useSimpleViewKey = "useSimpleView";

const state = ref<GameStateSlice | null>(null);
const hand = reactive(new Set<number>());
const deckSync = ref<DeckClientState | undefined>(undefined);
const cardsInRound = ref(1);
const token = ref<string | null>(null);
const useSimpleView = ref(localStorage.getItem(useSimpleViewKey) === "true");

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
	if (state.value == null) return undefined;
	return state.value.status;
});

const started = computed(() => {
	return (state.value?.roundNumber ?? 0) > 0;
})

watch(useSimpleView,
	() => localStorage.setItem(useSimpleViewKey, useSimpleView.value.toString())
);

const ws = shallowRef<WebSocket | null>(null);

function send(message: ClientMessage) {
	ws.value?.send(JSON.stringify(message));
}

function handleMessage(message: ServerMessage) {
	switch (message.type) {
		case "init": {
			token.value = message.token;
			updateDeck(message.deckUrl);
			send({ type: "join", username: props.options.username });
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

watch(ws, value => {
	if (!value) return;

	value.onopen = () => {
		console.log("connected");
	}
	
	value.onclose = ev => {
		console.log("disconnected", ev.code, ev.reason);
		tryConnect();
	}
	
	value.onmessage = ev => {
		console.log("message", ev.data);
		const message = JSON.parse(ev.data) as ServerMessage;
		handleMessage(message);
	}
});

async function tryConnect() {
	try {
		ws.value = await join({
			name: props.options.title,
			deckUrl: props.options.deck,
			handSize: props.options.dealNumber,
			token: token.value ?? undefined,
		});
		window.location.hash = props.options.title;
	} catch (e) {
		console.error(e);
		emit("quit");
	}
}

tryConnect();

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
	<template v-if="!started">
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

<script setup lang="ts">

import { computed, onBeforeUnmount, provide, reactive, ref, shallowRef, watch } from "vue";
import { type ServerMessage, type ClientMessage, type GameStateSlice, PlayerStatus, type DeckClientState } from "../../server2/dtos";
import Button from "./infrastructure/Button.vue";
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

const terminalCloseCodes = [1001, 1008];
let retries = 10;

watch(ws, value => {
	if (!value) return;

	value.onopen = () => {
		console.log("connected");
	}

	value.onerror = ev => {
		console.error("error", ev);
	}
	
	value.onclose = ev => {
		console.log("disconnected", ev.code, ev.reason);
		if (terminalCloseCodes.includes(ev.code) || retries-- <= 0) {
			emit("quit");
			return;
		}
		setTimeout(() => tryConnect(), 1000);
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
		<div class="flex flex-col items-center m-3 gap-3">
			<div class="bg-white p-8 rounded-lg">
				<h2 class="text-4xl text-center mb-3">
					<img class="inline size-11" :src="logoUrl" alt="Logo">
					Snazzy.
				</h2>
				<p class="my-2">The game has not started yet.</p>
				<ul>
					<li v-for="{ status, username } in state?.players" :key="username" class="border-t border-black py-2">
						{{ username }}
						<span v-if="status === PlayerStatus.Disconnected">t/o</span>
					</li>
				</ul>
			</div>
			<Button icon="play_circle" @click="startGame" v-if="state?.isHost">Start</Button>
		</div>
	</template>
	<template v-else>
		<div class="m-3">
			<PlayerList v-if="state != null" :state="state" />
		</div>

		<div v-if="deckSync && state" class="flex justify-center">
			<Tabletop :my-status="myStatus" :state="state" @pick-card="pickCard" />
		</div>
		<div v-if="deckSync">
			<SimpleHandView v-if="useSimpleView" :cards-in-round="cardsInRound" :status="myStatus" :hand="hand" @play="playCard"></SimpleHandView>
			<HandView v-else :cards-in-round="cardsInRound" :status="myStatus" :hand="hand" @play="playCard"></HandView>
		</div>
		<div class="flex justify-center m-3">
			<Button icon="autorenew" @click="useSimpleView = !useSimpleView">Switch view</Button>
		</div>
	</template>
</template>
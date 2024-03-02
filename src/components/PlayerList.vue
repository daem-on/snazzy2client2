<script setup lang="ts">
import { computed } from 'vue';
import { PlayerStatus } from '../../server2/dtos';
import type { GameStateSlice } from '../../server2/dtos.ts';

const props = defineProps<{
	state: GameStateSlice;
}>();

const displayed = computed(() => {
	const all = props.state.players.entries();
	return Array.from(all).filter(e => e[1].status !== PlayerStatus.Disconnected);
});

const statusIcons: Record<PlayerStatus, string> = {
	[PlayerStatus.Responding]: "sms",
	[PlayerStatus.Finished]: "check",
	[PlayerStatus.Disconnected]: "signal_wifi_bad",
	[PlayerStatus.Picking]: "event_seat",
	[PlayerStatus.Waiting]: "schedule",
};

</script>

<template>
	<ul>
		<li v-for="[id, player] in displayed" :title="id.toString()" :key="id">
			<span>{{ player.username }}</span>
			<span class="material-icons">
				{{ statusIcons[player.status] }}
			</span>
			<span>{{ player.points }}</span>
		</li>
	</ul>
</template>

<style scoped>
ul {
	display: flex;
	flex-direction: row;
	justify-content: start;
	align-items: center;
	width: 100%;
	overflow-x: auto;
	padding-top: 25px;
	gap: 10px;
	margin: 0;
	padding: 0;
}

li {
	list-style: none;
	background-color: black;
	color: white;
	padding: 6px 10px;
	flex-shrink: 0;
	
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
}
</style>
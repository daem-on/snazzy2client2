<script setup lang="ts">
import { computed } from 'vue';
import { PlayerStatus } from '../../server2/dtos';
import type { GameStateSlice } from '../../server2/dtos';

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
	<ul class="flex flex-row flex-nowrap justify-start items-center w-full overflow-x-auto gap-3">
		<li v-for="[id, player] in displayed" :title="id.toString()" :key="id" class="flex-shrink-0 bg-black text-white px-3 py-2 flex flex-row items-center gap-1">
			<span>{{ player.username }}</span>
			<span class="material-icons">
				{{ statusIcons[player.status] }}
			</span>
			<span>{{ player.points }}</span>
		</li>
	</ul>
</template>

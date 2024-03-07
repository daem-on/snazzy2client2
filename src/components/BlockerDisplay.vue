<script setup lang="ts">
import { PlayerStatus } from '../../server2/dtos';

defineProps<{
	status: PlayerStatus | undefined;
}>();

</script>

<template>
	<template v-if="status === PlayerStatus.Picking">
		<div><span class="material-icons">event_seat</span></div>
		You are the Card Czar.
	</template>

	<template v-if="status === PlayerStatus.Finished">
		<div><span class="material-icons">done_all</span></div>
		You have played this turn.
	</template>

	<template v-if="status === PlayerStatus.Waiting">
		<div><span class="material-icons">schedule</span></div>
		You have to wait for the others to play.
	</template>
</template>

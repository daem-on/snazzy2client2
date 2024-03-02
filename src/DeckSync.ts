import type { DeckDefinition } from "server2/dtos";

export type DeckSync = {
	deck: {
		calls: string[][],
		responses: string[][],
	},
	definition: DeckDefinition,
};
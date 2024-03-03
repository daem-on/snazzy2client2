import type { DeckDefinition, DeckSource } from "server2/dtos";

export type DeckSync = {
	deck: DeckSource,
	definition: DeckDefinition,
};
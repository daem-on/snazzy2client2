import type { DeckSync } from "./DeckSync";

// Should be the same as /server2/handlers/game.ts#fetchAndValidateDeck
export async function fetchDeck(url: string): Promise<DeckSync> {
	const response = await fetch(url);
	const result = await response.json();
	return {
		definition: {
			calls: result.calls.length,
			responses: result.responses.length,
			callLengths: result.calls.map((c: string[]) => c.length),
			url,
		},
		deck: result
	};
}
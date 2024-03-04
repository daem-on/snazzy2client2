function getServerUrl(): URL {
	const localOverride = localStorage.getItem("urlOverride");
	if (localOverride) return new URL(localOverride);

	const buildOverride = import.meta.env.VITE_SERVER_URL;
	if (buildOverride) return new URL(buildOverride);

	const url = new URL(window.location.href);
	url.search = "";
	url.hash = "";
	return url;
}

export type JoinSettings = {
	name: string;
	deckUrl: string;
	token?: string;
	handSize?: number;
};

export async function join(settings: JoinSettings) {
	const url = getServerUrl();
	url.protocol = url.protocol.replace("http", "ws");
	url.pathname = `/games/${settings.name}`
	url.searchParams.append("deck", settings.deckUrl);
	if (settings.token) url.searchParams.append("token", settings.token);
	if (settings.handSize) url.searchParams.append("handSize", settings.handSize.toString());
	return new WebSocket(url);
}

export async function checkOnline(): Promise<boolean> {
	const url = getServerUrl();
	url.pathname = `/health`;
	try {
		const response = await fetch(url);
		const result = await response.text()
		return result === "ok";
	} catch {
		return false;
	}
}
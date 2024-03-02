function getServerUrl(): URL {
	const localOverride = localStorage.getItem("urlOverride");
	if (localOverride) return new URL(localOverride);

	const buildOverride = import.meta.env.VITE_SERVER_URL;
	if (buildOverride) return new URL(buildOverride);

	const url = new URL(window.location.href);
	url.port = "2567";
	url.search = "";
	url.protocol = url.protocol.replace("http", "ws");
	url.hash = "";
	return url;
}

export async function join(name: string, deckUrl: string) {
	const url = getServerUrl();
	url.pathname = `/api/games/${name}`
	url.searchParams.append("deck", deckUrl);
	return new WebSocket(url);
}
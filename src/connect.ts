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

export async function join(name: string, deckUrl: string, token?: string) {
	const url = getServerUrl();
	url.protocol = url.protocol.replace("http", "ws");
	url.pathname = `/games/${name}`
	url.searchParams.append("deck", deckUrl);
	if (token) url.searchParams.append("token", token);
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
const nomeCache = "diario-de-bordo-v1";
const arquivosAplicacao = [
	"./",
	"./index.html",
	"./style.css",
	"./script.js",
	"./manifest.json",
	"./icons/icon.png",
	"./icons/icon-192.png",
	"./icons/icon-512.png",
	"./images/hero-671x210.webp",
	"./images/hero.webp",
];

self.addEventListener("install", (evento) => {
	evento.waitUntil(
		caches
			.open(nomeCache)
			.then((cache) => cache.addAll(arquivosAplicacao))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener("activate", (evento) => {
	evento.waitUntil(
		caches
			.keys()
			.then((nomesCaches) =>
				Promise.all(
					nomesCaches
						.filter(
							(nome) => nome.startsWith("diario-de-bordo-") && nome !== nomeCache
						)
						.map((nome) => caches.delete(nome))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (evento) => {
	const requisicao = evento.request;
	const url = new URL(requisicao.url);

	if (requisicao.method !== "GET" || url.origin !== self.location.origin) {
		return;
	}

	evento.respondWith(
		caches.open(nomeCache).then(async (cache) => {
			try {
				const respostaDaRede = await fetch(requisicao, { cache: "no-cache" });

				if (respostaDaRede.ok) {
					await cache.put(requisicao, respostaDaRede.clone()).catch(() => {});
				}

				return respostaDaRede;
			} catch {
				const respostaEmCache = await cache.match(requisicao);

				if (respostaEmCache) {
					return respostaEmCache;
				}

				if (requisicao.mode === "navigate") {
					const paginaInicial = await cache.match("./index.html");

					if (paginaInicial) {
						return paginaInicial;
					}
				}

				return Response.error();
			}
		})
	);
});

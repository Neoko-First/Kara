// configuration des services worker (PWA)
self.addEventListener("fecth", (event) => {
  console.log(`Fetching : ${event.request.url}`);
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        return new Response("Bonjour les gens");
      })()
    );
  }
});

(async function () {
  const cfg = window.CONFIG;
  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const md = s => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>");
  const paras = t => t.split(/\n\s*\n/).map(p => `<p>${md(p.replace(/\n/g, " "))}</p>`).join("");

  $("form-entrada").addEventListener("submit", async e => {
    e.preventDefault();
    const email = $("email").value.trim().toLowerCase();
    $("msg").textContent = "A enviar…";
    const { error } = await sb.auth.signInWithOtp({
      email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname }
    });
    $("msg").textContent = error
      ? "Este e-mail não tem acesso às histórias."
      : "Enviámos um link para " + email + ". Abre-o neste aparelho para entrar.";
  });
  $("sair").addEventListener("click", async () => { await sb.auth.signOut(); location.hash = ""; location.reload(); });

  const { data: { session } } = await sb.auth.getSession();
  if (!session) { $("entrada").hidden = false; return; }

  const { data: caps, error } = await sb.from("capitulos").select("*").order("numero");
  if (error || !caps.length) {
    $("entrada").hidden = false;
    $("msg").textContent = "Esta conta não tem acesso às histórias.";
    await sb.auth.signOut();
    return;
  }
  $("acoes").hidden = false; $("fim").hidden = false;

  // Links temporários (1 dia) para as fotografias privadas
  const nomes = caps.filter(c => c.foto).map(c => c.foto);
  const { data: urls } = await sb.storage.from(cfg.BUCKET).createSignedUrls(nomes, 86400);
  const url = {}; (urls || []).forEach(u => url[u.path] = u.signedUrl);

  const fases = [];
  caps.forEach(c => { let f = fases.find(x => x.nome === c.fase); if (!f) fases.push(f = { nome: c.fase, caps: [] }); f.caps.push(c); });
  $("indice").innerHTML = "<h2>Índice</h2>" + fases.map(f =>
    `<section><h3>${esc(f.nome)}</h3><ol start="${f.caps[0].numero}">` +
    f.caps.map(c => `<li><a href="#${c.slug}">${esc(c.titulo)}</a></li>`).join("") + "</ol></section>").join("");

  let faseAtual = "";
  $("capitulos").innerHTML = caps.map((c, i) => {
    const sep = c.fase !== faseAtual ? `<div class="fase">${esc(faseAtual = c.fase)}</div>` : "";
    const ant = caps[i - 1], seg = caps[i + 1];
    return sep + `<article id="${c.slug}" class="capitulo">
      <p class="numero">Capítulo ${c.numero}</p>
      <h2>${esc(c.titulo)}</h2>
      <figure>${c.foto && url[c.foto]
        ? `<img src="${url[c.foto]}" width="${c.largura || ""}" height="${c.altura || ""}" alt="${esc(c.legenda)}" loading="lazy">`
        : `<div class="sem-foto">Fotografia por adicionar</div>`}
        <figcaption>${md(c.legenda)}</figcaption></figure>
      <div class="texto">${paras(c.texto)}</div>
      <nav class="navcap">${ant ? `<a href="#${ant.slug}">← ${esc(ant.titulo)}</a>` : "<span></span>"}
        <a href="#indice">Índice</a>${seg ? `<a href="#${seg.slug}">${esc(seg.titulo)} →</a>` : "<span></span>"}</nav>
    </article>`;
  }).join("");

  const alvo = location.hash && !location.hash.includes("access_token") && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (alvo) alvo.scrollIntoView({ behavior: "instant" });
})();

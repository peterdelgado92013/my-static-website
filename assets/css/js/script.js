// Footer year (safe)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  // Loading state
  grid.innerHTML = `
    <div class="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300 md:col-span-3">
      Loading projects...
    </div>
  `;

  try {
    const res = await fetch("assets/data/projects.json", { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to load projects.json (HTTP ${res.status})`);
    }

    const projects = await res.json();

    // Render cards
    grid.innerHTML = projects.map(renderProjectCard).join("");
  } catch (err) {
    grid.innerHTML = `
      <div class="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300 md:col-span-3">
        <p class="font-semibold text-white">Could not load projects</p>
        <p class="mt-2 text-sm text-slate-300">
          Make sure <code class="text-emerald-300">assets/data/projects.json</code> exists and is valid JSON.
        </p>
        <p class="mt-2 text-xs text-slate-400">${String(err)}</p>
      </div>
    `;
  }
}

function renderProjectCard(p) {
  const demoLink = (p.links && p.links.demo) ? `<a href="${p.links.demo}" class="text-emerald-300 hover:underline" target="_blank" rel="noreferrer">Demo</a>` : "";
  const githubLink = (p.links && p.links.github) ? `<a href="${p.links.github}" class="text-emerald-300 hover:underline" target="_blank" rel="noreferrer">GitHub</a>` : "";

  const linksRow = (demoLink || githubLink)
    ? `<div class="mt-5 flex gap-3 text-sm">${demoLink}${githubLink}</div>`
    : `<div class="mt-5 text-sm text-slate-400">Links coming soon</div>`;

  const tags = Array.isArray(p.tags) ? p.tags : [];
  const impacts = Array.isArray(p.impact) ? p.impact : [];

  return `
    <article class="group rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-bold">${escapeHtml(p.title || "Project")}</h3>
        <span class="text-xs text-emerald-300">${escapeHtml(p.category || "")}</span>
      </div>

      <p class="mt-2 text-sm text-slate-300">
        ${escapeHtml(p.summary || "")}
      </p>

      <ul class="mt-4 space-y-2 text-sm text-slate-300">
        ${impacts.slice(0, 3).map(i => `<li>• ${escapeHtml(i)}</li>`).join("")}
      </ul>

      <div class="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
        ${tags.map(t => `
          <span class="rounded-lg border border-white/10 bg-white/5 px-2 py-1">${escapeHtml(t)}</span>
        `).join("")}
      </div>

      ${linksRow}
    </article>
  `;
}

// Basic HTML escaping so JSON text can't break your page
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadProjects();


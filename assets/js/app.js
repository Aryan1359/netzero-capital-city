// Router + Loader + Responsive UI + Screenshot Mode
console.log('app.js loaded');
window.addEventListener('error', e => console.error('JS error:', e.message, e.error));

// DOM helpers
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Site definition
const SITE = {
	q1: { label: 'Quest 1', tabs: [
		['overview','Overview'], ['carbon','Carbon'], ['electricity','Electricity'], ['transport','Transport'], ['actions','Actions'], ['notes','Notes']
	]},
		q2: { label: 'Quest 2', tabs: [
			['overview','Overview'], ['feasibility','Feasibility'], ['benefits','Benefits'], ['challenges','Challenges'], ['glossary','Glossary'], ['notes','Notes']
		]},
	q3: { label: 'Quest 3', tabs: [
		['overview','Overview'], ['framework','Framework'], ['roadmap','Roadmap'], ['barriers','Barriers'], ['notes','Notes']
	]}
};

// Build top quest nav (desktop)
function buildTopNav(activeQuest){
	const nav = qs('#topNav');
	if (!nav) return;
	nav.innerHTML = '';
	Object.keys(SITE).forEach(q => {
		const btn = document.createElement('button');
		btn.className = 'btn';
		// Maintain a consistent selected state for accessibility
		btn.setAttribute('aria-current', q===activeQuest ? 'page' : 'false');
		btn.textContent = SITE[q].label;
		btn.addEventListener('click', () => navigate(`${q}/${SITE[q].tabs[0][0]}`));
		nav.appendChild(btn);
	});
}

// Build mobile drawer contents
function buildMobileDrawer(activeQuest){
	const drawer = qs('#mobileDrawer');
	if (!drawer) return;
	drawer.innerHTML = '';
	Object.keys(SITE).forEach(q => {
		const btn = document.createElement('button');
		btn.className = 'btn';
		btn.setAttribute('aria-current', q===activeQuest ? 'page' : 'false');
		btn.textContent = SITE[q].label;
		btn.addEventListener('click', () => {
			navigate(`${q}/${SITE[q].tabs[0][0]}`);
			setMenuOpen(false);
		});
		drawer.appendChild(btn);
	});
}

// Build tab pills
function buildTabNav(quest, activeTab){
	const nav = qs('#tabNav');
	if (!nav || !SITE[quest]) return;
	nav.innerHTML = '';
	SITE[quest].tabs.forEach(([key, title]) => {
		const btn = document.createElement('button');
		btn.className = 'btn';
		btn.setAttribute('role','tab');
		btn.setAttribute('aria-selected', String(key === activeTab));
		btn.textContent = title;
		btn.addEventListener('click', () => navigate(`${quest}/${key}`));
		nav.appendChild(btn);
	});
}

// Loading skeleton
function setLoading(){
	const el = qs('#slide');
	if (el) el.innerHTML = '<div class="pad"><div class="card">Loading…</div></div>';
}

// Load tab content
async function loadTab(quest, tab){
	const path = `quests/${quest}/${tab}.html`;
	const el = qs('#slide');
	if (!el) return;
	console.log('Loading tab:', quest, tab);
	try{
		setLoading();
		const res = await fetch(path, { cache: 'no-store' });
		if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
		const html = await res.text();
		el.innerHTML = `<div class="pad fade">${html}</div>`;
	}catch(e){
		console.error('Failed to load tab:', path, e);
		el.innerHTML = `<div class="pad"><div class="card"><h2>Missing Tab</h2><p>Could not load <code>${path}</code>. Create or fix the file and try again.</p></div></div>`;
	}
	// Footer quest/title
	const fq = qs('#footQuest'); if (fq && SITE[quest]) fq.textContent = SITE[quest].label;
	const ft = qs('#footTitle');
	if (ft && SITE[quest]){
		const mt = SITE[quest].tabs.find(t => t[0]===tab);
		ft.textContent = mt ? `· ${mt[1]}` : '';
		document.title = `Net‑Zero · ${SITE[quest].label} · ${mt?mt[1]:''}`;
	}
}

// Hash parsing with safe defaults
function parseHash(){
	let h = (location.hash || '').replace(/^#/,'');
	if (!h) h = 'q2/overview';
	let [quest, tab] = h.split('/');
	if (!SITE[quest]) quest = 'q2';
	if (!SITE[quest].tabs.some(t=>t[0]===tab)) tab = SITE[quest].tabs[0][0];
	return {quest, tab};
}

function navigate(seg){ location.hash = `#${seg}`; }

// Screenshot Mode scale-to-fit only for capture-frame
function updateScale(){
	if (!document.body.classList.contains('shot')) return; // only scale in Screenshot Mode
	const root = document.documentElement;
	const getVar = name => parseInt(getComputedStyle(root).getPropertyValue(name)) || 0;
	const SLIDE_W = getVar('--slide-w');
	const SLIDE_H = getVar('--slide-h');
	const pad = 24;
	const availW = Math.max(0, window.innerWidth - pad*2);
	const availH = Math.max(0, window.innerHeight - pad*2);
	const scale = Math.max(0.1, Math.min(availW/(SLIDE_W||1), availH/(SLIDE_H||1)));
	const frame = qs('.capture-frame');
	if (frame) frame.style.transform = `scale(${scale})`;
}

// Mobile menu
function setMenuOpen(open){
	const btn = qs('#btnMenu');
	const drawer = qs('#mobileDrawer');
	if (btn) btn.setAttribute('aria-expanded', String(open));
	if (drawer) drawer.setAttribute('aria-hidden', String(!open));
}

// Event wiring
window.addEventListener('resize', updateScale);
window.addEventListener('hashchange', () => {
	const {quest, tab} = parseHash();
	buildTopNav(quest); buildMobileDrawer(quest); buildTabNav(quest, tab); loadTab(quest, tab); updateScale();
});

window.addEventListener('load', () => {
	if (!location.hash) location.hash = '#q2/overview';
	const {quest, tab} = parseHash();
	buildTopNav(quest); buildMobileDrawer(quest); buildTabNav(quest, tab); loadTab(quest, tab); updateScale();
	// Screenshot mode toggle
	const shot = qs('#btnShot');
	if (shot){
		shot.addEventListener('click', ()=>{
			document.body.classList.toggle('shot');
			updateScale();
		});
	}
		// Exit screenshot mode button
		const exitShot = qs('#btnExitShot');
		if (exitShot){
			exitShot.addEventListener('click', () => {
				document.body.classList.remove('shot');
				const frame = qs('.capture-frame');
				if (frame) frame.style.transform = '';
			});
		}
	// Hamburger toggle
	const btnMenu = qs('#btnMenu');
	if (btnMenu){
		btnMenu.addEventListener('click', () => {
			const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
			setMenuOpen(!expanded);
		});
	}

		// Print all tabs in current quest
		const btnPrint = qs('#btnPrint');
		if (btnPrint){
			btnPrint.addEventListener('click', async () => {
				const {quest} = parseHash();
				const tabs = SITE[quest].tabs.map(t => t[0]);
				const el = qs('#slide'); if (!el) return;
				const original = el.innerHTML;
				try{
					// Build printable HTML by concatenating tab contents
					el.innerHTML = '<div class="pad"><div class="card">Preparing print…</div></div>';
					const parts = [];
					for (const tab of tabs){
						const path = `quests/${quest}/${tab}.html`;
						try {
							const res = await fetch(path, { cache: 'no-store' });
							const html = res.ok ? await res.text() : `<p>Missing: ${path}</p>`;
							parts.push(`<section class="card" style="margin:16px 0; padding:16px"><h2>${tab.charAt(0).toUpperCase()+tab.slice(1)}</h2>${html}</section>`);
						} catch(err){ parts.push(`<section class="card"><h2>${tab}</h2><p>Failed to load.</p></section>`); }
					}
					el.innerHTML = `<div class="pad">${parts.join('')}</div>`;
					window.print();
				} finally {
					el.innerHTML = original;
					const {quest, tab} = parseHash();
					loadTab(quest, tab);
				}
			});
		}

			// Export PPTX using PptxGenJS (if available); fallback to HTML export
		const btnExport = qs('#btnExportPpt');
		if (btnExport){
			btnExport.addEventListener('click', async () => {
				const {quest} = parseHash();
				const tabs = SITE[quest].tabs.map(t => t[0]);
					const fetchTabHtml = async (tab) => {
						const path = `quests/${quest}/${tab}.html`;
						try{
							const res = await fetch(path, { cache: 'no-store' });
							return res.ok ? await res.text() : `<p>Missing: ${path}</p>`;
						}catch{ return `<p>Failed to load: ${path}</p>`; }
					};

					// If PptxGenJS is present, build a real PPTX
							if (window.PptxGenJS){
						try{
							const pptx = new window.PptxGenJS();
							pptx.defineLayout({ name:'WIDE', width:13.33, height:7.5 });
							pptx.layout = 'WIDE';
									const brandBlue = '003262';
									const gold = 'FDB515';
									const bodyColor = '1F2937';
									const student = 'Student: Aryan Yaghobi';
									const siteUrl = 'https://aryan1359.github.io/netzero-capital-city/';
							for (const t of tabs){
								const html = await fetchTabHtml(t);
								// Strip HTML tags for a clean text export (simple approach)
								const tmp = document.createElement('div'); tmp.innerHTML = html;
								const textContent = tmp.textContent || tmp.innerText || '';
								const title = t.charAt(0).toUpperCase()+t.slice(1);
								const slide = pptx.addSlide();
										// Accent bar
										slide.addShape(pptx.ShapeType.rect, { x:0, y:0, w:13.33, h:0.6, fill: { color: gold } });
										// Title over brand color
										slide.addText(`${SITE[quest].label} – ${title}`, { x:0.5, y:0.2, w:12.33, h:0.6, fontSize:28, bold:true, color: brandBlue });
										// Body text
										slide.addText(textContent, { x:0.6, y:1.0, w:12.1, h:5.6, fontSize:16, color: bodyColor, valign:'top' });
										// Footer with student name and clickable site URL
										slide.addText(student, { x:0.6, y:7.0-0.6, w:6.0, h:0.4, fontSize:12, color: brandBlue });
										slide.addText([{ text: siteUrl, options: { hyperlink: { url: siteUrl }, color: brandBlue, underline:true } }], { x:6.8, y:7.0-0.6, w:6.5, h:0.4, fontSize:12 });
							}
							await pptx.writeFile({ fileName: `${quest}.pptx` });
							return;
						}catch(err){
							console.error('PPTX export failed, falling back to HTML export.', err);
						}
					}

					// Fallback HTML export
					const sections = [];
					for (const t of tabs){
						const html = await fetchTabHtml(t);
						sections.push(`<section><h1>${t.charAt(0).toUpperCase()+t.slice(1)}</h1>${html}</section>`);
					}
					const doc = `<!doctype html><meta charset="utf-8"><title>${SITE[quest].label} Export</title><style>body{font-family:Segoe UI,Arial;margin:40px} h1{font-size:28px;margin:24px 0 8px} section{page-break-after:always}</style>${sections.join('')}`;
					const blob = new Blob([doc], {type:'text/html'});
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url; a.download = `${quest}-export.html`; a.click();
					setTimeout(()=> URL.revokeObjectURL(url), 2000);
			});
		}
});

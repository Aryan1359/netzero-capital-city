// Router + Loader + Scale‑to‑fit + Nav builders
// Diagnostics very first
console.log('app.js loaded');
window.addEventListener('error', e => console.error('JS error:', e.message, e.error));

// Small DOM helpers
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Site structure used to build navs and compute defaults
const SITE = {
	q1: {
		label: 'Quest 1',
		tabs: [
			['overview','Overview'],
			['carbon','Carbon'],
			['electricity','Electricity'],
			['transport','Transport'],
			['actions','Actions'],
			['notes','Notes']
		]
	},
	q2: {
		label: 'Quest 2',
		tabs: [
			['overview','Overview'],
			['feasibility','Feasibility'],
			['benefits','Benefits'],
			['challenges','Challenges'],
			['notes','Notes']
		]
	},
	q3: {
		label: 'Quest 3',
		tabs: [
			['overview','Overview'],
			['framework','Framework'],
			['roadmap','Roadmap'],
			['barriers','Barriers'],
			['notes','Notes']
		]
	}
};

function buildQuestNav(activeQuest){
	const nav = qs('#questNav');
	if (!nav) return;
	nav.innerHTML = '';
	Object.keys(SITE).forEach(q => {
		const btn = document.createElement('button');
		btn.className = 'btn';
		btn.setAttribute('role','tab');
		btn.setAttribute('aria-selected', String(q === activeQuest));
		btn.textContent = SITE[q].label;
		btn.addEventListener('click', () => navigate(`${q}/${SITE[q].tabs[0][0]}`));
		nav.appendChild(btn);
	});
}

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

async function loadTab(quest, tab){
	const path = `quests/${quest}/${tab}.html`;
	const el = qs('#slide');
	if (!el) return;
	console.log('Loading tab:', quest, tab);
	try{
		const res = await fetch(path, { cache: 'no-store' });
		if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
		const html = await res.text();
		el.innerHTML = `<div class="pad fade">${html}</div>`;
	}catch(e){
		console.error('Failed to load tab:', path, e);
		el.innerHTML = `<div class="pad"><h1>Missing Tab</h1><p>Could not load <code>${path}</code>. Create or fix the file and try again.</p></div>`;
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

function parseHash(){
	let h = (location.hash || '').replace(/^#/,'');
	if (!h) h = 'q2/overview'; // explicit fallback when empty
	let [quest, tab] = h.split('/');
	if (!SITE[quest]) quest = 'q2';
	if (!SITE[quest].tabs.some(t=>t[0]===tab)) tab = SITE[quest].tabs[0][0];
	return {quest, tab};
}

function navigate(seg){ location.hash = `#${seg}`; }

// Scale fixed slide to viewport (guard for missing elements)
function updateScale(){
	const root = document.documentElement;
	const getVar = name => parseInt(getComputedStyle(root).getPropertyValue(name)) || 0;
	const SLIDE_W = getVar('--slide-w');
	const SLIDE_H = getVar('--slide-h');
	const header = document.querySelector('header.top');
	const qnav = document.querySelector('#questNav');
	const tnav = document.querySelector('#tabNav');
	const footer = document.querySelector('footer');
	const headerH = header?.offsetHeight || 0;
	const qnavH = qnav?.offsetHeight || 0;
	const tnavH = tnav?.offsetHeight || 0;
	const footerH = footer?.offsetHeight || 0;
	const pad = 24;
	const availW = Math.max(0, window.innerWidth - pad*2);
	const availH = Math.max(0, window.innerHeight - headerH - qnavH - tnavH - footerH - pad*2);
	const scale = Math.max(0.1, Math.min(availW/(SLIDE_W||1), availH/(SLIDE_H||1)));
	const frame = document.querySelector('.slide-frame');
	if (frame) frame.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', updateScale);
window.addEventListener('hashchange', () => {
	const {quest, tab} = parseHash();
	buildQuestNav(quest); buildTabNav(quest, tab); loadTab(quest, tab); updateScale();
});

window.addEventListener('load', () => {
	// If empty hash on first load, ensure default route
	if (!location.hash) location.hash = '#q2/overview';
	const {quest, tab} = parseHash();
	buildQuestNav(quest); buildTabNav(quest, tab); loadTab(quest, tab); updateScale();
	// Screenshot mode toggle
	const shot = document.getElementById('btnShot');
	if (shot){
		shot.addEventListener('click', ()=>{
			document.body.classList.toggle('shot');
			updateScale();
		});
	}
});

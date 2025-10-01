# Net-Zero Capital City — Quests 1–3 (Training Site)

**Live site:** https://aryan1359.github.io/netzero-capital-city/  
**Status:** Public, read-only (education/training)  
**Student:** Aryan Yaghobi  
**Course:** *Engineering a Net-Zero Carbon Future* (Module 4 context)

> This repository is a **student training project**. It is **not** an official course website, dataset, or policy document. Content is for learning, practice, and presentation only.

---

## 🧭 What is this?
A slide-sized, tabbed website that consolidates **Quest 1, Quest 2, and Quest 3** into one place.  
Each “tab” is sized like a PowerPoint slide (1280×720), so you can take crisp screenshots and drop them into a deck.

- **Pure static site**: HTML + CSS + vanilla JavaScript  
- **Client-side hash routing**: URLs like #q2/overview  
- **Hosted on GitHub Pages** (free)  
- **No backend** (no Flask/Django/Node required)

---

## 🔗 Quick Links
- **Live:** https://aryan1359.github.io/netzero-capital-city/#q2/overview  
- **Repo:** https://github.com/Aryan1359/netzero-capital-city

---

## 🗂 Information Architecture

Top-level navigation: **Quest 1 · Quest 2 · Quest 3** (+ Notes inside each quest)

### Quest 1 — *Creating an Energy Infrastructure Analysis*
Tabs (slide-equivalents):
- **Energy Snapshot** (/quests/q1/overview.html)
- **Carbon Footprint** (/quests/q1/carbon.html)
- **Electricity Impacts** (/quests/q1/electricity.html)
- **Transport & Community** (/quests/q1/transport.html)
- **Top Actions** (/quests/q1/actions.html)
- **Notes** (/quests/q1/notes.html)

### Quest 2 — *Weighing the Clean Energy Powers*
Tabs:
- **Overview** (/quests/q2/overview.html)
- **Technical Feasibility** (/quests/q2/feasibility.html)
- **Potential Benefits** (/quests/q2/benefits.html)
- **Challenges & Mitigations** (/quests/q2/challenges.html)
- **Notes** (/quests/q2/notes.html)

### Quest 3 — *The Roadmap of Hope*
Tabs:
- **Overview** (/quests/q3/overview.html)
- **Technical Requirements Framework** (/quests/q3/framework.html)
- **Barriers & Strategies** (/quests/q3/barriers.html)
- **Roadmap / Justification** (/quests/q3/roadmap.html)
- **Notes** (/quests/q3/notes.html)

> Each tab is its **own HTML file** for easy editing and future expansion. The master page (index.html) loads them dynamically.

---

## 🛠 Tech Stack
- **Frontend:** HTML, CSS, **vanilla JS**
- **Routing:** Hash-based (works well on static hosts)
- **Design:** UC Berkeley–inspired palette (Berkeley Blue & California Gold), slide canvas **1280×720**
- **Animations:** Subtle backdrop blobs & fades
- **Accessibility:** Keyboard left/right to switch tabs; ARIA roles for tabs/panels
- **No build step** required

---

## 📁 Project Structure
site/
index.html # master shell (nav, slide frame, footer)
assets/
css/style.css # theme, layout, slide sizing, animations
js/app.js # router, tab loader (fetch), scale-to-fit, screenshot mode
img/ # (optional images)
quests/
q1/overview.html # + carbon, electricity, transport, actions, notes
q2/overview.html # + feasibility, benefits, challenges, notes
q3/overview.html # + framework, barriers, roadmap, notes


---

## ▶️ Run Locally
From the site folder:
`ash
python -m http.server 5173
# then open:
http://localhost:5173/#q2/overview


Browsers block fetch() on file:// URLs, so a tiny static server is used for local preview.

📸 Screenshot Mode

Click “Screenshot Mode” in the header to hide chrome/animations and capture clean slides.
Use Windows + Shift + S (or your OS snipping tool). Each tab maps to one neat 16:9 slide.

🚀 Deploy (GitHub Pages)

Push to main on GitHub

Repo Settings → Pages

Source: Deploy from a branch

Branch: main

Folder: / (root)

Open: https://<username>.github.io/<repo>/#q2/overview

Add a .nojekyll file at repo root if you run into any asset loading quirks.

✏️ Editing Content

Update the per-tab HTML files under quests/q1, quests/q2, quests/q3

Keep bullet points concise (2–4 bullets per cell/section) for slide readability

Bump the footer version string (in index.html) as you update content (e.g., v0.2.1, v0.3.0)

📄 License / Usage

This repository is for education and training.
No warranties. Do not rely on this content for policy, legal, or investment decisions.
© Aryan Yaghobi — coursework learning artifact.


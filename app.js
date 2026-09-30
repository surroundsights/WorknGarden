(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const products = window.PRODUCTS || [];
  const config = window.SITE_CONFIG || {};
  const compareKey = 'workngarden_compare';
  const priceOrder = {Budget:1, Mittelklasse:2, Premium:3};
  const categoryIcons = {
    'Rasenpflege':'🌿','Mähroboter':'🤖','Hecken & Baumpflege':'🌳','Bewässerung':'💧','Reinigung':'✨','Handwerkzeuge':'🧰'
  };

  function esc(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function affiliateUrl(p) { return p.asin ? createAffiliateLink(p.asin) : createAmazonSearchLink(p.amazonQuery || `${p.brand} ${p.name}`); }
  function affiliateLabel(p) { return p.asin ? 'Bei Amazon ansehen' : 'Bei Amazon suchen'; }
  function getCompare() { try { return JSON.parse(localStorage.getItem(compareKey) || '[]'); } catch { return []; } }
  function setCompare(ids) { localStorage.setItem(compareKey, JSON.stringify(ids.slice(0,4))); updateCompareCount(); }
  function toggleCompare(id) {
    let ids = getCompare();
    if (ids.includes(id)) ids = ids.filter(x => x !== id);
    else if (ids.length < 4) ids.push(id);
    else { toast('Maximal 4 Produkte gleichzeitig vergleichen.'); return; }
    setCompare(ids); syncCompareButtons();
  }
  function updateCompareCount() {
    const n=getCompare().length; $$('.compare-count').forEach(el => el.textContent=n);
  }
  function syncCompareButtons() {
    const ids=getCompare(); $$('[data-compare-id]').forEach(btn => {
      const active=ids.includes(btn.dataset.compareId); btn.classList.toggle('active',active); btn.setAttribute('aria-pressed', String(active)); btn.textContent=active?'✓ Im Vergleich':'＋ Vergleichen';
    });
  }
  function toast(msg) { let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);} t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400); }
  function productVisual(p) {
    return `<div class="product-visual" aria-label="Neutrale Produktdarstellung – kein Herstellerbild"><span class="product-icon">${categoryIcons[p.category] || '🌱'}</span><span>${esc(p.subcategory)}</span></div>`;
  }
  function sourceBadge(p) { return `<span class="verified">Daten geprüft ${esc(p.verifiedOn || '')}</span>`; }
  function card(p, compact=false) {
    const rating = p.rating != null ? `<span>★ ${p.rating}${p.reviewCount ? ` · ${new Intl.NumberFormat('de-DE').format(p.reviewCount)} Bewertungen` : ''}</span>` : `<span class="muted">Bewertung nicht statisch gespeichert</span>`;
    const tags=(p.editorialTags||[]).slice(0,2).map(t=>`<span class="tag">Redaktion: ${esc(t)}</span>`).join('');
    return `<article class="product-card" data-product-id="${esc(p.id)}">
      ${productVisual(p)}
      <div class="product-card-body">
        <div class="eyebrow">${esc(p.brand)} · ${esc(p.subcategory)}</div>
        <h3><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
        <p>${esc(p.description)}</p>
        <div class="tags">${tags}${p.new?'<span class="tag tag-new">Neu im Sortiment</span>':''}</div>
        <ul class="feature-list">${(p.features||[]).slice(0, compact?2:3).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
        <div class="meta-row"><span class="price-level">${esc(p.priceCategory)}-Segment</span>${sourceBadge(p)}</div>
        <div class="rating-row">${rating}</div>
        <div class="card-actions">
          <a class="btn btn-primary" href="${affiliateUrl(p)}" target="_blank" rel="sponsored nofollow noopener">${affiliateLabel(p)} ↗</a>
          <button class="btn btn-secondary" type="button" data-compare-id="${esc(p.id)}">＋ Vergleichen</button>
        </div>
      </div>
    </article>`;
  }
  function renderCards(list, target, limit=null) {
    const el=$(target); if(!el) return; const arr=limit?list.slice(0,limit):list;
    el.innerHTML = arr.length ? arr.map(p=>card(p)).join('') : `<div class="empty-state">Keine passenden Produkte gefunden.</div>`;
    wireCompare();
  }
  function wireCompare(){ $$('[data-compare-id]').forEach(btn=>btn.onclick=()=>toggleCompare(btn.dataset.compareId)); syncCompareButtons(); }
  function unique(key){ return [...new Set(products.map(p=>p[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'de')); }
  function home(){
    if(!$('#home-page')) return;
    renderCards(products.filter(p=>p.featured).sort((a,b)=>b.editorialValue-a.editorialValue),'#featured-products',8);
    renderCards(products.filter(p=>p.new),'#new-products',6);
    renderCards(products.filter(p=>p.editorialTags?.includes('Preis-Leistung')).sort((a,b)=>b.editorialValue-a.editorialValue),'#value-products',6);
    const q=$('#hero-search'); const btn=$('#hero-search-btn'); if(q&&btn){btn.onclick=()=>{location.href=`products.html?q=${encodeURIComponent(q.value.trim())}`};q.addEventListener('keydown',e=>{if(e.key==='Enter')btn.click();});}
    const best=$('#bestseller-link'); if(best) best.href=createAmazonSearchLink('Garten Bestseller');
  }
  function productsPage(){
    const grid=$('#products-grid'); if(!grid) return;
    const cat=$('#filter-category'), brand=$('#filter-brand'), level=$('#filter-level'), sort=$('#sort-products'), search=$('#product-search');
    if(cat) unique('category').forEach(v=>cat.insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`));
    if(brand) unique('brand').forEach(v=>brand.insertAdjacentHTML('beforeend',`<option>${esc(v)}</option>`));
    const params=new URLSearchParams(location.search); if(search&&params.get('q')) search.value=params.get('q');
    const fixed=window.WORKNGARDEN_CATEGORY || null; if(fixed && cat){ cat.value=fixed; cat.disabled=true; }
    function apply(){
      const q=(search?.value||'').toLowerCase().trim();
      let list=products.filter(p=>{
        const hay=`${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.description} ${(p.features||[]).join(' ')}`.toLowerCase();
        return (!q||hay.includes(q)) && (!cat?.value||p.category===cat.value) && (!brand?.value||p.brand===brand.value) && (!level?.value||p.priceCategory===level.value);
      });
      switch(sort?.value){
        case 'rating': list.sort((a,b)=>(b.rating??-1)-(a.rating??-1));break;
        case 'price': list.sort((a,b)=>(priceOrder[a.priceCategory]||9)-(priceOrder[b.priceCategory]||9));break;
        case 'value': list.sort((a,b)=>b.editorialValue-a.editorialValue);break;
        case 'new': list.sort((a,b)=>(b.new?1:0)-(a.new?1:0));break;
        case 'bestseller': list.sort((a,b)=>(b.bestseller===true?1:0)-(a.bestseller===true?1:0));break;
        default: list.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)||b.editorialValue-a.editorialValue);
      }
      grid.innerHTML=list.map(p=>card(p)).join('') || `<div class="empty-state">Keine passenden Produkte gefunden.</div>`;
      $('#result-count') && ($('#result-count').textContent=`${list.length} Produkte`);
      wireCompare();
    }
    [cat,brand,level,sort,search].filter(Boolean).forEach(el=>el.addEventListener(el===search?'input':'change',apply));
    apply();
  }
  function comparePage(){
    const table=$('#compare-table'); if(!table) return;
    const ids=getCompare(); const list=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean);
    if(!list.length){ table.innerHTML='<div class="empty-state">Noch keine Produkte gewählt. <a href="products.html">Produkte auswählen</a>.</div>'; return; }
    const rows=[
      ['Marke',p=>p.brand],['Kategorie',p=>p.subcategory],['Preisniveau',p=>p.priceCategory],['Bewertung',p=>p.rating!=null?`${p.rating}${p.reviewCount?` (${p.reviewCount})`:''}`:'nicht gespeichert'],['Zielgruppe',p=>p.target],['Redaktion',p=>(p.editorialTags||[]).join(', ')],['Technische Daten',p=>Object.entries(p.specs||{}).map(([k,v])=>`${k}: ${v}`).join(' · ')],['Vorteile',p=>(p.pros||[]).join(' · ')],['Mögliche Nachteile',p=>(p.cons||[]).join(' · ')]
    ];
    table.innerHTML=`<div class="compare-scroll"><table><thead><tr><th>Merkmal</th>${list.map(p=>`<th>${esc(p.brand)}<br><strong>${esc(p.name)}</strong><br><button class="text-btn" data-remove-compare="${esc(p.id)}">Entfernen</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th>${label}</th>${list.map(p=>`<td>${esc(fn(p))}</td>`).join('')}</tr>`).join('')}<tr><th>Amazon</th>${list.map(p=>`<td><a class="btn btn-primary btn-small" href="${affiliateUrl(p)}" target="_blank" rel="sponsored nofollow noopener">${affiliateLabel(p)} ↗</a></td>`).join('')}</tr></tbody></table></div>`;
    $$('[data-remove-compare]').forEach(b=>b.onclick=()=>{setCompare(getCompare().filter(x=>x!==b.dataset.removeCompare));comparePage();});
  }
  function productDetail(){
    const el=$('#product-detail'); if(!el) return;
    const id=new URLSearchParams(location.search).get('id'); const p=products.find(x=>x.id===id) || products[0];
    document.title=`${p.name} – ${p.brand} | WorknGarden`;
    el.innerHTML=`<div class="detail-grid"><div>${productVisual(p)}</div><div><div class="eyebrow">${esc(p.brand)} · ${esc(p.category)} / ${esc(p.subcategory)}</div><h1>${esc(p.name)}</h1><p class="lead">${esc(p.description)}</p><div class="tags">${(p.editorialTags||[]).map(t=>`<span class="tag">Redaktion: ${esc(t)}</span>`).join('')}</div><div class="callout"><strong>Datentransparenz:</strong> Sterne, Bewertungsanzahl, Preis und Bestsellerstatus werden nicht erfunden. Nicht verifizierte Live-Daten bleiben leer.</div><div class="card-actions"><a class="btn btn-primary" href="${affiliateUrl(p)}" target="_blank" rel="sponsored nofollow noopener">${affiliateLabel(p)} ↗</a><button class="btn btn-secondary" data-compare-id="${esc(p.id)}">＋ Vergleichen</button></div></div></div>
      <section class="detail-section"><h2>Wichtige Eigenschaften</h2><div class="spec-grid">${Object.entries(p.specs||{}).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div></section>
      <section class="two-col"><div><h2>Vorteile</h2><ul>${(p.pros||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h2>Mögliche Nachteile</h2><ul>${(p.cons||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></section>
      <section class="detail-section"><h2>Für wen geeignet?</h2><p>${esc(p.target)}</p><h3>Varianten</h3><p>${esc((p.variants||[]).join(' · '))}</p></section>
      <section class="detail-section"><h2>Datenquelle</h2><p>Produktmerkmale wurden am ${esc(p.verifiedOn)} anhand der angegebenen Quelle geprüft. <a href="${esc(p.sourceUrl)}" target="_blank" rel="nofollow noopener">${esc(p.sourceLabel)} ↗</a></p><p class="muted">Redaktionelle Einordnungen sind keine unabhängigen Labortests.</p></section>`;
    wireCompare();
    const alt=products.filter(x=>x.id!==p.id && x.category===p.category).sort((a,b)=>b.editorialValue-a.editorialValue).slice(0,3); renderCards(alt,'#similar-products');
  }
  function injectDisclosure(){ $$('.affiliate-disclosure').forEach(el=>el.textContent=config.disclosure||'Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.'); }
  function nav(){
    updateCompareCount(); injectDisclosure();
    const toggle=$('#nav-toggle'), menu=$('#main-nav'); if(toggle&&menu) toggle.onclick=()=>menu.classList.toggle('open');
    $$('.year').forEach(el=>el.textContent=new Date().getFullYear());
  }
  nav(); home(); productsPage(); comparePage(); productDetail();
})();

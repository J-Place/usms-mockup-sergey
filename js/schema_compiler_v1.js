(function () {
  function extractData() {
    // --- Customize these selectors to match your page structure ---
    const get = (sel) => document.querySelector(sel);
    const getText = (sel) => get(sel)?.innerText?.trim() || null;
    const getAttr = (sel, attr) => get(sel)?.getAttribute(attr) || null;

    return {
      title:       getText('.page-header h1'),
      description: getText('h2.page-title') 
                     ? getAttr('meta[name="description"]', 'content') 
                     : getText('p'),
      image:       getAttr('meta[property="og:image"]', 'content')
                     || getAttr('article img', 'src'),
      datePublished: getAttr('.author__date"]', '.author__date strong')
                       || getAttr('time', 'datetime'),
      dateModified:  getAttr('time[itemprop="dateModified"]', 'datetime'),
      authorName:  getText('.author__name strong') || getText('.author__name'),
      url:         window.location.href,



      title:       getText('.page-header h1'),
      description: getText('meta[name="description"]') 
                     ? getAttr('meta[name="description"]', 'content') 
                     : getText('h2.page-title html-container p'),
      image:       getAttr('meta[property="og:image"]', 'content')
                     || getAttr('article img', 'src'),
      datePublished: getAttr('time[itemprop="datePublished"]', 'datetime')
                       || getAttr('time', 'datetime'),
      dateModified:  getAttr('time[itemprop="dateModified"]', 'datetime'),
      authorName:  getText('[rel="author"]') || getText('.author'),
      url:         window.location.href,

    };
  }

  function buildSchema(data) {
    // Choose your schema type — Article shown here
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "url": data.url,
    };

    if (data.image)         schema.image = data.image;
    if (data.datePublished) schema.datePublished = data.datePublished;
    if (data.dateModified)  schema.dateModified = data.dateModified;
    if (data.authorName) {
      schema.author = { "@type": "Person", "name": data.authorName };
    }

    // Strip out null/undefined values
    return JSON.parse(JSON.stringify(schema));
  }

  function injectSchema(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    const data = extractData();
    if (!data.title) return; // Don't inject empty schema
    const schema = buildSchema(data);
    injectSchema(schema);
    console.log('[Schema Injected]', schema); // Remove in production
  }
})();
#!/usr/bin/env node

// Sync PostStream posts tagged with 'blogmms' to blog
// Run this manually or via cron

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const POSTSTREAM_API_KEY = process.env.POSTSTREAM_API_KEY || 'pb_844b55fe439174a6d8d04ec29a2fcf73b669854d';
const BLOG_TAG = 'blogmms';
const STATE_FILE = path.join(__dirname, '..', '.blog-sync-state.json');

// Load state (track which posts we've already published)
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading state:', e.message);
  }
  return { publishedPosts: [] };
}

// Save state
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Fetch posts from PostStream
async function fetchPostStreamPosts() {
  const response = await fetch('https://api.poststream.io/api/v1/posts?limit=20', {
    headers: {
      'x-api-key': POSTSTREAM_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`PostStream API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.success || !data.data) {
    throw new Error('Invalid PostStream response');
  }

  return data.data;
}

// Convert PostStream post to blog HTML
function createBlogPost(post) {
  const title = post.title || post.caption || 'Untitled Post';
  const content = post.caption || post.title || '';
  const date = new Date(post.publishedAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Determine category from tags or default
  let category = 'General';
  if (post.tags) {
    const categoryTags = ['Buying Tips', 'Privacy', 'Storage', 'Selling', 'Market Updates'];
    const foundCategory = categoryTags.find(cat => 
      post.tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase().replace(' ', '')))
    );
    if (foundCategory) category = foundCategory;
  }

  // Create URL-safe slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Generate blog post HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Metals Made Simple</title>
<meta name="description" content="${content.substring(0, 160)}">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap');

  :root {
    --gold: #C9A84C;
    --gold-light: #E8C96A;
    --gold-dark: #8B6914;
    --black: #080706;
    --charcoal: #111009;
    --white: #F5F0E8;
    --muted: rgba(245,240,232,0.7);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Montserrat', sans-serif;
    line-height: 1.7;
  }

  .header-nav {
    background: rgba(0,0,0,0.95);
    border-bottom: 1px solid rgba(201,168,76,0.2);
    padding: 20px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .site-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 4px;
    color: var(--gold);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 32px;
    list-style: none;
  }

  .nav-links a {
    color: var(--white);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .nav-links a:hover {
    color: var(--gold);
  }

  .article-container {
    max-width: 800px;
    margin: 60px auto;
    padding: 0 32px;
  }

  .article-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 13px;
    color: var(--gold);
    font-weight: 600;
  }

  .article-date {
    opacity: 0.7;
  }

  .article-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 700;
    color: var(--white);
    line-height: 1.1;
    margin-bottom: 32px;
  }

  .article-content {
    font-size: 17px;
    color: var(--white);
    line-height: 1.8;
  }

  .article-content p {
    margin-bottom: 24px;
  }

  .article-content strong {
    color: var(--gold-light);
    font-weight: 700;
  }

  .back-link {
    display: inline-block;
    color: var(--gold);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    margin-bottom: 32px;
  }

  .back-link:hover {
    color: var(--gold-light);
  }

  .footer {
    background: var(--charcoal);
    padding: 40px 32px;
    text-align: center;
    border-top: 1px solid rgba(201,168,76,0.1);
    margin-top: 80px;
  }

  .footer-brand {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 4px;
    color: rgba(201,168,76,0.4);
    margin-bottom: 6px;
  }

  .footer-copy {
    font-size: 10px;
    color: rgba(245,240,232,0.2);
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    .article-title { font-size: 36px; }
    .article-content { font-size: 16px; }
    .nav-links { gap: 20px; font-size: 13px; }
  }
</style>
</head>
<body>

<nav class="header-nav">
  <div class="nav-container">
    <a href="../index.html" class="site-logo">✦ METALS MADE SIMPLE ✦</a>
    <ul class="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="../free-guide.html">Free Guides</a></li>
      <li><a href="../blog.html">Blog</a></li>
      <li><a href="../contact.html">Contact</a></li>
    </ul>
  </div>
</nav>

<article class="article-container">
  
  <a href="../blog.html" class="back-link">← Back to Blog</a>

  <div class="article-meta">
    <span class="article-category">${category}</span>
    <span class="article-date">${date}</span>
  </div>

  <h1 class="article-title">${title}</h1>

  <div class="article-content">
    ${content.split('\n\n').map(p => `<p>${p}</p>`).join('\n    ')}
  </div>

</article>

<div class="footer">
  <div class="footer-brand">MetalsMadeSimple.com &nbsp;·&nbsp; Metals Made Simple Series</div>
  <div class="footer-copy">© Doyle Shuler. All rights reserved.</div>
</div>

</body>
</html>`;

  return { html, slug, title, category, date, content };
}

// Update blog.html with new post
function updateBlogIndex(post) {
  const blogIndexPath = path.join(__dirname, '..', 'blog.html');
  let blogHtml = fs.readFileSync(blogIndexPath, 'utf8');

  const excerpt = post.content.substring(0, 150) + '...';

  const newPostCard = `
    <!-- Auto-generated from PostStream -->
    <article class="post-card">
      <div class="post-content">
        <div class="post-meta">
          <span class="post-category">${post.category}</span>
          <span class="post-date">${post.date}</span>
        </div>
        <h2><a href="blog/${post.slug}.html">${post.title}</a></h2>
        <p class="post-excerpt">
          ${excerpt}
        </p>
        <a href="blog/${post.slug}.html" class="read-more">READ MORE →</a>
      </div>
    </article>
`;

  // Insert after <div class="posts-grid">
  blogHtml = blogHtml.replace(
    /<div class="posts-grid">/,
    `<div class="posts-grid">\n${newPostCard}`
  );

  fs.writeFileSync(blogIndexPath, blogHtml);
}

// Main sync function
async function syncBlog() {
  console.log('🔄 Checking PostStream for new blog posts...');

  const state = loadState();
  const posts = await fetchPostStreamPosts();

  // Filter for blog posts we haven't published yet
  const newBlogPosts = posts.filter(post => 
    post.status === 'published' &&
    post.tags && 
    post.tags.includes(BLOG_TAG) &&
    !state.publishedPosts.includes(post.id)
  );

  if (newBlogPosts.length === 0) {
    console.log('✅ No new blog posts to publish');
    return;
  }

  console.log(`📝 Found ${newBlogPosts.length} new blog post(s)`);

  for (const post of newBlogPosts) {
    console.log(`\n📄 Publishing: "${post.title}"`);
    
    const blogPost = createBlogPost(post);
    
    // Write blog post HTML file
    const blogFilePath = path.join(__dirname, '..', 'blog', `${blogPost.slug}.html`);
    fs.writeFileSync(blogFilePath, blogPost.html);
    console.log(`✅ Created: blog/${blogPost.slug}.html`);
    
    // Update blog index
    updateBlogIndex(blogPost);
    console.log(`✅ Updated: blog.html`);
    
    // Mark as published
    state.publishedPosts.push(post.id);
  }

  // Save state
  saveState(state);

  // Git commit and push
  console.log('\n🚀 Deploying to Vercel...');
  try {
    execSync('git add .', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync(`git commit -m "Auto-publish blog posts from PostStream"`, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync('git push', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('✅ Deployed successfully!');
  } catch (e) {
    console.error('❌ Git deployment failed:', e.message);
  }
}

// Run
syncBlog().catch(console.error);

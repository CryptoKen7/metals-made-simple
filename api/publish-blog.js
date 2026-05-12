// Auto-publish blog posts from PostStream
// Triggered manually or via cron job

const POSTSTREAM_API_KEY = process.env.POSTSTREAM_API_KEY || 'pb_844b55fe439174a6d8d04ec29a2fcf73b669854d';
const BLOG_TAG = 'blogmms';

export default async function handler(req, res) {
  
  // Only allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch recent posts from PostStream
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

    // Filter for published posts with the blog tag
    const blogPosts = data.data.filter(post => 
      post.status === 'published' && 
      post.tags && 
      post.tags.includes(BLOG_TAG)
    );

    if (blogPosts.length === 0) {
      return res.status(200).json({ 
        message: 'No new blog posts found',
        tag: BLOG_TAG,
        checked: data.data.length
      });
    }

    // Get the most recent blog post
    const latestPost = blogPosts[0];

    // Check if already published to blog (we'll track this)
    // For now, just return the post data for manual processing
    
    return res.status(200).json({
      message: 'Blog post ready to publish',
      post: {
        id: latestPost.id,
        title: latestPost.title,
        caption: latestPost.caption || latestPost.title,
        publishedAt: latestPost.publishedAt,
        tags: latestPost.tags,
        mediaUrls: latestPost.mediaUrls
      },
      note: 'Manual conversion needed - automated publishing coming soon'
    });

  } catch (error) {
    console.error('Error fetching PostStream posts:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch posts',
      details: error.message 
    });
  }
}

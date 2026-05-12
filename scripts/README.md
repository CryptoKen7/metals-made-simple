# PostStream → Blog Auto-Publishing

Automatically publish blog posts from PostStream to MetalsMadeSimple.com.

## How It Works

1. **Write in PostStream** - Create your post with social media content
2. **Tag with `blogmms`** - This tells the system to publish it to the blog
3. **Publish to social media** - Post goes to Instagram, Twitter, etc.
4. **Auto-publish to blog** - Script detects the tag and creates blog post
5. **Auto-deploy** - Changes commit and push to GitHub → Vercel deploys

## Manual Trigger

Run this command anytime to check for new blog posts:

```bash
cd /root/.openclaw/workspace/metals-made-simple-site
./scripts/check-blog.sh
```

Or tell ClawMax: "Check PostStream for new blog posts"

## Automated Schedule

To run automatically every hour, add to cron:

```bash
0 * * * * cd /root/.openclaw/workspace/metals-made-simple-site && ./scripts/check-blog.sh >> /var/log/blog-sync.log 2>&1
```

## What Gets Published

- **Title**: From PostStream post title
- **Content**: From PostStream caption/content
- **Date**: From PostStream publish date
- **Category**: Auto-detected from tags or defaults to "General"
- **Media**: (Future enhancement - will pull images from PostStream)

## State Tracking

The system tracks which posts have been published in:
```
.blog-sync-state.json
```

This prevents duplicate publishing.

## Configuration

API key is stored in the script. To change:

Edit `scripts/sync-poststream-blog.js` and update:
```javascript
const POSTSTREAM_API_KEY = 'your-new-key-here';
```

Or set environment variable:
```bash
export POSTSTREAM_API_KEY="your-key-here"
```

## Troubleshooting

### "No new blog posts found"
- Make sure your PostStream post has the tag: `blogmms`
- Make sure post status is "published" (not draft)

### "PostStream API error"
- Check API key is correct
- Check internet connection
- Verify PostStream is accessible

### Git push failed
- Check GitHub credentials are configured
- Manually commit and push if needed

## Future Enhancements

- [ ] Pull images from PostStream mediaUrls
- [ ] Better content formatting (headings, lists, etc.)
- [ ] Email notification on successful publish
- [ ] Webhook receiver for instant publishing

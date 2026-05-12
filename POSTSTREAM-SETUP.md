# PostStream Setup Guide

## ✅ What's Already Done

- ✅ API key configured: `pb_844b55fe439174a6d8d04ec29a2fcf73b669854d`
- ✅ Blog tag defined: `blogmms`
- ✅ Auto-publishing script created
- ✅ Git deployment configured

## 🔧 What You Need To Do

### Step 1: Create Workspace in PostStream

1. Go to: **https://app.poststream.io**
2. Log in to your account
3. **Create a workspace** (if you haven't already)
4. **Connect your social media accounts** (Instagram, Twitter, etc.)

### Step 2: Test with Your First Blog Post

1. **Create a post in PostStream**
2. **Add the tag: `blogmms`** (this triggers blog publishing)
3. **Publish to your social media accounts**

### Step 3: Auto-Publish to Blog

Two options:

#### Option A: Tell ClawMax (Easiest)
Just message me: "Check PostStream for new blog posts"

#### Option B: Run Manually
```bash
cd /root/.openclaw/workspace/metals-made-simple-site
./scripts/check-blog.sh
```

## 🎯 How To Use Going Forward

### Every Time You Want to Post:

1. **Write once in PostStream**
2. **Add tag: `blogmms`**
3. **Publish**
4. **Done** - It auto-publishes to social media AND your blog

That's it. No extra steps.

## 🤖 Full Automation (Optional)

Want it to check automatically every hour?

Tell ClawMax: "Set up hourly blog sync from PostStream"

Or manually add to cron:
```bash
0 * * * * cd /root/.openclaw/workspace/metals-made-simple-site && ./scripts/check-blog.sh
```

## 📋 Current Status

**API Key:** ✅ Configured  
**Workspace:** ⚠️ Needs creation (one-time setup)  
**Social Accounts:** ⚠️ Need connection (one-time setup)  
**Automation:** ✅ Ready to use

## 🆘 Need Help?

Just ask ClawMax:
- "Check if PostStream is working"
- "Publish my latest PostStream post to the blog"
- "Show me my recent PostStream posts"

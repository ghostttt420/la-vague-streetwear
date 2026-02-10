# LA VAGUE - Deployment Guide

Complete guide for deploying LA VAGUE to production using **Netlify (Frontend)** + **Render (Backend)**.

## 📋 Prerequisites

- GitHub account
- Netlify account (free)
- Render account (free)
- Paystack account (for payments)
- Gmail account (for email notifications)

---

## 🚀 Step 1: Prepare Your Code

### 1. Push to GitHub

```bash
# Your code should already be on GitHub
# If not:
git add -A
git commit -m "Production ready"
git push origin main
```

### 2. Update Configuration Files

#### `netlify.toml` (Frontend)
```toml
# Line 24: Update with your Render URL
[[redirects]]
  from = "/api/*"
  to = "https://la-vague-api.onrender.com/api/:splat"
```

#### `checkout-api.js` (API Client)
```javascript
// Line 12: Update with your Render URL
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://la-vague-api.onrender.com/api';
```

---

## 🎨 Step 2: Deploy Frontend to Netlify

### Option A: GitHub Integration (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)

2. **Add New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `la-vague-streetwear` repository

3. **Configure Build Settings**
   ```
   Build command: (leave empty)
   Publish directory: .
   ```

4. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     API_URL = https://la-vague-api.onrender.com
     ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will give you a URL like `https://la-vague-123.netlify.app`

6. **Custom Domain (Optional)**
   - Site Settings → Domain Management
   - Add your custom domain
   - Follow DNS configuration instructions

### Option B: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

---

## ⚙️ Step 3: Deploy Backend to Render

### 1. Create Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)

2. **New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `la-vague` repository

3. **Configure Service**
   ```
   Name: la-vague-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Environment Variables**
   
   Go to "Environment" tab and add:

   ```env
   # Server
   NODE_ENV=production
   FRONTEND_URL=https://la-vague-123.netlify.app
   
   # Paystack (Get from dashboard.paystack.com)
   PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
   PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
   
   # Email (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   
   # Admin
   ADMIN_API_KEY=your-secure-random-key-here
   ```

### 2. Create Database Disk

1. In your service, go to "Disks" tab
2. Click "Add Disk"
   ```
   Name: database
   Mount Path: /data
   Size: 1 GB
   ```
3. Update `server.js` to use `/data/database.sqlite` in production

### 3. Deploy

Click "Create Web Service"

Render will:
- Install dependencies
- Start your server
- Give you a URL like `https://la-vague-api.onrender.com`

---

## 💳 Step 4: Configure Paystack

### 1. Create Paystack Account

1. Go to [paystack.com](https://paystack.com)
2. Sign up and complete business verification
3. Get your API keys from Settings → API Keys

### 2. Update Environment Variables

In Render dashboard, update:
```env
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
```

### 3. Webhook Setup (Optional but Recommended)

1. In Paystack Dashboard → Settings → Webhooks
2. Add webhook URL:
   ```
   https://la-vague-api.onrender.com/api/payment/webhook
   ```
3. Select events: `charge.success`, `charge.failed`

---

## 📧 Step 5: Configure Email

### Gmail Setup

1. **Enable 2-Factor Authentication**
   - Google Account → Security → 2-Step Verification

2. **Generate App Password**
   - Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password

3. **Update Render Environment**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # App password, not your Gmail password
   ```

### Alternative: SendGrid

1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Update environment:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

---

## 🔐 Step 6: Security Checklist

### Update Admin Password

In `admin.js`, line 10:
```javascript
const ADMIN_PASSWORD = 'your-secure-password-here';
```

### Update Admin API Key

In Render dashboard, set a secure random string:
```env
ADMIN_API_KEY=sk_live_256_random_characters_here
```

### Enable HTTPS

- Netlify: Automatic HTTPS ✓
- Render: Automatic HTTPS ✓

---

## ✅ Step 7: Testing

### Test Frontend
```
https://la-vague-123.netlify.app
```

### Test Backend
```bash
curl https://la-vague-api.onrender.com/api/health
```

### Test Payment (Paystack Test Mode)
1. Use test card: `4084 0840 8408 4081`
2. Any future expiry date
3. CVV: `000`
4. PIN: `1234`

### Test Admin Panel
1. Visit: `https://la-vague-123.netlify.app/admin.html`
2. Login with your admin password
3. Check orders are displaying

---

## 🔄 Step 8: Continuous Deployment

### GitHub → Netlify
- Already configured ✓
- Push to main branch → Auto deploy

### GitHub → Render
- Already configured ✓
- Push to main branch → Auto deploy

---

## 📊 Monitoring

### Render Dashboard
- Logs: Real-time application logs
- Metrics: CPU, memory usage
- Database: Check disk usage

### Netlify Dashboard
- Analytics: Visitor statistics
- Forms: Form submissions
- Edge: CDN performance

---

## 🆘 Troubleshooting

### CORS Errors
```
Access-Control-Allow-Origin error
```
**Fix**: Update `FRONTEND_URL` in Render to match your Netlify URL exactly

### Database Disappears
**Issue**: Render free tier resets disk on redeploy
**Solutions**:
1. Upgrade to paid plan ($7/month)
2. Use external database (Supabase/PlanetScale)
3. Accept data loss on deploy (demo only)

### Emails Not Sending
**Check**:
1. SMTP credentials correct?
2. Gmail "Less secure apps" enabled?
3. Using App Password (not regular password)?

### Payment Fails
**Check**:
1. Using live keys (not test keys)?
2. Paystack account verified?
3. Callback URL correct?

---

## 💰 Costs Summary

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Netlify | Free forever | Pro $19/mo |
| Render | Free (sleeps) | Starter $7/mo |
| Paystack | 1.5% + ₦100 per transaction | Same |
| Gmail | Free | Workspace $6/mo |

**Recommended for Production:**
- Render Starter: $7/month (always on)
- Total: ~$7/month

---

## 🚀 Going Live Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Render
- [ ] Paystack live keys configured
- [ ] Email service configured
- [ ] Admin password changed
- [ ] Admin API key set
- [ ] CORS URLs updated
- [ ] Test order placed successfully
- [ ] Email confirmation received
- [ ] Admin panel accessible
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] 404 page working

---

## 📞 Support

**Render**: https://render.com/docs
**Netlify**: https://docs.netlify.com
**Paystack**: https://paystack.com/docs

---

**Ready to ride the wave! 🌊**

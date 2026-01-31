# Reawakening - Christian Student Ministry Website

A Next.js-based website for **Reawakening**, a Christian student ministry focused on spiritual renewal and growth during post-exam periods.

## 🙏 About Reawakening

Reawakening is a Christian ministry program organized and overseen by an individual, designed to help students maintain spiritual discipline and clarity during holiday periods. The ministry centers around post-exam conferences and provides ongoing spiritual support through this digital platform.

## ✨ Features

### Core Pages
- **Home** - Introduction to the ministry with clear CTAs
- **About** - Vision, mission, and leadership information
- **Conference** - Upcoming conference details and registration
- **Daily Bible Verse** - Daily Scripture with streak tracking
- **Resources** - Curated Christian materials, courses, and books
- **Archive** - Past conference materials and teachings
- **Contact** - Multiple ways to stay connected

### Key Functionality
- ✅ Daily Bible verse with grace-centered streak tracking (localStorage)
- ✅ Conference registration forms
- ✅ Curated resource library (materials, courses, books)
- ✅ Past conference archive
- ✅ Contact forms and newsletter signup
- ✅ Basic admin dashboard (password: `reawakening2026`)
- ✅ Mobile-first, responsive design
- ✅ SEO optimized with proper metadata

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
REAWKENING/
├── app/
│   ├── about/              # About page
│   ├── admin/              # Admin dashboard
│   ├── archive/            # Conference archive
│   ├── conference/         # Conference page
│   ├── contact/            # Contact page
│   ├── daily-verse/        # Daily verse with streak tracking
│   ├── resources/          # Resources hub
│   │   ├── materials/      # Devotionals, guides
│   │   ├── courses/        # Lesson-based teachings
│   │   └── books/          # Reading lists
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Site footer
│   └── DailyVerseClient.tsx # Daily verse client component
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Design Philosophy

- **Grace-Centered**: Encourages growth without guilt or performance pressure
- **Ministry-Focused**: Clearly a ministry tool, not a commercial product
- **Student-Friendly**: Mobile-first, low-bandwidth, accessible design
- **Spiritually Responsible**: All content is curated and biblically sound
- **Church-Complementary**: Supports, never replaces, local church involvement

## 🔧 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Inter (sans-serif), Merriweather (serif)
- **Deployment**: Vercel/Netlify ready

## 📝 Content Management

### Current Setup (MVP)
- Static content in page components
- localStorage for streak tracking
- No database required

### Production Recommendations
1. **CMS Integration**: Use Sanity, Contentful, or Strapi
2. **Database**: PostgreSQL or MongoDB for user data
3. **Authentication**: NextAuth.js for admin access
4. **File Storage**: AWS S3 or Cloudinary for resources
5. **Email**: SendGrid or Mailchimp for newsletters
6. **Forms**: Formspree, Basin, or custom API routes

## 🔐 Admin Access

- Navigate to `/admin`
- Default password: `reawakening2026`
- **⚠️ Change this in production!**

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`

## 📱 Features to Add (Future)

- [ ] User accounts with authentication
- [ ] Database integration for dynamic content
- [ ] Email notifications for conferences
- [ ] Course progress tracking with accounts
- [ ] Community prayer wall
- [ ] Testimony submission system
- [ ] Advanced admin CMS
- [ ] Multi-language support
- [ ] PWA capabilities for offline access

## 🙌 Spiritual & Ethical Guidelines

This platform adheres to these principles:

1. **Biblical Foundation** - All content is rooted in Scripture
2. **Grace-Centered** - No guilt-driven or performance-based messaging
3. **Church-Complementary** - Supports, never replaces, local church
4. **Copyright Respect** - No pirated or unauthorized content
5. **Student-Focused** - Relevant and accessible for student life

## 📖 Scripture Foundation

> "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope." - Jeremiah 29:11

## 📄 License

This project is created for ministry purposes. Feel free to adapt it for your own Christian ministry with proper attribution.

## 🤝 Contributing

This is a ministry project. If you'd like to contribute:
1. Ensure all content aligns with biblical Christianity
2. Maintain the grace-centered, non-commercial tone
3. Test thoroughly before submitting
4. Respect copyright and attribution

## 💬 Support

For questions or support:
- Email: contact@reawakening.org
- Visit: [/contact](/contact)

---

**Built with ❤️ for the glory of God and the spiritual growth of students.**

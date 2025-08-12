# 📚 LLM Course Platform

LLM Course Platform is a web application for creating, managing, and selling digital courses, with separate **Admin** and **User** modules.

## 🌐 Live Preview

🔗 https://your-demo-link.vercel.app

---

## 🚀 Key Features

### For Users (Students):

- 📜 Browse available courses
- 💳 Purchase courses via **Stripe Checkout**
- 📖 Access course details, chapters, and lessons after purchase
- 📊 Track learning progress
- ✅ Mark lessons as complete

### For Admin:

- ➕ Create new courses
- 📄 Add chapters & lessons to a course
- 🎯 Edit & delete chapters or lessons
- 🎬 Upload lesson videos via **Tigris Presigned URL**
- 🔀 Reorder chapters & lessons with **Drag-and-Drop** (DND Kit)
- ✏️ Edit lesson content with **Tiptap** (rich text editor)
- 🗑 Delete courses, chapters, or lessons
- 📈 Track user progress per course
- 💰 View course sales history

---

## 📧 Email Verification

The project uses **Resend** for email verification.  
Since I’m using the free plan, only my email is allowed for verification.

If you want to **clone** and run the project locally,  
please replace the email configuration in `.env` with your own Resend API key and domain.

---

## 🚀 Tech Stack

- **Next.js** (App Router)
- **Prisma** + **PostgreSQL**
- **TipTap** (rich text editor)
- **Tigris** (video storage with presigned URLs)
- **Stripe** (payments)
- **Resend** (email verification)
- **React DnD** (drag & drop)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/peterVoid/kamar-kursus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run the development server
npm run dev
```

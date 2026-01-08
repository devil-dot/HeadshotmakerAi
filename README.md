# Professional Headshot Maker 🎨

Transform your selfies into professional ID photos using advanced AI technology powered by Google Gemini.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🖼️ **Upload 5 Selfies** - Drag & drop interface with real-time validation
- 👔 **Professional Styles** - Choose from 5 professional attire options
- 🤖 **AI-Powered Generation** - Google Gemini API with identity preservation
- 🎨 **Modern UI/UX** - Dark theme with glassmorphism and smooth animations
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⬇️ **Download Results** - Save your professional headshots instantly
- 🔒 **Secure** - API keys protected, server-side processing only

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   cd HeadshotmakerAi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The `.env.local` file already exists with your API key:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

1. **Upload Images** - Drag and drop or click to upload exactly 5 clear selfies from different angles
2. **Select Style** - Choose your preferred professional attire style
3. **Generate** - Click the "Generate Professional Headshot" button
4. **Download** - Save your AI-generated professional headshot

## 🎯 Professional Styles Available

- **Formal Navy Suit** - Classic navy blue suit with white shirt and tie
- **White Shirt Professional** - Clean white shirt, business casual
- **Doctor's Coat** - Medical professional white coat
- **Business Casual** - Smart casual blazer and shirt
- **Corporate Headshot** - Professional corporate attire

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Icons**: Lucide React
- **Fonts**: Inter, Outfit (Google Fonts)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/generate/route.ts    # Gemini API integration
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main application
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── ImageUploader.tsx        # Image upload component
│   ├── PromptBuilder.tsx        # Style selection
│   ├── ResultDisplay.tsx        # Result display
│   └── LoadingSpinner.tsx       # Loading animation
├── lib/
│   ├── gemini.ts                # Gemini client
│   └── utils.ts                 # Utility functions
└── types/
    └── index.ts                 # TypeScript types
```

## 🎨 Design Features

- **Glassmorphism** - Frosted glass effect on cards
- **Gradient Backgrounds** - Animated blue/purple gradients
- **Micro-animations** - Smooth transitions and hover effects
- **Floating Particles** - Dynamic background particles
- **Custom Scrollbar** - Styled scrollbar matching theme
- **Responsive Grid** - Adapts to all screen sizes

## 🔐 Security

- API keys stored in `.env.local` (never committed to git)
- Server-side API calls only
- Input validation on all uploads
- File size and type restrictions
- Error handling without exposing sensitive data

## 🧪 Testing

The application has been tested for:
- ✅ Image upload functionality
- ✅ Drag & drop interface
- ✅ File validation
- ✅ Responsive design
- ✅ API integration
- ✅ Error handling
- ✅ Browser compatibility

## 📦 Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🌐 Deployment

This application can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Any Node.js hosting service**

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Don't forget to add your `GOOGLE_API_KEY` to the environment variables in your deployment platform.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | Yes |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** - For the powerful AI image generation capabilities
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon set

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Open an issue in this repository

## 🎯 Roadmap

Future enhancements planned:
- [ ] Batch processing for multiple styles
- [ ] History/gallery of generated headshots
- [ ] Advanced editing options
- [ ] Social media sharing
- [ ] User accounts and preferences
- [ ] Payment integration for premium features

---

**Built with ❤️ using Next.js 15, React 19, TypeScript, Tailwind CSS, and Google Gemini AI**

*Transform your selfies into professional headshots in seconds!*

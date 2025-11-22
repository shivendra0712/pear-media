# 🎨 Pear Media - AI-Powered Image Generation & Analysis Platform

A full-stack web application that leverages AI to enhance text prompts, generate images, and analyze existing images using Google's Gemini AI and Vision API.

## ✨ Features

### 🔤 Text-to-Image Flow
- **Prompt Enhancement**: Automatically analyze and enhance user prompts for better image generation
- **AI-Powered Analysis**: Get tone, intent, and missing details analysis of your prompts
- **Image Generation**: Generate high-quality images from enhanced prompts using Gemini AI
- **Real-time Preview**: See your generated images instantly with loading states

### 🖼️ Image-to-Image Flow
- **Image Upload**: Upload any image for AI analysis
- **Smart Analysis**: Automatically detect and describe image content using Google Vision API
- **Regeneration**: Generate new variations based on analyzed image descriptions
- **Label Detection**: Extract meaningful labels and descriptions from uploaded images

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

### Backend
- **Node.js** with **Express 5** - Server framework
- **Google Generative AI (Gemini)** - Text enhancement and image generation
- **Google Cloud Vision API** - Image analysis and label detection
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud account with:
  - Gemini API key
  - Vision API credentials (optional, for image analysis)
  - OpenAI API key (optional, fallback for text enhancement)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/shivendra0712/pear-media.git
cd pear-media
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - for image analysis feature
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"..."}

# Optional - fallback for text enhancement
OPENAI_API_KEY=your_openai_api_key_here

# Server configuration
PORT=5000
```

**Important**: Never commit your `.env` file or API keys to version control!

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
pear-media/
├── backend/
│   ├── src/
│   │   └── routes/
│   │       ├── text.js      # Text enhancement endpoints
│   │       └── image.js     # Image generation & analysis endpoints
│   ├── server.js            # Express server setup
│   ├── package.json
│   └── .env                 # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TextFlow.jsx    # Text-to-image component
│   │   │   └── ImageFlow.jsx   # Image-to-image component
│   │   ├── services/
│   │   │   └── api.js          # API client functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Text Enhancement
- **POST** `/api/text/enhance`
  - Body: `{ "prompt": "your text prompt" }`
  - Returns: Enhanced prompt with analysis

### Image Generation
- **POST** `/api/image/generate`
  - Body: `{ "prompt": "enhanced prompt" }`
  - Returns: Generated image URL or base64

### Image Analysis
- **POST** `/api/image/analyze`
  - Body: FormData with image file
  - Returns: Image description and labels

## 🎯 Usage

### Text-to-Image Workflow
1. Enter a text prompt describing what you want to generate
2. Click "Enhance Prompt" to improve your description
3. Review the AI analysis and enhanced prompt
4. Click "Generate Image" to create your image
5. View and download the generated result

### Image-to-Image Workflow
1. Upload an image file
2. Click "Analyze Image" to get AI-generated description
3. Review the detected labels and description
4. Click "Generate Image" to create a variation
5. View the newly generated image

## 🔐 Security Notes

- Never commit API keys or credentials to version control
- The `vision-key.json` file should be kept locally and added to `.gitignore`
- Use environment variables for all sensitive configuration
- GitHub push protection will block commits containing secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Shivendra**
- GitHub: [@shivendra0712](https://github.com/shivendra0712)

## 🙏 Acknowledgments

- Google Gemini AI for image generation
- Google Cloud Vision API for image analysis
- OpenAI for fallback text enhancement
- React and Vite communities


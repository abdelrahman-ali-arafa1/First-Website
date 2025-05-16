# Student Design Platform

A modern, responsive web application where students can upload, view, and share their design projects in a public gallery.

## Features

- **User Authentication**: Register, login, and manage your profile
- **Design Gallery**: Browse and search designs by category and keywords
- **Upload System**: Share your own designs with the community
- **Interactive UI**: Like designs and leave comments
- **Profile Pages**: Showcase your work on your personal profile
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Forms**: Formik with Yup validation
- **Icons**: Heroicons
- **State Management**: React Context API
- **Storage**: localStorage (demo purposes only)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd student-design
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
student-design/
├── src/
│   ├── assets/        # Static assets like images
│   ├── components/    # Reusable UI components
│   │   ├── auth/      # Authentication related components
│   │   ├── design/    # Design display components
│   │   ├── layout/    # Layout components (navbar, footer)
│   │   ├── profile/   # Profile related components
│   │   └── ui/        # Base UI components
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── utils/         # Utility functions
├── index.html         # Entry HTML file
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite configuration
```

## Usage

- Create an account or log in
- Browse designs in the gallery
- Upload your own designs
- Like and comment on designs
- Edit your profile to add a bio

## Demo Information

This project uses browser localStorage to simulate a backend. All data is stored locally in your browser and will persist between sessions until you clear your browser data. In a real production environment, this would be replaced with actual backend API calls.

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

## License

MIT 
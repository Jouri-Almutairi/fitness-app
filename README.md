# 💪 FitZone - CPIT405 Final Project

## 📌 Project Description

**FitZone** is a modern fitness web application that helps users discover exercises, create personalized workout plans, and track their fitness journey. The platform provides access to 1,300+ exercises with detailed instructions, allowing users to build custom workout routines.

This application aims to make fitness accessible to everyone through an intuitive interface, smart filtering, and personalized features like favorites and custom workout plans.

## ✨ Key Features

- 🏋️ **Exercise Library**: Browse and search 1,300+ exercises from ExerciseDB API
- 🔍 **Smart Filtering**: Filter exercises by body part, target muscle, and equipment
- ⭐ **Favorites System**: Save your favorite exercises for quick access
- 📋 **Workout Planner**: Create custom workout plans for multiple days
- 👤 **User Authentication**: Secure registration and login with Firebase
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- 🌙 **Dark Theme**: Modern dark mode interface for comfortable viewing

## 🛠️ Technologies Used

| Technology      | Description                                 |
| --------------- | ------------------------------------------- |
| React 19        | Frontend component-based development        |
| React Router v7 | Client-side routing and navigation          |
| Context API     | Global state management (Auth & Favorites)  |
| Firebase Auth   | Secure user authentication                  |
| ExerciseDB API  | External API for exercise data (RapidAPI)   |
| localStorage    | Data persistence for favorites and workouts |
| CSS3            | Modern styling with Flexbox and Grid        |
| Vite            | Fast build tool and development server      |

---

## 📁 Project Structure

| File/Folder                         | Purpose                                       |
| ----------------------------------- | --------------------------------------------- |
| `src/pages/Home.jsx`                | Landing page with hero section and features   |
| `src/pages/Exercises.jsx`           | Main exercise library with search and filters |
| `src/pages/ExerciseDetail.jsx`      | Detailed view of single exercise              |
| `src/pages/Login.jsx`               | User login page                               |
| `src/pages/Register.jsx`            | User registration page                        |
| `src/pages/Favorites.jsx`           | User's saved favorite exercises               |
| `src/pages/WorkoutPlan.jsx`         | Create and manage workout plans               |
| `src/pages/Profile.jsx`             | User profile management                       |
| `src/contexts/AuthContext.jsx`      | Authentication state management               |
| `src/contexts/FavoritesContext.jsx` | Favorites state management                    |
| `src/components/Navbar.jsx`         | Navigation bar component                      |
| `src/components/Footer.jsx`         | Footer component                              |
| `src/components/ProtectedRoute.jsx` | Route protection for authenticated users      |
| `src/firebase.js`                   | Firebase configuration                        |

---

## 📄 Pages Overview

### 1️⃣ Homepage

The **Homepage** welcomes users with a hero section showcasing the platform's main features. It includes call-to-action buttons to explore exercises or sign up, along with feature highlights explaining what FitZone offers.

### 2️⃣ Exercise Library

The **Exercise Library** displays all available exercises fetched from the ExerciseDB API. Users can:

- Search exercises by name, muscle, or equipment
- Filter by body part categories
- View exercise cards with images and tags
- Add exercises to favorites

### 3️⃣ Exercise Detail

This page shows detailed information about a selected exercise including:

- Exercise name and image
- Target muscle and body part
- Required equipment
- Step-by-step instructions
- Pro tips for proper form

### 4️⃣ Login & Registration

Users can create accounts and log in securely using Firebase Authentication:

- Registration with name, email, and password
- Form validation with error messages
- Secure password handling

### 5️⃣ Favorites

The **Favorites** page displays all exercises saved by the user with options to view details or remove from favorites.

### 6️⃣ Workout Plan

Users can create personalized workout plans:

- Create workouts with custom names
- Select multiple days of the week
- Add exercises from favorites
- Edit and delete workouts

### 7️⃣ Profile

The **Profile** page shows user information with edit functionality and account statistics.

---

## ✅ Project Requirements Mapping

### 🔐 User Authentication

- ✅ User registration and login with Firebase
- ✅ Secure password handling (Firebase encryption)
- ✅ Session management with `onAuthStateChanged`
- ✅ User profile management

### 🛡️ Protected Routes

- ✅ Route protection using `ProtectedRoute` component
- ✅ Redirect unauthenticated users to login
- ✅ Navigation guards in `App.jsx`

### 🌐 External API Integration

- ✅ ExerciseDB API integration via RapidAPI
- ✅ Error handling with user-friendly messages
- ✅ Loading states with spinner
- ✅ Retry functionality on error

### 💻 Code Quality

- ✅ Clean, well-organized component structure
- ✅ Comments explaining key functionality
- ✅ Proper error handling with try/catch
- ✅ Responsive design with CSS media queries

### 🔧 Additional Features

- ✅ Form validation on all forms
- ✅ Loading indicators
- ✅ Search and filtering capabilities
- ✅ Data persistence with localStorage

---

## 👥 Team Members

| Name            | Role                 | ID        |
| --------------- | -------------------- | --------- |
| Jouri Almutairi | Full Stack Developer | [2112383] |

---

## 🚀 Live Demo

- **Live Application**: [Your Netlify Link]
- **GitHub Repository**: [https://github.com/Jouri-Almutairi/fitness-app](https://github.com/Jouri-Almutairi/fitness-app)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Jouri-Almutairi/fitness-app.git

# Navigate to project folder
cd fitness-app

# Install dependencies
npm install

# Create .env file and add your API key
VITE_RAPIDAPI_KEY=your_api_key_here

# Run development server
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

---

## 📸 Screenshots

[Add your screenshots here]

---

## 📝 License

This project is created for educational purposes as part of CPIT405 course.

© 2024 FitZone. All rights reserved.

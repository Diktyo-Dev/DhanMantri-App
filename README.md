DhanMantri – Personal Finance Management Web App
Project Overview

DhanMantri is a web-based personal finance management application designed to help users efficiently track and manage their financial activities. The application allows users to record income, manage expenses, set financial goals, and monitor their overall financial health in a simple and intuitive interface.

This project is developed as part of the **Final Semester Web Design Project**.

Features

 🔐 User Authentication (Login & Signup using Firebase)
 💵 Income Tracking
 💸 Expense Management
 🎯 Financial Goal Setting
 📊 Organized Dashboard Interface
 📝 Feedback System
 📱 Responsive Design


**Technologies Used**

# Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

### Backend / Services

* Firebase Authentication
* Firebase Firestore Database

### Hosting
GitHub Pages

📂 Project Structure:-
dhanmantri-app/
│
├── index.html
├── login.html
├── signup.html
├── income.html
├── expenses.html
├── goals.html
├── feedback.html
│
├── css/
│   ├── style.css
│   └── feedback.css
│
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── app.js
│   └── feedback.js
│
├── images/
   └── assets

## ⚙️ Setup Instructions

 1. Clone Repository

```
git clone https://github.com/Diktyo-Dev/dhanmantri-app.git
cd dhanmantri-app
```

 2. Firebase Setup

a. Go to Firebase Console

b. Create a new project

c. Enable:

   * Authentication → Email/Password
   * Firestore Database

d. Copy Firebase configuration and paste it in:

```
js/firebase.js
```

---

3. Add Authorized Domain

Go to:

```
Authentication → Settings → Authorized Domains
```

Add your GitHub domain:

```
yourusername.github.io
```

---

4. Firestore Database Rules

For development:

```js
allow read, write: if true;
```

For secure usage:

```js
allow read, write: if request.auth != null;
```

---

5. Run Locally

Use a local server (important for Firebase):

```
python3 -m http.server
```

Open:

```
http://localhost:8000
```

---

**Deployment (GitHub Pages)**

1. Push project to GitHub

2. Go to **Settings → Pages**

3. Select:

   * Branch: `main`
   * Folder: `/root`

4. Access your live app:

```
https://yourusername.github.io/dhanmantri-app/
```

---

## Important Notes

* Ensure correct folder structure (no nested directories)
* File paths must be relative (e.g., `js/app.js`)
* GitHub is case-sensitive (match file names exactly)
* Firebase Authentication requires HTTPS (works on GitHub Pages)


## 👨‍💻 Author

* Name: Raju Kumar
* Course: B.Tech CSE
* Semester: First Semester

---

##  License

This project is created for academic purposes and is free to use for learning.

---

## ⭐ Acknowledgement

* Firebase by Google
* GitHub Pages for hosting

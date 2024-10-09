# Password Generator

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Github Pages](https://img.shields.io/badge/github%20pages-121013?style=for-the-badge&logo=github&logoColor=white)

- Deployed to GH-Pages: https://daydin14.github.io/password-generator/

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Deployment on GitHub Pages](#deployment-on-github-pages)

## Getting Started

To get started with the project, follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of this repository to create a copy of the repository in your GitHub account.
2. **Clone the repository**: Clone the forked repository to your local machine using the following command:
   ```bash
   git clone https://github.com/<your-username>/password-generator.git
   ```
3. **Navigate to the project directory**: Change into the project directory:
   ```bash
   cd app
   ```
4. **Open with VS Code**: Using the terminal, after you've changed directory into the project:
   ```bash
   code .
   //Daves Side Note: '.' is similar to saying, code "current directory"
   ```
5. **Install dependencies**: Install the required dependencies using npm:
   ```bash
   npm install || npm i
   ```
6. **Start the development server**: Start the development server to run the application locally:
   ```bash
   npm start
   ```

## Features

- **Single-Page Application**: Built using React, providing a smooth and seamless user experience.
- **Responsive Design**: Ensures the application works well on both desktop and mobile devices.
- **Password Generation**: Allows users to generate secure passwords with customizable options.
- **Configurable Options**: Users can select the length and types of characters (letters, numbers, symbols) to include in the password.
- **Live Preview**: Displays the generated password in real-time as options are selected.
- **Copy to Clipboard**: Users can easily copy the generated password to their clipboard.

## Technologies Used

### IDEs/Editors

- **VS Code**: A powerful, lightweight code editor with built-in support for JavaScript, TypeScript, and Node.js.

### Version Control

- **Git**: A distributed version control system for tracking changes in source code.
- **GitHub**: A web-based platform for version control and collaboration.

### Languages

- **JavaScript (JS)**: The main programming language used for building the application.
- **HTML**: Used for structuring the web pages.
- **CSS**: Used for styling the web pages.
- **Markdown (MD)**: Used for writing documentation.

### Frameworks, Platforms, and Libraries

- **NPM**: A package manager for JavaScript, used to install dependencies.
- **React**: A JavaScript library for building user interfaces.
- **React Router**: A library for routing in React applications.

### CSS Frameworks and Tools

- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **DaisyUI:** A plugin for Tailwind CSS that provides pre-designed components.
- **PostCSS:** A tool for transforming CSS with JavaScript plugins.
- **Autoprefixer:** A PostCSS plugin to parse CSS and add vendor prefixes.

### Linting and Formatting

- **ESLint:** A tool for identifying and fixing problems in JavaScript code.
- **eslint-plugin-react:** An ESLint plugin for React-specific linting rules.
- **@eslint/js:** ESLint's built-in JavaScript rules.
- **globals:** A library of global variables for ESLint.

## Screenshots

<img src="./assets/images/web-view.png" alt="Password Generator with configuration options. - Web View" width="400" height="400" />&emsp;
<img src="./assets/images/mobile-view.png" alt="Password Generator with configuration options. - Mobile View" height="400" />

## Project Structure

```
app/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── ...
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── styles/
│   │   │   └── ...
│   ├── components/
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── NavMenu.js
│   ├── constants/
│   │   └── PasswordConstants.js
│   ├── contexts/
│   ├── hooks/
│   │   └── useIsMobile.js
│   ├── pages/
│   │   ├── Home.js
│   ├── tests/
│   │   ├── App.test.js
│   │   ├── setupTests.js
│   ├── utils/
│   │   ├── reportWebVitals.js
│   ├── App.js
│   ├── AppRoutes.js
│   └── index.js
├── .gitignore
├── .eslint.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

## Deployment on GitHub Pages

This project uses the gh-pages node package to deploy the application to GitHub Pages.
Follow these steps to deploy your application:

1. **Install gh-pages**: Install the gh-pages package as a development dependency:
   ```bash
   npm install gh-pages --save-dev
   ```
2. **Update package.json**: Add the following scripts to your package.json file:
   ```json
   "scripts": {
        <!--
            ... {Other existing scripts} i.e.
            "start": "react-scripts start",
        -->
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build",
   }
   ```
3. **Add homepage field**: Add the homepage field to your package.json file with the URL of your GitHub Pages site:

   ```json
   "homepage": "https://<your-username>.github.io/password-generator"

    - Be sure to change the url within the "homepage" json text to your GitHub username
   ```

4. **Deploy the application**: Run the deploy script to build and deploy the application to GitHub Pages:
   ```bash
   npm run deploy
   ```

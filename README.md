# Elective Selection System

A web application designed to streamline the elective course selection process for final and pre-final year students at MITS college. The system ensures efficient registration and smooth slot allocation while handling high traffic effectively. 

## Overview

This application simplifies the elective selection process by enabling students to:
- Register using their college email ID, username, and register number.
- Browse and search for electives within their respective branches.
- Book slots for desired courses, with each course having a maximum of 60 seats allocated on a first-come, first-serve basis.

### Key Features

- **Student Registration:** Students can register using their college-provided credentials.
- **Branch & Course Selection:** Users can explore and select courses from their branch.
- **Slot Allocation:** Each course has 60 slots available, allocated on a first-come, first-serve basis.
- **Traffic Handling:** Optimized for smooth performance, reducing the likelihood of crashes during peak times.
- **Cloud-Focused Architecture:** Designed for scalability and reliability using cloud-based services.

## Technologies Used

- **Frontend:** React with Vite
- **TypeScript:** Ensures type safety and robust development practices

### Prerequisites

Ensure you have the following installed before setting up the project:

- **Node.js**
- **Vite**
- **React**

## Setup Instructions

Follow these steps to get started:

1. Clone the repository:
   ```bash
   git clone https://github.com/Cloud-Tech-Team/open-elective.git
   cd  open-elective
2. Install dependencies:
    ```bash
   npm install
3. Start the development server:
    ```bash
    npm run dev




# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

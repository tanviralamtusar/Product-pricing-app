# Offline Product Price App

This is a native cross-platform mobile app created with Expo and React Native.

## Features
- **Cross-platform**: Works on iOS, Android, and Web.
- **Offline Capable**: Designed to work without an internet connection.
- **Modern Stack**: Built with React Native, Expo Router, and TypeScript.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [Bun](https://bun.sh/) (recommended) or npm/yarn.
- [Expo Go](https://expo.dev/client) app installed on your phone (for testing).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <YOUR_REPO_URL>
    cd "Product pricing app"
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    # or
    npm install
    ```

### Running Locally

To start the development server:

```bash
bun start
# or
npx expo start
```

- **Scan the QR code** with the Expo Go app on your phone to run the app.
- Press `w` in the terminal to open the Web version.
- Press `a` to open in Android Emulator (if installed).
- Press `i` to open in iOS Simulator (macOS only).

## Building for Android (APK)

To build a standalone APK file that you can install on any Android device:

1.  **Login to Expo CLI**:
    ```bash
    npx eas-cli login
    ```

2.  **Trigger the Cloud Build**:
    We use Expo Application Services (EAS) to build the APK in the cloud.
    ```bash
    npx eas-cli build -p android --profile preview
    ```

3.  **Download the APK**:
    - Wait for the build to finish (approx. 10-15 mins).
    - The terminal will provide a direct download link.
    - Download the file (e.g., `application-....apk`) and transfer it to your phone to install.

## Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── _layout.tsx        # Root layout
│   └── ...
├── assets/                # Static assets (images, fonts)
├── components/            # Reusable UI components
├── constants/             # App constants and configuration
├── eas.json              # Build configuration (APK settings)
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Technologies

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - Navigation
- **NativeWind** - Styling (Tailwind CSS for React Native)
- **Zustand** - State management
- **React Query** - Data fetching

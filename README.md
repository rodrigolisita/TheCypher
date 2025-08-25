
## The Cypher

"The Cypher" is an immersive, educational puzzle game for mobile devices, built with React Native and Expo. Players take on the role of Agent Bob, a spy in training, whose mission is to decrypt messages from his handler, Agent Alice. The game blends a compelling spy narrative with practical, hands-on cryptography puzzles.

This project was developed as the final project for the CM3050 - Mobile Development module.

## Key Features

* **5 Unique Cipher Puzzles**: Progress through missions featuring historical and modern ciphers, including Caesar, Atbash, Vigenère, and metaphorical puzzles for Asymmetric and Symmetric cryptography.
* **Dynamic & Randomized Objectives**: To enhance replayability, each mission dynamically generates a random set of required items and a corresponding plaintext message, ensuring no two playthroughs are the same.
* **Complete Gameplay Loop**: The app features a full gameplay loop where solving a puzzle provides instructions for an item collection phase before progressing.
* **Persistent Progress**: Player progress is saved to the device's local storage using `@react-native-async-storage/async-storage`, correctly unlocking missions as the player advances.
* **Internationalization**: The entire app is available in both English and Portuguese, with language selection persisting across app sessions.
* **Immersive UI/UX**: The app features a custom "spy/hacker" theme, with thematic sound effects, haptic feedback on interactions, and a "typing" animation for the decryption process.
* **Global State Management**: A global audio provider was built using the React Context API to efficiently manage all sound and haptic feedback throughout the application.

## Tech Stack

* **Framework**: React Native with Expo
* **Navigation**: Expo Router (File-based routing with a Stack Navigator)
* **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`)
* **Data Persistence**: `@react-native-async-storage/async-storage`
* **UI/UX Libraries**: `expo-av`, `expo-haptics`

## Project Structure

/*
The project is organized into a modular structure for clarity and maintainability.

.
├── app/                  # Expo Router screens and layouts

│   ├── (stack)/          # Main screen components for the stack navigator

│   └── _layout.js        # Root layout with the global AudioProvider

├── assets/               # Static assets (images, sounds, fonts)

├── components/           # Reusable components (e.g., puzzles)

├── context/              # Global React Context providers (e.g., AudioContext)

├── data/                 # Centralized game data (missions, items)

└── hooks/                # Custom React hooks (e.g., useAudio)

*/


## Getting Started

**1. Install Dependencies**

**bash**
npm install

**2. Start the app**
npx expo start

## Live Demo

This project has been published using EAS Update. You can run the full application on your own device using the Expo Go app.

1.  Download the **Expo Go** app on your iOS or Android device.
2.  Scan the QR code below with your phone's camera.

![The Cypher QR Code](./assets/images/eas-update.svg)


Alternatively, you can visit the project's update page here: 

https://expo.dev/accounts/rodrigolisita/projects/TheCypher/updates/410cfd4b-df52-471b-9be5-bd909941fbfc


## Acknowledgments
Sound effects obtained from Pixabay.
Wireframe design assisted by UX Pilot.
User flow diagram created with Figma.

## Author
Rodrigo Lisita Ribera
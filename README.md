# Tuner App

A simple musical instrument tuner + tone generator built with React, Material-UI, and Web Audio API.

## Features

### 🎵 Tuner
- Real-time frequency detection using microphone input
- Works with any musical instrument
- Visual feedback showing how far off the detected note is
- Rotating dial interface with precise cent measurements
- Color-coded tuning status (green=in tune, yellow=close, red=off)

### 🔊 Tone Generator  
- Interactive circular note dial for selecting any note
- Octave selection (2-6)
- Adjustable volume control
- Clean sine wave tone generation
- Real-time frequency display

### 🎨 Interface
- Minimalistic, clean dark theme
- Tabbed interface switching between tuner and generator
- Responsive design for mobile and desktop

## Usage

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

4. Allow microphone access when prompted (for tuner functionality)

### Using the Tuner
5. Click "Start Tuning" and play your instrument
6. The rotating dial shows:
   - The detected note in real-time
   - Frequency in Hz
   - How many cents off you are from perfect pitch
   - Color-coded progress bar (green=in tune, yellow=close, red=off)

### Using the Tone Generator
5. Switch to the "Tone Generator" tab
6. Click on the circular dial to select any note (C, C#, D, etc.)
7. Choose your desired octave (2-6)
8. Adjust the volume slider
9. Click the play button to generate the tone
10. Use this as a reference pitch for tuning by ear

## How to Use

- **Green**: In tune (within ±5 cents)
- **Yellow**: Close (within ±15 cents)  
- **Red**: Out of tune (more than ±15 cents)



## Technical Requirements

- Modern web browser with Web Audio API support
- Microphone access (for tuner functionality)
- HTTPS (required for microphone access in production)

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **Zustand** for state management
- **Vite** for build tooling
- **Web Audio API** for audio processing
- **Pitchy** library for pitch detection

## Attribution

The app icon (favicon) is based on ["8thNote.svg"](https://commons.wikimedia.org/wiki/File:8thNote.svg) by [PianistHere](https://commons.wikimedia.org/wiki/User:PianistHere), licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). No changes were made to the original file.

 
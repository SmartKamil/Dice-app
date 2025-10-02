# DICE Events App

A React application for displaying DICE events at a particular venue. Built with React, TypeScript, and Tailwind CSS.

## Features

- Search events by venue name
- Responsive design (desktop, tablet, mobile)
- Audio track indicators (play button)
- Event badges (Featured, On Sale)
- Infinite scroll (automatically loads more events as you scroll)
- Expandable "More Info" sections
- Multiple ticket states (Book Now, Get Reminded, Sold Out)

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:SmartKamil/Dice-app.git
```

2. Navigate to the project directory:
```bash
cd Dice-app/dice-events-app
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter a venue name in the search input (e.g., "The Waiting Room")
2. Click "Search" to fetch events for that venue
3. Browse through the events displayed in a responsive grid
4. Click "More info" on any event to see additional details
5. Scroll down to automatically load more events (infinite scroll)
6. Click the play button on event images to preview audio tracks

## API Information

- **Endpoint**: https://events-api.dice.fm/v1/events
- **Authentication**: Uses API key header (`x-api-key`)
- **Image Optimization**: Images served via Imgix with on-the-fly resizing

## Project Structure

```
src/
├── components/
│   ├── EventCard.tsx       # Main event card component
│   ├── VenueSearch.tsx     # Search input component
│   ├── PlayButton.tsx      # Audio track play button
│   ├── EventBadge.tsx      # Featured/On Sale badges
│   └── MoreInfo.tsx        # Expandable info section
├── services/
│   └── api.ts              # API client and helpers
├── types/
│   └── event.ts            # TypeScript interfaces
├── App.tsx                 # Main app component
├── index.css               # Global styles
└── main.tsx                # Entry point
```

## Design Features

- Clean, modern UI based on Figma designs
- Conditional rendering of play buttons (only when audio tracks exist)
- Smart badge display (Featured vs On Sale)
- Button states based on ticket availability
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

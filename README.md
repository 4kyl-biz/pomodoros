# Pomodoro Timer

A distraction-free, data-driven Pomodoro timer built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### ✅ Phase 1 - Core Timer MVP (Completed)
- **Timer Controls**: Start, pause, resume, and reset functionality
- **Session Management**: 25-minute work sessions with 5-minute short breaks and 15-minute long breaks
- **Cycle Counter**: Tracks completed Pomodoro sessions
- **Sound Notifications**: Audio alerts when sessions end (with mute option)
- **Data Persistence**: Timer state and settings saved to localStorage
- **Mobile-First Design**: Responsive UI that works on all screen sizes

### ✅ Phase 2 - Preferences & Theming (Completed)
- **Settings Page**: Customize timer durations and auto-cycle behavior
- **Theme Picker**: Light, dark, and system theme options with persistence
- **In-Tab Notifications**: Background notifications when sessions end
- **Settings Persistence**: All preferences saved to localStorage

### 🚧 Upcoming Features
- **Phase 3**: User authentication, tasks & notes
- **Phase 4**: Analytics dashboard with heat maps and streaks
- **Phase 5**: Testing & QA automation
- **Phase 6**: PWA installation capabilities
- **Phase 7**: GDPR compliance, data export & deletion

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pomodoros
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Timer Controls
- **Start/Pause**: Click the play/pause button to start or pause the timer
- **Reset**: Click the reset button to reset the current session
- **Skip**: Click the skip button to move to the next session type
- **Mute**: Toggle sound notifications on/off

### Session Types
- **Work Session**: 25 minutes of focused work
- **Short Break**: 5-minute break after each work session
- **Long Break**: 15-minute break after every 4 work sessions

### Data Persistence
- Timer state is automatically saved to localStorage
- Session progress is preserved when you refresh the page
- Mute settings are remembered across sessions

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── Timer.tsx       # Main timer component
├── hooks/              # Custom React hooks
│   └── usePomodoroTimer.ts
└── lib/                # Utility functions
    ├── supabase.ts     # Supabase client
    └── utils.ts        # General utilities
```

### Testing
- Visit `/test-timer` for a debug interface
- Visit `/test-supabase` to test Supabase connection

## Contributing

This project follows the specifications outlined in `prompts/pomodoros_specs.md`. 

### Development Phases
See `prompts/pomodoros_todo.md` for the complete implementation checklist.

## License

MIT License - see [LICENSE](LICENSE) file for details.

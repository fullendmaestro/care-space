# Care Space

![Care-Space Demo](https://github.com/fullendmaestro/care-space/blob/main/patients.png?raw=true)

A comprehensive web application for managing hospital operations, patient care, and administrative tasks.

## Features

- **Multi-role Authentication**: Secure login for administrators, staff, and patients
- **Patient Management**: Register, view, and update patient information
- **Staff Management**: Manage doctors, nurses, and other hospital staff
- **Appointment Scheduling**: Schedule and manage patient appointments
- **Medical Records**: Create and access patient medical records
- **Resource Allocation**: Optimize hospital resource utilization
- **Real-time Updates**: WebSocket integration for instant data updates. However, the current deployed demo does not support this due to the deployment infrastructure limitation, but the websocket realtime update will work absolutely well when run locally or deployed on a vm
- **AI-powered Assistant**: Intelligent chatbot for scheduling recommendations and insights

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes and server actions, WebSocket Server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **Real-time**: WebSocket for live updates
- **AI Integration**: Google Gemini for intelligent recommendations

## Youtube Video demo

https://youtu.be/JBe0FsgFjUI

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fullendmaestro/care-space.git
   cd care-space
   ```

2. **Install dependencies**:

   ```sh
   pnpm install
   ```

3. **Set up environment variables**:

   - Copy the .env.example file to .env:
     ```sh
     cp .env.example .env
     ```
   - Fill in the required environment variables in the .env file.

4. **Run database migrations**:

   ```sh
   pnpm drizzle-kit:generate
   pnpm drizzle-kit:push
   ```

5. **Start the development server**:

   ```sh
   pnpm run dev
   ```

6. **Setup websocket Client connection**: Note that if you are trying to deploy on a remote server and with tls, you need to uncomment the remaining section of the `getSocketPath` function from `/const/index.ts`.

7. **Open your browser** and navigate to `http://localhost:3000` to see the application running. Register and login as admin to view the dashboard with realtime update as other users interacts with the app.

These instructions will help you set up the project locally and start the development server.

## Credits

Music track: Brand by Aylex
Source: https://freetouse.com/music
Free No Copyright Music Download

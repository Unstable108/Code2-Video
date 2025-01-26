````markdown
# Collaborative Code Editor

A real-time collaborative code editor built using **Monaco Editor**, **Socket.IO**, and **PeerJS**. This project is designed to showcase skills in real-time synchronization, UI/UX development, and collaborative tooling. The project is not intended to scale to a large user base but focuses on providing core functionality for collaboration and learning.

---

## Features

### Core Features

- **Real-Time Collaboration**: Multiple users can edit the same code in real time.
- **Chat Integration**: Allows users to communicate while coding collaboratively.
- **User Cursor Tracking**: Tracks and displays the cursor positions of other users in the editor.
- **Code State Persistence**: Saves the code in a room so new users joining the room automatically receive the saved state.

### UI/UX Improvements

- **Homepage Redesign**: Improved homepage with a modern UI and a background image tailored to the theme.
- **Dark/Dracula Theme**: Room page with a sleek and user-friendly dark theme using TailwindCSS.

### Advanced Code Editor Features

- **Code Compilation**: Compile and run supported programming languages (C, C++, JavaScript, Python).
- **Code Utilities**: Options to:
  - Run code
  - Beautify code
  - Save code to the local machine
- **File Upload**: Upload a code file to display its contents in the editor.
- **Cursor Tracking**: Visualize different user cursors in the editor during collaborative sessions.

### Chatbot Integration

- **AI Chatbot**: Get coding assistance directly within the editor through an integrated AI chatbot.
- **Chat to Chatbot Conversion**: Transform the chat feature into an interactive chatbot experience.

---

## Technologies Used

- **Frontend**:
  - [Monaco Editor](https://microsoft.github.io/monaco-editor/)
  - [TailwindCSS](https://tailwindcss.com/) for styling
- **Backend**:
  - [Node.js](https://nodejs.org/) for server-side logic
  - [Socket.IO](https://socket.io/) for real-time communication
  - [PeerJS](https://peerjs.com/) for WebRTC connections
- **Others**:
  - [Operational Transformation (OT)/CRDT](https://en.wikipedia.org/wiki/Operational_transformation) for conflict resolution (in-progress)
  - AI API for chatbot functionality (e.g., OpenAI API)

---

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/collaborative-code-editor.git
   cd collaborative-code-editor
   ```
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run start
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

1. **Homepage**: Navigate to the homepage to create or join a room.
2. **Room Page**:
   - Code collaboratively with others in real-time.
   - Use the chat or AI chatbot for discussions or assistance.
   - Compile, run, beautify, or save your code.
3. **File Upload**: Upload a code file to populate the editor.
4. **Cursor Tracking**: See cursor positions of collaborators in real time.

---

## Roadmap

### Planned Improvements

- Implementing conflict resolution using OT/CRDT.
- Adding more themes for the code editor.
- Enhancing the AI chatbot for more contextual coding assistance.
- Supporting additional programming languages.
- Deployment on platforms like **Vercel** or **AWS**.

---

## Contributions

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- **Monaco Editor** for the excellent coding experience.
- **Socket.IO** for real-time communication.
- **TailwindCSS** for rapid UI development.
- AI services for chatbot integration.

```

```

#!/bin/bash

# Rich 4 Game - Quick Start Script

echo "🎲 Starting Rich 4 (大富翁4) Web Application..."
echo ""

# Check if backend is running
echo "Starting Backend (C# ASP.NET Core)..."
cd Rich4Backend
dotnet run --urls "http://localhost:5555" &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID) on http://localhost:5555"
echo ""

# Wait for backend to start
sleep 5

# Start frontend
echo "Starting Frontend (React)..."
cd ../rich4-frontend
npm start &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID) on http://localhost:3000"
echo ""

echo "================================================"
echo "🎮 Rich 4 is now running!"
echo "================================================"
echo ""
echo "🌐 Open your browser and go to: http://localhost:3000"
echo ""
echo "📝 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop this script (servers will continue running)"
echo "================================================"

# Keep script running
wait

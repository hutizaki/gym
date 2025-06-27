#!/bin/bash

# Start Blazor WebAssembly dev server with hot reload
dotnet watch run &
BLAZOR_PID=$!

# Trap Ctrl+C and kill both processes
trap "kill $BLAZOR_PID; exit" SIGINT

# Wait a few seconds to ensure the dev server is up
sleep 5

# Start BrowserSync to proxy Blazor and watch CSS files
browser-sync start --proxy "http://localhost:5109" --files "wwwroot/css/*.css"

# When BrowserSync exits, kill the Blazor dev server (in case trap didn't catch)
kill $BLAZOR_PID
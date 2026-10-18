# Blog Website

A full-stack blog website project with a separate frontend and backend architecture.

## Overview
This repository contains a blog application with a clear separation between the client-facing frontend and the server-side backend. It is structured to support content-driven web experiences and a scalable multi-part application layout.

## Project Structure
- `backend/` - server-side logic, APIs, and business logic
- `frontend/` - client user interface and web experience
- `Dockerfile` - container setup for deployment
- `.gitignore` - local files excluded from version control

## Features
- Separate frontend and backend
- Blog-focused application structure
- Docker deployment support
- Scalable architecture for future expansion

## Getting Started
1. Clone the repository.
2. Set up the backend and frontend dependencies.
3. Start the backend service.
4. Start the frontend application.

Example:
```bash
docker build -t blog-website .
docker run -p 8000:8000 blog-website
```

## Notes
This project is a good base for building and extending a modern blog platform with a modular architecture.

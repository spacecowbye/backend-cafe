#!/bin/bash

# Define project root directory
PROJECT_ROOT="cafeteria-seat-booking"

# Create main project folder
mkdir -p $PROJECT_ROOT

# Create frontend structure
mkdir -p $PROJECT_ROOT/frontend/{public,src/{components,pages,hooks,services,context,styles}}
touch $PROJECT_ROOT/frontend/{package.json,.env}
touch $PROJECT_ROOT/frontend/src/{App.js,index.js}
touch $PROJECT_ROOT/frontend/{vite.config.js,webpack.config.js,next.config.js} # Use as needed

# Create backend structure
mkdir -p $PROJECT_ROOT/backend/src/{config,controllers,middleware,models,routes,services,utils}
touch $PROJECT_ROOT/backend/{package.json,.env,.gitignore,README.md}
touch $PROJECT_ROOT/backend/src/{app.js,server.js}

# Create main README
touch $PROJECT_ROOT/README.md

echo "Project directory structure created successfully!"

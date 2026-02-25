#!/bin/bash

# Docker helper script for TORQ application
# Provides easy commands to build and run the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if GITHUB_TOKEN is set
check_github_token() {
    if [ -z "$GITHUB_TOKEN" ]; then
        print_message "$RED" "❌ ERROR: GITHUB_TOKEN environment variable is not set!"
        print_message "$YELLOW" "This token is required to install @torqlab packages from GitHub Packages."
        print_message "$YELLOW" "Set it with: export GITHUB_TOKEN=your_github_token"
        print_message "$YELLOW" "Get a token at: https://github.com/settings/tokens (requires 'read:packages' scope)"
        exit 1
    fi
}

# Show usage information
show_help() {
    echo "TORQ Docker Helper Script"
    echo ""
    echo "Usage: ./docker-run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build Docker images for production"
    echo "  start       Start production containers"
    echo "  stop        Stop running containers"
    echo "  restart     Restart containers"
    echo "  dev         Start development containers with hot reloading"
    echo "  logs        Show container logs"
    echo "  clean       Stop containers and remove images"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  export GITHUB_TOKEN=ghp_...  # Set GitHub token first"
    echo "  ./docker-run.sh build    # Build production images"
    echo "  ./docker-run.sh start    # Start production containers"
    echo "  ./docker-run.sh dev      # Start development with hot reloading"
}

# Build Docker images
build_images() {
    check_github_token
    print_message "$GREEN" "Building Docker images..."
    docker-compose build
    print_message "$GREEN" "✅ Build complete!"
}

# Start production containers
start_production() {
    print_message "$GREEN" "Starting production containers..."
    docker-compose up -d
    print_message "$GREEN" "✅ Production services started!"
    print_message "$YELLOW" "UI: http://localhost:3001"
    print_message "$YELLOW" "Server: http://localhost:3000"
}

# Start development containers
start_development() {
    check_github_token
    print_message "$GREEN" "Starting development containers with hot reloading..."
    docker-compose -f docker-compose.dev.yml up
}

# Stop containers
stop_containers() {
    print_message "$YELLOW" "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_message "$GREEN" "✅ Containers stopped!"
}

# Restart containers
restart_containers() {
    stop_containers
    start_production
}

# Show logs
show_logs() {
    docker-compose logs -f
}

# Clean up Docker resources
clean_docker() {
    print_message "$YELLOW" "Cleaning Docker resources..."
    docker-compose down --rmi all --volumes
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes
    print_message "$GREEN" "✅ Cleanup complete!"
}

# Main script logic
case "$1" in
    build)
        build_images
        ;;
    start)
        start_production
        ;;
    stop)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    dev)
        start_development
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_docker
        ;;
    help|"")
        show_help
        ;;
    *)
        print_message "$RED" "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

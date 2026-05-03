#!/bin/bash
# Prisma Studio launcher with correct Node version

cd "$(dirname "$0")"

# Load nvm if available
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    # Use Node 18+ (required for Prisma)
    if nvm list | grep -q "v18\|v20"; then
        NODE_VERSION=$(nvm list | grep -E "v(18|20)" | head -1 | awk '{print $1}' | tr -d '->*')
        if [ -n "$NODE_VERSION" ]; then
            echo "🔄 Switching to Node.js $NODE_VERSION..."
            nvm use "$NODE_VERSION" > /dev/null 2>&1
        fi
    fi
fi

echo "🚀 Starting Prisma Studio..."
echo "📊 Access at: http://localhost:5555"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npx prisma studio

#!/bin/bash

# Script to stop the separately running environment

if [ -f .separate-env-pids ]; then
    PIDS=$(cat .separate-env-pids)
    echo "🛑 Stopping services (PIDs: $PIDS)..."
    kill $PIDS 2>/dev/null || true
    rm -f .separate-env-pids
    echo "✅ Services stopped"
else
    echo "ℹ️  No separate environment processes found"
    echo "   (If services are running, you may need to stop them manually)"
fi

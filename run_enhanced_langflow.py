#!/usr/bin/env python3
"""
Enhanced Langflow Startup Script
This script starts YOUR customized Langflow with all enhancements preserved.
"""

import sys
import os
from pathlib import Path

def main():
    print("=" * 50)
    print("🚀 Starting YOUR Enhanced Langflow")
    print("=" * 50)
    print()

    # Get the current directory
    current_dir = Path(__file__).parent
    backend_dir = current_dir / "src" / "backend" / "base"

    print(f"📁 Current directory: {current_dir}")
    print(f"📁 Backend directory: {backend_dir}")

    # Add backend to Python path
    sys.path.insert(0, str(backend_dir))
    print(f"✅ Added to Python path: {backend_dir}")

    # Change to backend directory
    os.chdir(backend_dir)
    print(f"✅ Changed working directory to: {os.getcwd()}")

    print()
    print("🔧 Your customizations are preserved:")
    print("   • Header modifications")
    print("   • UI enhancements")
    print("   • All previous changes")
    print()

    try:
        print("📦 Importing required modules...")

        # Import step by step with progress
        print("   • Importing langflow...")
        import langflow
        print("   ✅ langflow imported")

        print("   • Importing main module...")
        from langflow.main import create_app
        print("   ✅ main module imported")

        print("   • Creating application...")
        app = create_app()
        print("   ✅ application created")

        print()
        print("🌐 Starting server...")
        print("   📍 URL: http://127.0.0.1:7860")
        print("   🎯 Your enhanced Langflow is starting...")
        print()

        # Start the server
        import uvicorn
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=7860,
            log_level="info",
            access_log=True
        )

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())

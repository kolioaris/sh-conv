import json
import os
import subprocess
import sys


def ask(question: str, default: str) -> str:
    answer = input(f"{question} [{default}]: ").strip()
    return answer if answer else default


def main():
    print("\n███████╗██╗  ██╗       ██████╗ ██████╗ ███╗   ██╗██╗   ██╗\n██╔════╝██║  ██║      ██╔════╝██╔═══██╗████╗  ██║██║   ██║\n███████╗███████║█████╗██║     ██║   ██║██╔██╗ ██║██║   ██║\n╚════██║██╔══██║╚════╝██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝\n███████║██║  ██║      ╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ \n╚══════╝╚═╝  ╚═╝       ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝\n\n")

    frontend_port = ask("Frontend port", "5353")
    backend_port = ask("Backend port", "5352")

    print("\nFor 'host', use:")
    print("  0.0.0.0   → accessible from other devices on your network")
    print("  127.0.0.1 → only accessible from this machine\n")
    host = ask("Host", "0.0.0.0")

    print("\nFor 'api_base', this is the URL the frontend uses to reach the backend.")
    print(f"→  If running locally:     http://localhost:{backend_port}")
    print(f"→  If running on a server: http://YOUR_SERVER_IP:{backend_port}\n")
    api_base = ask("API base URL", f"http://localhost:{backend_port}")

    config = {
        "backend": {
            "host": host,
            "port": int(backend_port)
        },
        "frontend": {
            "host": host,
            "port": int(frontend_port)
        },
        "api_base": api_base
    }

    with open("config.json", "w") as f:
        json.dump(config, f, indent=4)

    print("\n✓ config.json saved")

    compose = f"""services:
  sh-conv:
    build: .
    ports:
      - "{frontend_port}:{frontend_port}"
      - "{backend_port}:{backend_port}"
    volumes:
      - ./data:/app/data
      - ./config.json:/app/config.json
    restart: unless-stopped
    environment:
      - PORT={frontend_port}
      - BACKEND_PORT={backend_port}
"""

    with open("docker-compose.yml", "w") as f:
        f.write(compose)

    print("✓ docker-compose.yml saved")

    build = ask("\nBuild and start now? (yes/no)", "yes")
    if build.lower() in ("yes", "y"):
        print("\nBuilding... this may take a few minutes on first run.\n")
        result = subprocess.run(
            ["docker", "compose", "up", "--build", "-d"],
            cwd=os.getcwd()
        )
        if result.returncode == 0:
            print(f"\n✓ sh-conv is running!")
            print(f"  Open: http://localhost:{frontend_port}")
        else:
            print("\n✗ Build failed. Check the output above.")
            sys.exit(1)
    else:
        print("\nRun 'docker-compose up --build' when ready.")
        print(f"\nOnce running, open: http://localhost:{frontend_port}")


if __name__ == "__main__":
    main()

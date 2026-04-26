import subprocess
import sys
import os

def main():
    if not os.path.exists("docker-compose.yml"):
        print("No docker-compose.yml found. Running setup first...\n")
        result = subprocess.run(["python3", "setup.py"])
        if result.returncode != 0:
            sys.exit(1)
        return

    print("\n██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗███████╗██████╗ \n██╔══██╗██║   ██║████╗  ██║████╗  ██║██╔════╝██╔══██╗\n██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝\n██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗\n██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║███████╗██║  ██║\n╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝\n\n")
    print("1. Start")
    print("2. Rebuild & Start")
    print("3. Stop")
    print("4. View logs")
    print("5. Re-run setup")
    print()

    choice = input("Choice [1]: ").strip() or "1"

    if choice == "1":
        subprocess.run(["docker", "compose", "up", "-d"])
        print("\n✓ sh-conv started!")
        print("Open your browser to check the frontend URL.")
    elif choice == "2":
        subprocess.run(["docker", "compose", "up", "--build", "-d"])
        print("\n✓ sh-conv built and started!")
    elif choice == "3":
        subprocess.run(["docker", "compose", "down"])
        print("\n✓ sh-conv stopped.")
    elif choice == "4":
        subprocess.run(["docker", "compose", "logs", "-f"])
    elif choice == "5":
        subprocess.run(["python3", "setup.py"])
    else:
        print("Invalid choice.")
        sys.exit(1)

if __name__ == "__main__":
    main()

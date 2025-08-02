import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import os

class ScriptChangeHandler(FileSystemEventHandler):
    def __init__(self, target_filename):
        self.target_filename = target_filename

    def on_created(self, event):
        if os.path.basename(event.src_path) == self.target_filename:
            print(f"[CREATED] {self.target_filename} was created.")

    def on_modified(self, event):
        if os.path.basename(event.src_path) == self.target_filename:
            print(f"[MODIFIED] {self.target_filename} was modified.")

    def on_deleted(self, event):
        if os.path.basename(event.src_path) == self.target_filename:
            print(f"[DELETED] {self.target_filename} was deleted.")

def monitor_script(directory_to_watch, filename_to_watch):
    event_handler = ScriptChangeHandler(filename_to_watch)
    observer = Observer()
    observer.schedule(event_handler, directory_to_watch, recursive=False)
    observer.start()
    print(f"🔍 Watching for changes to '{filename_to_watch}' in '{directory_to_watch}'...\nPress Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping monitor...")
        observer.stop()
    observer.join()

if __name__ == "__main__":
    # 🔧 Change these as needed
    path_to_watch = "."  # Current directory
    file_to_watch = "script.py"  # Replace with your friend's script name

    monitor_script(path_to_watch, file_to_watch)

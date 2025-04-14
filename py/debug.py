import os
import json

def get_files_in_directory(dir_path):
	try:
		files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
		return files
	except FileNotFoundError:
		print(f"Error: Directory not found: {dir_path}")
		return None
	except Exception as e:
		print(f"An error occurred: {e}")
		return None

count = 0
file_path = "teamLists"

data = get_files_in_directory(file_path)

for file in data:
	with open(f"{file_path}/{file}", 'r') as f:
		contents = json.load(f)
		count += len(contents['teams'])

print(f"Amount of teams: {count}")
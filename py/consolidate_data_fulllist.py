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


players = []
file_path = "playerInfo"

files = get_files_in_directory(f"{file_path}")
for data in files:
    with open(f"{file_path}/{data}", 'r') as f:
        contents = json.load(f)

        for player in contents['players']:
            players.append(player)

consolidated_data = {
    "players": players
}

with open(f"fullListOfplayers.json", "w") as f:
    json.dump(consolidated_data, f, indent=4)   
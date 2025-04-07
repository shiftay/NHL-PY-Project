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


def consolidate_players(SEASON_ID, data):
	consolidated_data = {	
		"players": data
	}

	with open(f"playerLists/{SEASON_ID}_playerList.json", "w") as f:
		json.dump(consolidated_data, f, indent=4)



file_path = 'yearRosters'

players = []
current_players = []

data = get_files_in_directory(f"{file_path}")
for files in data:
	current_players.clear()
	with open(f"{file_path}/{files}", 'r') as f:
		contents = json.load(f)

		for player in contents['players']:
			if player not in players:
				players.append(player)
				current_players.append(player)
		consolidate_players(contents['seasonId'],current_players)	


print(f"Player Amount: {len(players)}")		


# consolidate_players(players)
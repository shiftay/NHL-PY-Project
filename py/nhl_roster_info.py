import requests
import json
import os
import time
import random
#time.sleep({seconds})
# Best to run a variable amount, randomly setting seconds every other iteration
#import random
#random.randint(min,max)

#TODO 	Send in the information from filepath
#		Read in information into a variable
#		If player id is already in the information skip it.
def parseinfo(data):
	players = []

	for player in data['forwards']:
		player = { "id": player['id'], 
					"name": player['firstName']['default'] + " " + player['lastName']['default']
					}
		players.append(player)

	for player in data['defensemen']:
		player = { "id": player['id'], 
					"name": player['firstName']['default'] + " " + player['lastName']['default']
					}
		players.append(player)

	for player in data['goalies']:
		player = { "id": player['id'], 
					"name": player['firstName']['default'] + " " + player['lastName']['default']
					}
		players.append(player)

	# print(players)
	player_data = {
		"players": players
	}
	return player_data



def get_nhl_roster(TEAM_ABBR, SEASON_ID):
	base_url = f"https://api-web.nhle.com/v1/roster/{TEAM_ABBR}/{SEASON_ID}"

	headers = { "User-Agent": "Mozilla/5.0" }

	response = requests.get(base_url, headers=headers)
	if response.status_code != 200:
	    print(f"Failed to retrieve data for {TEAM_ABBR} in the season: {SEASON_ID}")
	    return None

	data = response.json()


	with open(f"rosterLists/{SEASON_ID}/{TEAM_ABBR}.json", "w") as f:
		json.dump(parseinfo(data), f, indent=4)


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

filepath = "teamLists"
data = get_files_in_directory(filepath)
seconds = random.randint(5,10)
count = 0
time_started = time.time()
# Uncomment when ready to create full files.
# Comprehensive list estimates that it will take ~4 hours to put together the full list
for files in data:
	with open(f"{filepath}/{files}", 'r') as f:
		contents = json.load(f)
		# Make the folder to hold the output
		try:
			os.mkdir(f"rosterLists/{contents['seasonId']}")
		except FileExistsError:
		    print(f"Folder 'rosterLists/{contents['seasonId']}' already exists.")
		    continue
		except FileNotFoundError:
		    print("Path specified is invalid.")
		except Exception as e:
		    print(f"An error occurred: {e}")

		length = len(contents['teams'])
		print(f"Creating {contents['seasonId']} - Time Estimate: {length * 5} ~ {length * 10}")
		for teamAbbrev in contents['teams']:
			get_nhl_roster(teamAbbrev, contents['seasonId'])
			time.sleep(seconds)
			seconds = random.randint(5,10)
			count += 1
		if count > 0:
			break


print(f"It took {time.time() - time_started} to complete.")
		# print(len(contents['teams']))
# filepath = "players.json"
# get_nhl_roster("WSH", 20232024)



# DEBUG
# with open("teamLists/19901991_teamlist.json", 'r') as f:
	# contents = json.load(f)
	# for teamAbbrev in contents['teams']:
	# 	get_nhl_roster(teamAbbrev, contents['seasonId'])
	# 	time.sleep(seconds)
	# 	seconds = random.randint(5,10)
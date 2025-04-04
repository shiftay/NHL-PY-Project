import requests
import json
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

	print(players)

	return players



def get_nhl_roster(TEAM_ABBR, SEASON_ID):
	base_url = f"https://api-web.nhle.com/v1/roster/{TEAM_ABBR}/{SEASON_ID}"

	headers = { "User-Agent": "Mozilla/5.0" }

	response = requests.get(base_url, headers=headers)
	if response.status_code != 200:
	    print(f"Failed to retrieve data for player {player_id}")
	    return None

	data = response.json()


	with open(f"{TEAM_ABBR}_{SEASON_ID}.json", "w") as f:
		json.dump(parseinfo(data), f, indent=4)


filepath = "players.json"
get_nhl_roster("BOS", 20232024)
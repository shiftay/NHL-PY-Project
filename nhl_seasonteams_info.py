import requests
import json

#import time
#time.sleep({seconds})
# Best to run a variable amount, randomly setting seconds every other iteration
#import random
#random.randint(min,max)


def get_nhl_season_info(SEASON_ID):
	#https://api-web.nhle.com/v1/standings/2024-04-03
	base_url = f"https://api-web.nhle.com/v1/standings/{SEASON_ID[-4:]}-04-03"

	headers = {
	    "User-Agent": "Mozilla/5.0"
	}

	response = requests.get(base_url, headers=headers)
	if response.status_code != 200:
	    print(f"Failed to retrieve data for season: {SEASON_ID}")
	    return None

	data = response.json()

	teams_data = []
	for teams in data['standings']:
		teams_data.append(teams['teamAbbrev']['default'])

	player_data = {	
		"seasonId": SEASON_ID,
		"teams": teams_data
	}

	with open(f"teamLists/{SEASON_ID}_teamlist.json", "w") as f:
		json.dump(player_data, f, indent=4)


season_id = "20222023"
get_nhl_season_info(season_id)
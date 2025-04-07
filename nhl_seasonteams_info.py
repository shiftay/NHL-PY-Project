import requests
import json
import time
import random
#time.sleep({seconds})
# Best to run a variable amount, randomly setting seconds every other iteration

#random.randint(min,max)

#NHL 	20122013 Jan 20
#		19941995 Jan 20

# To compile a comprehensive list of all the teams for ~50 years it will take ~4 hours
def get_nhl_season_info(SEASON_ID):
	#https://api-web.nhle.com/v1/standings/2024-04-03
	base_url = f"https://api-web.nhle.com/v1/standings/{SEASON_ID[-4:]}-01-22"

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

# years = ['19751976', '19761977', '19771978', '19781979', '19791980', '19801981', '19811982', 
# '19821983', '19831984', '19841985', '19851986', '19861987', '19871988', '19881989', 
# '19891990', '19901991', '19911992', '19921993', '19931994', '19941995', '19951996', 
# '19961997', '19971998', '19981999', '19992000', '20002001', '20012002', '20022003', 
# '20032004', '20042005', '20052006', '20062007', '20072008', '20082009', '20092010', 
# '20102011', '20112012', '20122013', '20132014', '20142015', '20152016', '20162017', 
# '20172018', '20182019', '20192020', '20202021', '20212022', '20222023', '20232024', 
# '20242025']

years = ['20202021']

seconds = random.randint(5,10)
#Comprehensive list estimates that it will take ~8 minutes to put together the full list
for season in years:
	get_nhl_season_info(season)
	time.sleep(seconds)
	seconds = random.randint(5,10)


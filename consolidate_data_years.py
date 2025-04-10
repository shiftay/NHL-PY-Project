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


def consolidate_year(SEASON_ID, data):

	consolidated_data = {	
		"seasonId": SEASON_ID,
		"players": data
	}

	with open(f"yearRosters/{SEASON_ID}.json", "w") as f:
		json.dump(consolidated_data, f, indent=4)



years = [
'20242025']
# '19751976', '19761977', '19771978', '19781979', '19791980', '19801981', '19811982', 
# '19821983', '19831984', '19841985', '19851986', '19861987', '19871988', '19881989', 
# '19891990', '19901991', '19911992', '19921993', '19931994', '19941995', '19951996', 
# '19961997', '19971998', '19981999', '19992000', '20002001', '20012002', '20022003', 
# '20032004', '20042005', '20052006', '20062007', '20072008', '20082009', '20092010', 
# '20102011', '20112012', '20122013', '20132014', '20142015', '20152016', '20162017', 
# '20172018', '20182019', '20192020', '20202021', '20212022', '20222023', '20232024', 
file_path = 'rosterLists'

players = []
yearplayers = []

for year in years:
	data = get_files_in_directory(f"{file_path}/{year}")
	yearplayers.clear()
	for files in data:
		with open(f"{file_path}/{year}/{files}", 'r') as f:
			contents = json.load(f)

			for player in contents['players']:
				if player not in players:
					players.append(player)
					yearplayers.append(player)

			consolidate_year(year, yearplayers)



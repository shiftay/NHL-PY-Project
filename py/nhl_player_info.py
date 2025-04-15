import requests
import json
import os
import random
import time

# Setting up clearing of the console, incase I want to do a progress report
# clear = lambda: os.system('cls')

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

def parseinfo(info):
    # Seasons Played and Team
    # TODO: Include Junior / System teams (OHL, QMJHL, WHL, etc..)
    # Exlcuding Factors: 
    #   Need to find other players to test what type of output they release
    #   Potentially from each continents
    exclusion = {   "WC", 'WJ18-A', 'WJC-A', 'WCup', '4 Nations', 'WC-A', 
                    'M-Cup', 'Olympics', 'EYOF', 'W-Cup', 'EHT' }
    season_totals = []
    for seasons in info['seasonTotals']:
        if seasons['leagueAbbrev'] not in exclusion:
            season = {
                "season": seasons['season'],
                "league": seasons['leagueAbbrev'],
                "teamName": seasons['teamName']['default']
            }
            if season not in season_totals:
                season_totals.append(season)

    # Awards and Seasons Awarded
    awards = []
    if "awards" in info: # Checks if player has won any awards
        for award in info['awards']:
            seasons = []
            # print(award['trophy']['default'])
            for s in award['seasons']:
                season = { "seasonId": s['seasonId'] }
                seasons.append(season)
            trophy = { "trophyName": award['trophy']['default'],
                        "seasons": seasons }
            awards.append(trophy)

    #Compile Player Information
    draftInfo = {}
    if "draftDetails" in info:
        draftInfo = {   "year": info['draftDetails']['year'],
                        "round": info['draftDetails']['round'],
                        "pick": info['draftDetails']['pickInRound'],
                        "team": info['draftDetails']['teamAbbrev']
                    }

    player_data = {
        "playerId": info['playerId'],
        "name": info['firstName']['default'] + " " + info['lastName']['default'],
        "currentTeamAbbrev": info['currentTeamAbbrev'] if "currentTeamAbbrev" in info else 'N/A',
        "sweaterNumber": info['sweaterNumber'] if "sweaterNumber" in info else 'N/A',
        "position": info['position'] if "position" in info else 'N/A',
        "headshot": info['headshot'] if "headshot" in info else 'N/A',
        "heightInInches": info['heightInInches'] if "heightInInches" in info else 'N/A',
        "birthCountry": info['birthCountry'] if "birthCountry" in info else 'N/A',
        "birthDate": info['birthDate'] if "birthDate" in info else 'N/A',
        "draftDetails": draftInfo,
        "seasonsPlayed": season_totals,
        "awards": awards,
    }
    
    return player_data

def get_nhl_player_details(player_id):
    base_url = f"https://api-web.nhle.com/v1/player/{player_id}/landing"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(base_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to retrieve data for player {player_id}")
        return None

    data = response.json()
    return parseinfo(data)


# Comprehensive list estimates that it will take ~9 hours to put together the full list
# Under the assumption that there would be 0 duplicates, as such the number is significantly lower
# TODO  We will need to check ids of players against ids of players already stored, as such,
#       we will need to store the player id in our mockup of players
# Example usage
completed_info = []
seconds = random.randint(5,10)

file_path = '20242025_playerlist.json'

time_elapsed = time.time()

# data = get_files_in_directory(file_path)

progress = ''

# for files in data:
seasonId = file_path[:8]
with open(f"{file_path}", 'r') as f:
    contents = json.load(f)
    # try:
    #     os.mkdir(f"playerInfo/{seasonId}")
    # except FileExistsError:
    #     print(f"Folder 'playerInfo/{seasonId}' already exists.")
    #     # continue
    # except FileNotFoundError:
    #     print("Path specified is invalid.")
    # except Exception as e:
    #     print(f"An error occurred: {e}")

    print(f"\nEstimated Time for {seasonId} is approx. {round((len(contents['players']) * 10) / 60, 2)} minutes. Gathering information for {len(contents['players'])} players.")

    for players in contents['players']:
        completed_info.append(get_nhl_player_details(players['id']))

        # current_step = contents['players'].index(players) / (len(contents['players']) + 1) 
        if contents['players'].index(players) % 10 == 0: 
            progress += '.'
            print(f"Progress: { (contents['players'].index(players) / len(contents['players'])) * 100}")
        time.sleep(seconds)
        seconds = random.randint(5,10)
    # break;


final_info = {
    "seasonId": seasonId,
    "players": completed_info
}

with open(f"playerInfo/{seasonId}/{seasonId}_players.json", "w") as f:
    json.dump(final_info, f, indent=4)

print(f"It took {round((time.time() - time_elapsed)/60)} minutes to complete request")
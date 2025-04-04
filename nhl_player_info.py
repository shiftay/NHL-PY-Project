import requests
import json
import os
import random
import time

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
    player_data = {
        "playerId": info['playerId'],
        "name": info['firstName']['default'] + " " + info['lastName']['default'],
        "sweaterNumber": info['sweaterNumber'],
        "position": info['position'],
        "headshot": info['headshot'],
        "heightInInches": info['heightInInches'],
        "birthCountry": info['birthCountry'],
        "draftDetails": {"year": info['draftDetails']['year'],
                         "round": info['draftDetails']['round'],
                         "pick": info['draftDetails']['pickInRound'],
                         "team": info['draftDetails']['teamAbbrev']},
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


def contains_info(content, playerId):
    for contents in content:
        if contents['playerId'] == playerId:
            return False

    return True


# Comprehensive list estimates that it will take ~93 hours to put together the full list
# Under the assumption that there would be 0 duplicates, as such the number is significantly lower
# TODO  We will need to check ids of players against ids of players already stored, as such,
#       we will need to store the player id in our mockup of players
# Example usage
completed_info = []
seconds = random.randint(5,10)

file_path = 'rosterLists'

data = get_files_in_directory(file_path)
for files in data:
    with open(f"{file_path}/{files}", 'r') as f:
        contents = json.load(f)
        for players in contents['players']:
            if contains_info(completed_info, players['id']):
                completed_info.append(get_nhl_player_details(players['id']))
                time.sleep(seconds)
                seconds = random.randint(5,10)

final_info = {
    "players": completed_info
}
# player_id = 8478233
# player_data = get_nhl_player_details(player_id)

with open(f"completed.json", "w") as f:
    json.dump(final_info, f, indent=4)
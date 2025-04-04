import requests
import json

def parseinfo(info):
    # Seasons Played and Team
    # TODO: Include Junior / System teams (OHL, QMJHL, WHL, etc..)
    season_totals = []
    for seasons in info['seasonTotals']:
        if seasons['leagueAbbrev'] == 'NHL':
            season = {
                "season": seasons['season'],
                "teamName": seasons['teamName']['default']
            }
            if season not in season_totals:
                season_totals.append(season)

    # Awards and Seasons Awarded
    awards = []
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
        "seasonTotals": season_totals,
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


# Example usage
player_id = 8473419  # Connor McDavid
player_data = get_nhl_player_details(player_id)

with open(f"{player_id}.json", "w") as f:
    json.dump(player_data, f, indent=4)
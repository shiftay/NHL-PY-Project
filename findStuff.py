import os
import json

file_path = "fullListOfplayers.json"


with open(f"{file_path}", 'r') as f:
    contents = json.load(f)

    found = []
#-----------------------------------------------------------------------------------------------
    # Multiple MVPS
    # for players in contents['players']:
    #     for awards in players['awards']:
    #         if awards['trophyName'] == 'Hart Memorial Trophy' and len(awards['seasons']) > 1:
    #             found.append(players)
    # for players in found:
    #     print(f"Name: {players['name']} has won more than 1 MVPs")
#-----------------------------------------------------------------------------------------------
    # Rookie of the Year
    # for players in contents['players']:
    #     for awards in players['awards']:
    #         if awards['trophyName'] == 'Calder Memorial Trophy':
    #             found.append(players)

    # for players in found:
    #     print(f"Name: {players['name']} has won RotY")    
#-----------------------------------------------------------------------------------------------
    # Won more than 5 cups
    # for players in contents['players']:
    #     for awards in players['awards']:
    #         if awards['trophyName'] == 'Stanley Cup' and len(awards['seasons']) > 5:
    #             found.append(players)

    # for players in found:
    #     print(f"Name: {players['name']} has won more than 5 Cups")
#-----------------------------------------------------------------------------------------------
    # Height > 6'8
    # for players in contents['players']:
    #     if players['heightInInches'] >= 80:
    #         found.append(players)

    # for players in found:
    #     print(f"Name: {players['name']} Height: {players['heightInInches']}")
#-----------------------------------------------------------------------------------------------
    # First Round Pick
    # for players in contents['players']:
    #     if players['draftDetails']['round'] is 1 and players['draftDetails']['pick'] is 1:
    #         found.append(players)

    # for players in found:
    #     print(f"Name: {players['name']} is a First Overall Pick\n")
#-----------------------------------------------------------------------------------------------
    # Sweater Number Search
    # sweaterNum = int(input('Player number to look for? '))

    # for players in contents['players']:
    #     if players['sweaterNumber'] is sweaterNum:
    #         found.append(players)
    
    # for players in found:
    #     print(f"Name: {players['name']} Sweater#: {sweaterNum} \n")
#-----------------------------------------------------------------------------------------------
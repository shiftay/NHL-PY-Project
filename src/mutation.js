// 1. Define your GraphQL mutation
const guess = /* GraphQL */ `
  mutation TakeAction($gameID: ID!, $playerID: ID!, $guessID: ID!) {
    correctGuess(gameID: $gameID, playerID: $playerID, guessID: $guessID) {
      id
      players {
        id
        name
        rank
      }
      currentPlayerID
      gameStatus
      guesses {
        playerID
        guessID
      }
    }
} 
`;

// 3. Execute the mutation using Amplify's API client
export async function sendGuess(client, _gameID, _playerID, _guessID) {
  try {
    console.log(`${_gameID} | ${_playerID} | ${_guessID}`);
    const response = await client.graphql({
      query: guess,
      variables: {
        gameID: _gameID,
        playerID: _playerID,
        guessID: _guessID,
      },
    });

    if (response.errors) {
      console.error('Mutation error:', response.errors);
      return; // Stop processing if there's an error
    }

    const updatedGame = response.data?.takeAction;
    if (updatedGame) {
      console.log('Successfully took action:', updatedGame);
      // Handle the updated game data (e.g., update UI)
    }
  } catch (error) {
    console.error('Failed to take action:', error);
  }
}

const lookforGame = `
mutation LookForExistingGame($player: PlayerInput!) {
  lookForGame(player: $player) {
    statusCode
    body
  }
}
`;

export async function joinQueue(client, playerId, name, playerRank, logo) {
    try {

        console.log(`${playerId} | ${name} | ${playerRank}`);


        console.log("TRYING TO RUN A MUTATION");
        const response = await client.graphql({
            query: lookforGame,
            variables: {
                player: {
                  id: playerId,
                  name: name,
                  rank: playerRank,
                  logo: logo
                }
            }
        });

        if (response.errors) {
            console.error('Mutation error:', response.errors);
            return; // Stop processing if there's an error
        }

        console.dir(response);

        const updatedGame = response.data?.lookforGame;
        if (updatedGame) {
        console.log('Successfully took action:', updatedGame);
        // Handle the updated game data (e.g., update UI)
        }


    } catch (error) {
        console.error('Failed to take action:', error);
    }
}


const actionQL = /* GraphQL */ `
  mutation TakeAction($gameID: ID!, $playerID: ID!, $actionID: ID!,$guessID: ID!) {
    actionTaken(gameID: $gameID, playerID: $playerID, actionID: $actionID, guessID: $guessID) {
      gameID,
      playerID,
      actionID,
      guessID
    }
  } 
`;


export async function takeAction(client, _gameID, _playerID, _actionID, _guessID) {
  try {
    console.log(`${_gameID} | ${_playerID} | ${_guessID}`);
    const response = await client.graphql({
      query: actionQL,
      variables: {
        gameID: _gameID,
        playerID: _playerID,
        actionID: _actionID,
        guessID: _guessID
      },
    });

    if (response.errors) {
      console.error('Mutation error:', response.errors);
      return; // Stop processing if there's an error
    }

    const updatedGame = response.data?.takeAction;
    if (updatedGame) {
      console.log('Successfully took action:', updatedGame);
      // Handle the updated game data (e.g., update UI)
    }
  } catch (error) {
    console.error('Failed to take action:', error);
  }
}
// 4. Call the function to execute the mutation
// performAction();
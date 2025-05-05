import { Amplify, API, graphqlOperation } from 'aws-amplify';
import  { config } from './aws-exports';

// Configure Amplify (if you haven't already)
Amplify.configure({ config
  // aws_appsync: {
  //   aws_appsync_graphqlEndpoint: 'YOUR_APPSYNC_ENDPOINT', // Replace with your AppSync endpoint
  //   aws_appsync_region: 'YOUR_REGION',           // Replace with your AWS region
  //   aws_appsync_authenticationType: 'YOUR_AUTH_TYPE', // Replace with your authentication type (e.g., 'API_KEY', 'AWS_IAM', 'AMAZON_COGNITO_USER_POOLS')
  //   aws_appsync_apiKey: 'YOUR_API_KEY',             // Replace with your API key (if using API_KEY)
  // },
});

// GraphQL subscription query
const subscriptionQuery = `
  subscription OnGameStarted {
    onGameStarted {
      id
      gameStatus
      currentPlayerID
      players {
        id
      }
    }
  }
`;

// Function to set up the subscription
async function subscribeToGameStarted() {

  console.log("HELLLO???");
  try {
    const subscription = API.graphql(graphqlOperation(subscriptionQuery)).subscribe({
      next: (data) => {
        // This function will be called every time a new game is started
        const newGame = data.value.data.onGameStarted;
        console.log('New game started:', newGame);
        // Update your UI or application state with the new game data
        // displayNewGame(newGame); // Call a function to handle the new game data
        // TODO: SUBSCRIBE TO GAMEUPDATED AND SETUP GAME.
        displayNewGame(gameData);
      },
      error: (error) => {
        console.error('Error subscribing to onGameStarted:', error);
        // Handle errors, such as showing a message to the user
      },
      complete: () => {
        console.log('Subscription to onGameStarted is complete.');
        // Handle completion (optional)
      },
    });

    // You can store the subscription object if you need to unsubscribe later
    // For example:  this.gameStartedSubscription = subscription;

  } catch (error) {
    console.error("Failed to subscribe", error);
  }
}

function displayNewGame(gameData) {
    // Example implementation: Update a list, show a modal, etc.
    console.log("Displaying new game", gameData);
    // const gameList = document.getElementById('game-list'); // Get a container
    // if (gameList) {
    //   const gameElement = document.createElement('div');
    //   gameElement.textContent = `Game ID: ${gameData.id}, Status: ${gameData.gameStatus}, Current Player: ${gameData.currentPlayerID}`;
    //   gameList.appendChild(gameElement);
    // }
}

// Call the function to start the subscription
// subscribeToGameStarted();

// If you need to unsubscribe later (e.g., when a component unmounts)
// if (this.gameStartedSubscription) {
//   this.gameStartedSubscription.unsubscribe();
// }


//  Make sure you have this
async function invokeLambdaFunction(data) {
  const apiEndpoint = 'YOUR_API_GATEWAY_ENDPOINT'; // Replace with your API Gateway endpoint
  const requestBody = JSON.stringify(data);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST', // Or 'GET', 'PUT', etc., depending on your API Gateway configuration
      headers: {
        'Content-Type': 'application/json',
        //  Add any other necessary headers, such as authorization headers
      },
      body: requestBody, //  Include a body for POST, PUT, etc.
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Lambda function response:', responseData);
    return responseData; //  Return the data from the Lambda function
  } catch (error) {
    console.error('Failed to invoke Lambda function:', error);
    throw error; //  Re-throw the error to be handled by the caller
  }
}
// Example of calling the Lambda function to start the matchmaking process
const dataToSend = {
  playerId: 'player123', //  Replace with the actual player ID
};
  
invokeLambdaFunction(dataToSend)
.then((response) => {
  console.log('Lambda response:', response);
  //  The Lambda function will return the gameId.  The subscription will
  //  handle the actual game start notification.
})
.catch((error) => {
  console.error('Error calling Lambda:', error);
});

const subQL = /* GraphQL Subscription Query */ `
subscription OnGameStarted {
  onGameStarted {
    id
    players {
      id
      name
      rank
    }
    currentPlayerID
    gameStatus
    actions {
      playerID
      guessID
      timestamp
    }
  }
}
`;


/* TODO
 
when joining queue, have each player assign a 'starting lineup' player with them

when game starts
	> whoever is player one plays off of their randomly assigned starting lineup
	> Players are subscribed to the GameStatusUpdated subscription

	> Based on turn, disable / enable the search bar
		> Hide submit button

Gameplay stuff:
	When a person plays a player
		> Logic decides if it is a correct player
		> sends the action to the takeAction mutator
		> IF:
			> INCORRECT  flash the no connection found (pop up)
			> CORRECT    play the connection, and swap to other player

	// Might redefine take Action, to send Connections, for easier grabbing of information for player.
	takeAction(Action, bool)
		> Action : PlayerID, Player, GuessID
		> bool : was it correct
			> IF:
				CORRECT : Change currentplayer
				INCORRECT : no update

	Basic look of HTML:

	<div id=hockey-card></div>
	<div id=seperator></div>
	<div id=connector></div> [ Connector will show: TEAM / Country / Award ] [ Can have multiple Connectors ] [ Include Strikes amount ]
	<div id=seperator></div>
	<div id=hockey-card></div>


	On correct action:
		Add to List of [ Connectors ]

  Make sure to unsubscribe after losing / leaving site.

*/


export function subscribeOnGameStarted(client) {
  console.log("we're subscribing");
  const subscription = client.graphql({
      query: subQL
    }).subscribe({
        next: (data) => {
            // This function will be called every time a new game is started
            // and the data will contain the game information.
            console.dir(data);
            // const gameData = data.value.data.onGameStarted;
            // console.log('New game started:', gameData);
            //  Update your UI or game state here, based on the new game data.
        },
        error: (error) => {
            console.warn('Error in subscription:', error);
            // Handle any errors that occur during the subscription.  You might want to
            // display an error message to the user or attempt to reconnect.
        },
        complete: () => {
            console.log('Subscription completed');
            //  This is called if the subscription is terminated by the server.
            //  AppSync subscriptions typically do not complete.
        },
    });

    // The subscribe() method returns a subscription object.  You can use this
    // object to unsubscribe later if needed.  For example, if the user leaves the
    // game lobby or the component is unmounted in a React application.
    return subscription;
}


// To unsubscribe later (VERY important to prevent memory leaks):
// subscriptionInstance.unsubscribe();
// Call the function to set up the subscription
// const unsubscribe = setupSubscription();

// Optional:  If you have a mechanism to "stop" the subscription (e.g., a button)
// you can call the unsubscribe function.  For example:
// document.getElementById('stop-subscription-button').addEventListener('click', () => {
//     unsubscribe();  // Call the unsubscribe function
// });

const subQL = /* GraphQL Subscription Query */ `
subscription OnGameStarted {
  onGameStarted {
    id
    players {
      id
      name
      rank
      logo
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




export function subscribeOnGameStarted(client, _playerID, gameStartedSubject) {
  console.log(`we're subscribing ${_playerID}`);
  const subscription = client.graphql({
      query: subQL,
    }).subscribe({
        next: (data) => {
            // This function will be called every time a new game is started
            // and the data will contain the game information.
            console.dir(data);
            gameStartedSubject.next(data);
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



const actionQL = /* GraphQL Subscription Query */ `
subscription OnActionTaken {
  onActionTaken {
    gameID
    playerID
    actionID
    guessID
  }
}
`;

export function subscribeToActions(client, _gameID, actionSubject) {
  const subscription = client.graphql({
      query: actionQL,
      variables: {
        gameID: _gameID
      },
    }).subscribe({
        next: (data) => {
            // This function will be called every time a new game is started
            // and the data will contain the game information.
            console.dir(data);
            gameStartedSubject.next(data);
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


const gameStatUpdateQL = /* GraphQL Subscription Query */ `
subscription OnGameStateUpdatedSubscription($id: ID!) {
  onGameStateUpdated(id: $id){
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

export function subscribeToUpdates(client, _gameID, updateSubject) {
  const subscription = client.graphql({
      query: gameStatUpdateQL,
      variables: {
        id: _gameID
      },
    }).subscribe({
        next: (data) => {
            // This function will be called every time a new game is started
            // and the data will contain the game information.
            console.dir(`updates: ${data}`);
            updateSubject.next(data);
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

const subscription = /* GraphQL Subscription Query */ `
  subscription OnGameStarted {
    onGameStarted {
      gameId
      startTime
      # other fields
    }
  }
`;


export function subscribeOnGameStarted(client) {
    client
    .graphql({
        query: subscription
    })
    .subscribe({
        next: ({ data }) => console.log(data),
        error: (error) => console.warn(error)
    });


    // const subscriptionObservable = GraphQLSubscriptions.subscribe(client, { query: subscription });

    // const subscriptionInstance = subscriptionObservable.subscribe({
    //     next: (response) => {
    //         const gameStartedData = response.data.onGameStarted;
    //         console.log('Received data:', gameStartedData);
    //         // Handle the data (e.g., update the UI)
    //     },
    //     error: (error) => {
    //         console.error('Subscription error:', error);
    //     },
    //     complete: () => {
    //         console.log('Subscription completed');
    //     },
    // });

    // return subscriptionInstance;
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

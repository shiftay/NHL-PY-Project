import { subscribeOnGameStarted } from './subscription_2.js';
import { performAction } from './mutation.js'
import { generateClient } from 'aws-amplify/api';
import config from './aws-exports';
import { Amplify } from 'aws-amplify';


export function initializeAWS() {
    Amplify.configure(config);

    return generateClient();
}

export function gameStartedSub(client) {
    subscribeOnGameStarted(client);
}


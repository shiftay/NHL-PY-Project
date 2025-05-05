import { subscribeOnGameStarted } from './subscription_2.js';
import { joinQueue } from './mutation.js'
import { generateClient } from 'aws-amplify/api';
import config from './aws-exports';
import { Amplify } from 'aws-amplify';
import { v4 } from 'uuid'


export function initializeAWS() {
    Amplify.configure(config);

    return generateClient();
}

export function gameStartedSub(client) {
    subscribeOnGameStarted(client);
}

export function queueforGame(client, playerId, playerName, rank) {
    joinQueue(client, playerId, playerName, rank);
}

export function uuid() {
    return v4();
}

import { subscribeOnGameStarted, subscribeToActions, subscribeToUpdates } from './subscription_2.js';
import { joinQueue, sendGuess } from './mutation.js'
import { generateClient } from 'aws-amplify/api';
import config from './aws-exports';
import { Amplify } from 'aws-amplify';
import { v4 } from 'uuid'
import { Subject } from 'rxjs'; // Import Subject from RxJS

export const gameStartedSubject = new Subject();
export const actionSubject = new Subject();
export const updateSubject = new Subject();

export function initializeAWS() {
    Amplify.configure(config);

    return generateClient();
}

export function gameStartedSub(client, playerId) {
    return subscribeOnGameStarted(client, playerId, gameStartedSubject);
}

export function queueforGame(client, playerId, playerName, rank, logo) {
    joinQueue(client, playerId, playerName, rank, logo);
}

export function updateGuess(client, gameId, playerId, guessId) {
    sendGuess(client, gameId, playerId, guessId);
}

export function updatesSub(client, gameId) {
    return subscribeToUpdates(client, gameId, updateSubject);
}


export function actionSub(client, gameId) {
    return subscribeToActions(client, gameId, actionSubject);
}


export function uuid() {
    return v4();
}

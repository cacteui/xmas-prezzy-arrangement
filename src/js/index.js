import data from '../data/data.json';
import { viewElements } from './base.js';

const state = {
    data: data,
    participants: [],
    currentYear: new Date().getFullYear()
};

const addInitialReceivers = () => {
    const participants = [...state.data.participants];

    // Add receiverIds to participant
    for (let participant of participants) {
        participant["givesPrezzyTo"] = participant.id + 1;
    }

    participants[participants.length - 1]["givesPrezzyTo"] = 1;

    state.participants = participants;
}

// Create a list of participants and the participant they should give a prezzy and view it
const insertPrezzyList = participants => {
    let list = ``;
    
    for (let participant of participants) {
        const receiver = participants.find(receiver => receiver.id === participant.givesPrezzyTo);
        list += `
            <li class="list__item">
                <span class="list__item--giver">
                        <span class="list__item--giver-text">${participant.name}</span>
                </span> gives present to <span class="list__item--receiver">
                        <span class="list__item--receiver-text">${receiver.name}</span>
                </span>
            </li>`;
    };

    viewElements.list.innerHTML = list;
};

// Insert options to the years select
const insertYearOptions = () => {
    const currentYear = state.currentYear;

    for (let i = 0; i <= state.data.yearsToSeeInFuture; i++) {
        const year = currentYear + i;
        const option = `<option value="${year}">${year}</option>`;
        viewElements.selectYear.insertAdjacentHTML('beforeend', option);
    }
};

const updateReceivers = (year, participants) => {
    let newParticipants = [];

    // Get the original year from data and the selected year to find the difference
    const yearDifference = year - state.data.originalYear;

    // A participant cannot give himself/herself a present - therefore we need to jump every year this will happen, which is the participants array length - 1
    const amountOfJumps = Math.floor(yearDifference / (participants.length - 1));
    

    // Loop through the array to find the participant's reciever
    for (let participant of participants) {
        // Add the year difference to the receiverId to find the receiver for that year
        let receiverId = participant.givesPrezzyTo + yearDifference;

        // Avoid the situation that a participant gives present to himself/herself
        if (amountOfJumps > 0) receiverId = receiverId + amountOfJumps;

        // If the receiverId is bigger than the length of the participants array (and therefore bigger than any receiver IDs) the length should be subtracted to find the correct receivers ID. If the receiverID is bigger than twice the array length this should be taken into account to
        if (receiverId > participants.length) {
            const numOfArrLengthsInReceiverId = Math.floor(receiverId / participants.length);
            const remainder = receiverId % participants.length; // To check if the division is clean
            
            // If the receiverId is twice or more the length of the array and it is NOT a clean division
            if (numOfArrLengthsInReceiverId >= 2 && remainder > 0) {
                receiverId = receiverId - participants.length * numOfArrLengthsInReceiverId;
                
            // If the receiverId is twice or more the length of the array and it is a clean division
            } else if (numOfArrLengthsInReceiverId >= 2 && remainder === 0) {
                receiverId = receiverId - participants.length * (numOfArrLengthsInReceiverId - 1);
            } else {
                receiverId = receiverId - participants.length;
            }
        }

        // Create new object with new id to push to new array
        let newParticipant = {
            id: participant.id,
            name: participant.name,
            givesPrezzyTo: receiverId
        }

        newParticipants.push(newParticipant);
    }

    return newParticipants;
}

// When the select is changed
viewElements.selectYear.addEventListener('change', event => {
    // Update the particpant list on the UI
    const updatedParticipants = updateReceivers(event.target.value, state.participants);
    insertPrezzyList(updatedParticipants);
});

// The initial setup on runtime
const init = () => {
    insertYearOptions();
    addInitialReceivers();

    const updatedParticipants = updateReceivers(state.currentYear, state.participants);
    insertPrezzyList(updatedParticipants);
}
init();
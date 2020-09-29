import data from '../data/data.json';
import { viewElements } from './base.js';

const state = {
    data: data,
    participants: [],
};

const giveParticipantReceiver = () => {
    const participants = state.data.participants;
    const currentYear = new Date().getFullYear();

    // Add receiverIds to participant
    for (let participant of participants) {
        participant["givesPrezzyTo"] = participant.id + (currentYear - state.data.originalYear) + 1;
    }

    // Last item should have first participant in array as receiver
    participants[participants.length - 1]["givesPrezzyTo"] = 1;

    // Updating the state to be used in later functions
    state.participants = participants;
}

// TODO: fix issue with the above function not entering the correct receiver for the other years


// Create a list of participants and the participant they should give a prezzy
const createPrezzyList = () => {
    let list = ``;
    
    for (let participant of state.participants) {
        const receiver = state.participants.find(receiver => receiver.id === participant.givesPrezzyTo);
        list += `<li class="list__item"><span class="list__item--giver">${participant.name}</span> gives present to <span class="list__item--receiver">${receiver.name}</span></li>`;
    };

    return list;
};

// View list on UI
const insertPrezzyList = () => {
    viewElements.list.innerHTML = createPrezzyList();
}

// Insert options to the years select
const insertYearOptions = () => {
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= state.data.yearsToSeeInFuture; i++) {
        const year = currentYear + i;
        const option = `<option value="${year}">${year}</option>`;
        viewElements.selectYear.insertAdjacentHTML('beforeend', option);
    }
};

const updateParticipantList = (selectedYear, participants) => {
    let list = ``;
    
    // Get the original year from data and the selected year to find the difference
    const yearDifference = selectedYear - state.data.originalYear;

    // A participant cannot give himself/herself a present - therefore we need to jump every year this will
    // happen, which is the participants array length - 1
    const amountOfJumps = Math.floor(yearDifference / (participants.length - 1));

    // Loop through the array to find the participant's reciever
    for (let participant of participants) {
        // Add the year difference to the receiverId to find the receiver for that year
        let receiverId = participant.givesPrezzyTo + yearDifference;

        // Avoid the situation that a participant gives present to himself/herself
        if (amountOfJumps > 0) receiverId = receiverId + amountOfJumps;

        // If the receiverId is bigger than the length of the participants array (and therefore bigger
        // than any receiver IDs) the length should be subtracted to find the correct receivers ID
        // If the receiverID is bigger than twice the array length this should be taken into account to
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

        // Find the participant to receive present from the participant in the loop and add it to the list
        const receiver = participants.find(receiver => receiver.id === receiverId);
        list += `<li>${participant.name} gives present to ${receiver.name}</li>`;
    }

    return list;
};

// When the select is changed
viewElements.selectYear.addEventListener('change', event => {
    
    // Update the particpant list on the UI
    const updatedParticpantList = updateParticipantList(event.target.value, state.participants)
    viewElements.list.innerHTML = updatedParticpantList;
});

// The initial setup on runtime
const init = () => {
    insertYearOptions();
    giveParticipantReceiver();
    insertPrezzyList();
}
init();
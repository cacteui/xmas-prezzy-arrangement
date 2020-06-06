import data from '../data/data.json';

const elements = {
    giverList: document.querySelector('.list__giver'),
    receiverList: document.querySelector('.list__receiver'),
    selectYear: document.querySelector('.select-year')
};

const state = {
    participants: data.participants,
};

const createList = () => {
    let list = ``;
    
    for (let participant of state.participants) {
        const receiver = state.participants.find(receiver => receiver.id === participant.givesPresentTo);
        list += `<li>${participant.name} gives present to ${receiver.name}</li>`;
    };

    return list;
};

// Insert the list
const insertGiverList = () => {
    elements.giverList.innerHTML = createList();
}

// Create a select of years
const insertYearOptions = () => {
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= data.yearsToSeeInFuture; i++) {
        const year = currentYear + i;
        const option = `<option value="${year}">${year}</option>`;
        elements.selectYear.insertAdjacentHTML('beforeend', option);
    }
};

// When selecting a year change the receiver list
// Make sure that a person can't give prezzies to himself
elements.selectYear.addEventListener('change', event => {
    const participants = state.participants;
    
    // Get the original year from data and the selected year to find the difference
    const originalYear = data.originalYear;
    const year = event.target.value;
    const yearDifference = year - originalYear;

    // A participant cannot give himself/herself a present - therefore we need to jump every year this will
    // happen, which is the participants array length - 1
    const amountOfJumps = Math.floor(yearDifference / (participants.length - 1));
    
    let list = ``;

    for (let participant of participants) {
        // Add the year difference to the receiverId to find the receiver for that year
        let receiverId = participant.givesPresentTo + yearDifference;

        // To avoid the situation that a participant gives present to himself/herself
        if (amountOfJumps > 0) {
            receiverId = receiverId + amountOfJumps;
        }

        // If the receiverId is bigger than the length of the participants array (and therefore bigger
        // than any receiver IDs) the length should be subtracted to find the correct receivers participant ID
        // If the receiverID is bigger than twice the array length this should be taken into account to
        if (receiverId > participants.length) {
            const numOfArrLengthsInReceiverId = Math.floor(receiverId / participants.length);
            const remainder = receiverId % participants.length; // To check if the division is a clean one
            
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

        const receiver = participants.find(receiver => receiver.id === receiverId);
        list += `<li>${participant.name} gives present to ${receiver.name}</li>`;
    }

    elements.giverList.innerHTML = list;
});

// The initial setup on runtime
const init = () => {
    insertYearOptions();
    insertGiverList();
}

init();
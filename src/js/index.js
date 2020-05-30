import people from '../data/people.json';

const elements = {
    giverList: document.querySelector('.list__giver'),
    receiverList: document.querySelector('.list__receiver'),
    selectYear: document.querySelector('.select-year')
};

const state = {
    peopleArr: people,
    receiverList: []
};

// Helper method to insert items to list
const createItemList = (arr, property) => {
    let list = ``;

    for (let item of arr) {
        list += `<li>${item[property]}</li>`;
    }
    
    return list;
}


// Insert the giver list
const insertGiverList = () => {
    elements.giverList.innerHTML = createItemList(people, 'name');
}


// Insert receiver list
const insertReceiverList = () => {
    const peopleArr = state.peopleArr;
    const firstItem = peopleArr[0];
    const remainingItems = peopleArr.slice(1);
    remainingItems.push(firstItem);

    elements.receiverList.innerHTML = createItemList(remainingItems, 'name');
    state.receiverList = remainingItems;
};


// Create select of years
const insertYearOptions = () => {
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= 10; i++) {
        const year = currentYear + i;
        const option = `<option value="${year}">${year}</option>`;
        elements.selectYear.insertAdjacentHTML('beforeend', option);
    }
};

// The initial setup on runtime
const init = () => {
    insertYearOptions();
    insertGiverList();
    insertReceiverList();
}

init();
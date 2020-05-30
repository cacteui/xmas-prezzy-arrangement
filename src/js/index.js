import people from '../data/people.json';

const elements = {
    staticList: document.querySelector('.list__static'),
    dynamicList: document.querySelector('.list__dynamic')
};

// Helper method to insert items to list
const createItemList = (arr, property) => {
    let list = ``;

    for (let item of arr) {
        list += `<li>${item[property]}</li>`;
    }
    
    return list;
}

// Insert the static list of people into document
const insertStaticList = () => {
    const unchangedPeopleList = createItemList(people, 'name');
    elements.staticList.innerHTML = unchangedPeopleList;
}
insertStaticList();

// Insert dynamic list
const insertDynamicList = () => {
    const peopleArr = people;
    const firstItem = peopleArr[0];
    const remainingItems = peopleArr.slice(1);
    remainingItems.push(firstItem);

    elements.dynamicList.innerHTML = createItemList(remainingItems, 'name');
};
insertDynamicList();
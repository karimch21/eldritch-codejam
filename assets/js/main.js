import cards from '/data/mythicCards/index.js'
import ancients from '/data/ancients.js'
import difficulties from '/data/difficulties.js'

const body = document.body;
const container = document.querySelector('.container');
const contentGame = document.querySelector('.content__game');
const gameData = document.querySelector('.game-data');
const shema = document.querySelector('.shema');
let selectedGameData = {};

window.addEventListener('load', () => {
    getDataAncients(ancients);
    createPopUp(difficulties)
})
window.addEventListener('click', windowClickHandler);

function createCardsForAncients(ancient) {
    let li = document.createElement('li');
    li.classList.add('ancient__card', `${ancient.name}`);
    li.dataset.name = ancient.name;

    return li
}

function getDataAncients(ancients) {
    let fragmentsAncients = document.createDocumentFragment();
    let ul = document.createElement('ul');
    ul.classList.add('ancients');

    for (let ancient of ancients) {
        let cardAncient = createCardsForAncients(ancient);
        ul.appendChild(cardAncient);
    }

    fragmentsAncients.appendChild(ul);

    appendingData(contentGame, fragmentsAncients)
}

function appendingData(box, added) {
    box.appendChild(added);
}

function ancientClickHandler(ancient) {
    if (ancient) {
        activePopup()
        let ancientName = ancient.dataset.name;
        selectedGameData.ancient = ancientName;

        addedBasicGameDataAncientName(ancientName)
        return ancientName;
    }
    return
}

function addedBasicGameDataAncientName(ancientName) {
    gameData.innerHTML = '';
    let ancient = document.createElement('div');
    ancient.textContent = 'Имя дренего: ' + ancientName.slice(0, 1).toUpperCase() + ancientName.slice(1);
    gameData.appendChild(ancient);
}

function createBasicGameData(difficulty) {
    let difficultyWrap = document.createElement('div');
    let difficultyText = document.createElement('span');
    let dataFragments = document.createDocumentFragment();

    difficultyWrap.textContent = 'Уровень сложности: ';
    difficultyText.textContent = difficulty.textContent;

    difficultyWrap.appendChild(difficultyText);
    dataFragments.appendChild(difficultyWrap);

    gameData.appendChild(dataFragments)

}

function windowClickHandler(e) {
    let difficulty = e.target.closest('.difficultiy');
    let popup = e.target.closest('.popup');
    let popupWrap = e.target.closest('.popup-wrap');
    let ancient = e.target.closest('.ancient__card');
    let ancientName = ancientClickHandler(ancient);
    let btnKneading = e.target.closest('.btn-kneading');
    ancientHandler(ancient)
    switchClassPopup(popup, difficulty, popupWrap, ancientName);
    deckKneading(btnKneading, selectedGameData);
}

function ancientHandler(ancient) {
    if (!ancient) return
    deleteShema()
    deleteBtnKneading()
}

function activePopup() {
    let popup = document.querySelector('.popup');
    let popupWrap = document.querySelector('.popup-wrap');
    if (!popup && !popupWrap) return
    popup.classList.add('popup--active')
    popupWrap.classList.add('popup-wrap--active')
}

function switchClassPopup(popup, difficulty, popupWrap, ancientName) {
    if (difficulty) {
        selectedGameData.difficulty = difficulty.textContent
        popup.classList.toggle('popup--active')
        popupWrap.classList.toggle('popup-wrap--active')
        createBasicGameData(difficulty, ancientName)
        createBtnKneading(ancients, ancientName)
    }
}

function createPopUp(difficulties) {
    let popupWrap = document.createElement('div');
    let popup = document.createElement('div');
    let popupBody = document.createElement('div');
    let popupDifficulties = document.createElement('div');
    let difficultyHard = document.createElement('div');
    let difficultyNormal = document.createElement('div');
    let difficultyEasy = document.createElement('div');
    let popupTitle = document.createElement('h3');

    popupWrap.classList.add('popup-wrap')
    popup.classList.add('popup');
    popupBody.classList.add('popup__body');
    popupTitle.classList.add('popup__title');
    popupDifficulties.classList.add('popup__difficulties', 'difficulties');
    difficultyHard.classList.add('difficulty__hard', 'difficultiy');
    difficultyNormal.classList.add('difficulty__normal', 'difficultiy');
    difficultyEasy.classList.add('difficulty__easy', 'difficultiy');



    popupTitle.textContent = 'Выберете уровень сложности'
    difficultyHard.textContent = 'Высокий';
    difficultyEasy.textContent = 'Низкий';
    difficultyNormal.textContent = 'Средний'

    popupWrap.appendChild(popup);
    popup.appendChild(popupBody);
    popupBody.appendChild(popupTitle)
    popupBody.appendChild(popupDifficulties);
    popupDifficulties.appendChild(difficultyHard);
    popupDifficulties.appendChild(difficultyNormal);
    popupDifficulties.appendChild(difficultyEasy);

    appendingData(body, popupWrap)
}

function deleteBtnKneading() {
    let btnKneading = document.querySelector('.btn-kneading');
    if (!btnKneading) return
    btnKneading.remove()
}

function createBtnKneading(ancients, ancient) {
    deleteBtnKneading()
    let btnKneading = document.createElement('button');
    btnKneading.classList.add('btn-kneading')
    btnKneading.textContent = 'Замешать колоду';

    appendingData(contentGame, btnKneading);
}

function deckKneading(btnKneading, selectedGameData) {
    if (btnKneading) {

        if (!selectedGameData.ancient) return
        let ancientName = selectedGameData.ancient;
        let newFormAncients = ancients.reduce((obj, element) => {
            obj[element.name] = element;
            return obj
        }, {});
        createSchema(newFormAncients, ancientName);
        deckBuilding(cards, selectedGameData, newFormAncients, difficulties)
    }
    return
}

function deleteShema() {
    let shemaWrap = document.querySelector('.shema-wrap');
    if (!shemaWrap) return
    shemaWrap.remove();
}

function createSchema(newFormAncients, ancientName) {
    deleteShema()
    let shemaWrap = document.createElement('div');
    let table = document.createElement('table');
    shemaWrap.classList.add('shema-wrap')
    table.classList.add('shema');
    let count = 0;

    for (let key in newFormAncients[ancientName]) {
        let keyName = key.toLowerCase();
        let currentAncient = newFormAncients[ancientName];

        if (keyName.endsWith('stage')) {
            let row = document.createElement('tr');
            row.classList.add(key);
            let tdNameStage = document.createElement('td');
            tdNameStage.classList.add(`${key}`, 'shema__name-stage');
            count++;
            tdNameStage.textContent = count + ' Этап';
            row.appendChild(tdNameStage);

            for (let colorCard in currentAncient[key]) {
                let colorName = colorCard.split('Cards')[0];
                let td = document.createElement('td');
                let span = document.createElement('span');
                span.textContent = currentAncient[key][colorCard];
                td.appendChild(span);
                td.classList.add(`${colorName}`);
                row.appendChild(td);
            }
            table.appendChild(row);
            shemaWrap.appendChild(table);
        }
    }

    appendingData(contentGame, shemaWrap)
}

//-----------algoritm kneading-----------
function deckBuilding(cards, selectedGameData, newFormAncients, difficulties) {
    let totalBlueCards = 0;
    let totalBrownCards = 0;
    let totalGreenCards = 0;
    let currentAncient = selectedGameData.ancient;
    let newDifficulties = difficulties.reduce((acc, obj) => {
        acc[obj.name] = obj;
        return acc;
    }, {});
    let currentDifficulty = newDifficulties[selectedGameData.difficulty].id;
    let sortedCards = {};

    if (!currentAncient && !currentDifficulty) return

    let currentDataAncient = newFormAncients[currentAncient];
    for (let key in currentDataAncient) {
        if (key.includes('Stage')) {
            let nameStage = key.split('Stage')[0] + 'Stage';
            let colors = currentDataAncient[nameStage];
            totalGreenCards += colors.greenCards;
            totalBrownCards += colors.brownCards;
            totalBlueCards += colors.blueCards;
        }

    }

    Object.entries(cards).forEach(([key, value]) => {

        sortedCards[key] = value.filter(card => {

            if (card.difficulty == currentDifficulty) return card;
        });
    });

    console.log(sortedCards)

    console.log('============')
    console.log(cards)
    console.log(currentDataAncient, totalBlueCards, totalBrownCards, totalGreenCards)
    console.log(cards)
    console.log(cards, selectedGameData, newFormAncients)
}


//-----------algoritm kneading-----------
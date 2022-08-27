import cards from '/data/mythicCards/index.js'
import ancients from '/data/ancients.js'
import difficulties from '/data/difficulties.js'

const body = document.body;
const container = document.querySelector('.container');
const contentGame = document.querySelector('.content__game');
const gameData = document.querySelector('.game-data');
const shema = document.querySelector('.shema');
let selectedGameData = {};

let countStage = 0;

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

    let blueCards = sortingCard(cards.blueCards, currentDifficulty, totalBlueCards);
    let greenCards = sortingCard(cards.greenCards, currentDifficulty, totalGreenCards);
    let brownCards = sortingCard(cards.brownCards, currentDifficulty, totalBrownCards);
    let mergedSortedCards = mergingTransformingSortedCards(blueCards, greenCards, brownCards)
    let decksByStages = formationDecksForStages(newFormAncients[currentAncient], mergedSortedCards);

    if (!decksByStages) return
    console.log(decksByStages)
    resettingCardOutputCountStage()
    let cardBack = appendBackCard();
    cardBack.addEventListener('click', (e) => {
        getCard(decksByStages)
    })

    console.log(cardBack)
}

function sortingCard(cards, currentDifficulty, totalCards) {
    let cardsIssue = {}
    let count = 0;
    let copyCards = JSON.parse(JSON.stringify(cards));
    let couplesDifficulty = {
        'easy': 'normal',
        'hard': 'normal',
        'normal': ['easy', 'hard']
    }

    for (let i = 0; i < copyCards.length; i++) {
        let randomNum = generateRandomNum(0, cards.length - 1)

        let card = copyCards[randomNum];

        if (card.difficulty === currentDifficulty) {

            if (count === totalCards) break;
            if (!cardsIssue[card.id]) {
                count++;
                cardsIssue[card.id] = card;
            }
        }
    }

    if (count <= totalCards) {
        addingCards(count, cards, couplesDifficulty[currentDifficulty], totalCards, cardsIssue);
    }

    return cardsIssue

}

function addingCards(count, cards, currentDifficulty, totalCards, cardsIssue) {

    if (Array.isArray(currentDifficulty)) {
        let randomNum = generateRandomNum(0, currentDifficulty.length - 1);
        currentDifficulty = currentDifficulty[randomNum]
    }
    for (let i = 0; i < cards.length; i++) {
        let randomNum = generateRandomNum(0, cards.length - 1)

        let card = cards[randomNum];
        if (card.difficulty === currentDifficulty) {
            if (count === totalCards) break
            if (!cardsIssue[card.id]) {
                count++;
                cardsIssue[card.id] = card;
            }
        }
    }

    if (count === totalCards) return cardsIssue
    if (count <= totalCards) {
        addingCards(count, cards, currentDifficulty, totalCards, cardsIssue);
    }
}

function mergingTransformingSortedCards(blueCards, greenCards, brownCards) {
    return {
        'blueCards': Object.values(blueCards),
        'greenCards': Object.values(greenCards),
        'brownCards': Object.values(brownCards)
    }
}

function formationDecksForStages(dataAncient, mergedSortedCards) {
    let decksByStages = {};
    for (let key in dataAncient) {
        if (key.includes('Stage')) {

            let stage = key.split('Stage')[0] + 'Stage';

            let amountBlueCards = dataAncient[stage].blueCards;
            let amountGreenCards = dataAncient[stage].greenCards;
            let amoutBrownCards = dataAncient[stage].brownCards;
            let cards = [];

            getDeck(stage, amountBlueCards, cards, decksByStages, mergedSortedCards.blueCards)
            getDeck(stage, amountGreenCards, cards, decksByStages, mergedSortedCards.greenCards)
            getDeck(stage, amoutBrownCards, cards, decksByStages, mergedSortedCards.brownCards)
        }

    }
    return decksByStages;
}

function getDeck(stage, amountCard, cards, decksByStages, arrCards) {

    while (amountCard--) {
        let randomNum = generateRandomNum(0, arrCards.length - 1);

        cards.push(arrCards[randomNum]);
        decksByStages[stage] = cards;
        arrCards.splice(randomNum, 1);
    }
}

function generateRandomNum(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function resettingCardOutputCountStage() {
    countStage = 0;
}

function getCard(decksByStages) {
    console.log(decksByStages)
    let nameStage = Object.keys(decksByStages);
    if (decksByStages[nameStage[nameStage.length - 1]].length === 0) {
        deleteBackCard()
        return
    }
    console.log(decksByStages, decksByStages, nameStage[countStage])
    let randomNum = generateRandomNum(0, decksByStages[nameStage[countStage]].length - 1)
    let card = decksByStages[nameStage[countStage]][randomNum];


    cardStagesCounter(card, nameStage[countStage], decksByStages, countStage)


    let faceCard = createFaceCard(card.cardFace)
    appendingFaceCard(faceCard)
    decksByStages[nameStage[countStage]].splice(randomNum, 1);

    if (!decksByStages[nameStage[countStage]].length) {
        countStage++;
    }
    console.log(card)
}

function appendingFaceCard(faceCard) {
    deleteFaceCard()
    let shemaWrap = document.querySelector('.shema-wrap');
    if (!shemaWrap) return
    appendingData(shemaWrap, faceCard)
}

function deleteFaceCard() {
    let faceCard = document.querySelector('.face-card')
    if (!faceCard) return
    faceCard.remove()
}

function createFaceCard(backImage) {
    let faceCard = document.createElement('div');
    faceCard.classList.add('face-card', 'face-card--active');
    faceCard.style.backgroundImage = `url(${backImage})`
    return faceCard
}

function appendBackCard() {
    let shemaWrap = document.querySelector('.shema-wrap');
    if (!shemaWrap) return
    let cardBack = document.createElement('div');
    cardBack.classList.add('card-back', 'card-back--active');
    appendingData(shemaWrap, cardBack);
    return cardBack
}

function deleteBackCard() {
    let cardBack = document.querySelector('.card-back');
    if (!cardBack) return
    cardBack.classList.remove('card-back--active');
}

function cardStagesCounter(card, currentnameStage, decksByStages, countStage) {
    console.log('!!!!!!!!!!!!!')
    let cardsSameColor = decksByStages[currentnameStage].length;
    let colorCard = (card.id).replace(/\d/gi, '');
    let amountCards = document.querySelector(`.${currentnameStage} .${colorCard} span`);
    if (!amountCards) return;
    amountCards.textContent -= 1;

    if (cardsSameColor === 1) {
        let shemaName = document.querySelector(`td.${currentnameStage}`);
        console.log(shemaName)
        if (!shemaName) return
        shemaName.classList.add('shema__name-stage--passed');
    }
}


//-----------algoritm kneading-----------
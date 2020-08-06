// DOM SELECTORS
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImg = document.querySelector('.poke-front-image');
const pokeBackImg = document.querySelector('.poke-back-image');
const pokeTypes = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// utility func
let prevUrl, nextUrl;
prevUrl = null;
nextUrl = null;

const caps = (str) => str[0].toUpperCase() + str.substr(1);


const allTypesArr = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'fire', 'ghost',
    'steel', 'water', 'grass', 
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];



const resetScreen = () => {
    mainScreen.classList.remove('hide');

    for (const theType of allTypesArr) {
        mainScreen.classList.remove(theType);
    }
}

// LEFT SIDE

async function displayPokeMans(pokemon) {
try {
 resetScreen();
const result = await fetch (`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
 const data = await result.json();
 pokeName.textContent = await caps(data['name']);
 pokeId.textContent = await '#' + data['id'].toString().padStart(3, '0')
 pokeWeight.textContent = await data['weight']
 pokeHeight.textContent = await data['height']
 
 const dataTypes = await data['types']

 if (dataTypes.length === 2) {
    pokeTypes.textContent = await caps(`${dataTypes[0]['type']['name']} / `) + caps(`${dataTypes[1]['type']['name']}`)
 } else {
    pokeTypes.textContent = await caps(`${dataTypes[0]['type']['name']}`)  
 }
 mainScreen.classList.add(dataTypes[0]['type']['name'])
 pokeFrontImg.src = data['sprites']['front_default'] || '';
 pokeBackImg.src = data['sprites']['back_default'] || '';
 
 //pokeTypeTwo = await dataTypes[1]


} catch(error) {

    console.log(`${error} sorry this pokedex doesn't have that pokemon `)
}
 
}

// RIGHT SIDE

async function pokeList(url) {
    try{
        const result = await fetch(url);
        const data = await result.json();
        const allPokemon = data['results'];
        const { previous, next } = data;
        prevUrl = previous;
        nextUrl = next;

        for (let i = 0; i < pokeListItems.length; i++) {
            const newPokeListItems = pokeListItems[i];
            const resultsData = allPokemon[i]
            

            if (resultsData) {
                const { name, url } = resultsData

                const urlArray = url.split('/');
                const pokemanID = urlArray[urlArray.length - 2]
                newPokeListItems.textContent = pokemanID + '. ' + caps(name);
            } else {
                newPokeListItems.textContent = '';
            }
        }

    } catch {

    }

}



//EVENT LISTENERS
const handleRightButton = (e) => {
    if (nextUrl) {
        pokeList(nextUrl);
    }
 };

 const handleLeftButton = (e) => {
     if (prevUrl) {
         pokeList(prevUrl);
     }
 };

 const handleListItemClick = (e) => {
     const listItem = e.target
     if (!listItem) return;
     if (!listItem.textContent) return;

     const listId = listItem.textContent.split('.')[0]
     displayPokeMans(listId);
 }

 for (const pokemans of pokeListItems) {
     pokemans.addEventListener('click', handleListItemClick);
 }

leftButton.addEventListener('click', handleLeftButton )
rightButton.addEventListener('click', handleRightButton)

// INIT
pokeList('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
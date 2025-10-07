const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const OFFSET = 0;

function initFormFieldEventListener(){
    let formSearchPokemon = document.getElementById('formSearchPokemon');
    if (formSearchPokemon){
        formSearchPokemon.addEventListener('submit', function(event){
            handleFormSubmit(event);
            // schiebe die Funktion "findPokemonByName()" nach handleFormSubmit
        })
    };
}

async function initDOMContentEventListener(){
    // let path = "/76";
    // initDialog();   
    initFormFieldEventListener();
    await getFirstTwentyItems();
    // fetchItems(path);
    hideLoadingSpinner();
}

async function fetchAllItems(path="") {
    let response = await fetch(BASE_URL + path)
    let responseToJson = await response.json();
    let results = responseToJson.results;
    return results
}

async function fetchSingleItem(itemObject) {
    let itemUrl = itemObject.url;
    let response = await fetch(itemUrl);
    let singlePokemon = await response.json();
    return singlePokemon 
}

async function getFirstTwentyItems(){
    let path = "?offset="+OFFSET+"0&limit=20";
    let twentyFirstItems = await fetchAllItems(path);
    renderAllPokemons(twentyFirstItems);
}

function renderAllPokemons(fetchedPokemons){
    let allPokemonsRef = document.getElementById('container_pokemons');

    fetchedPokemons.forEach(async(singlePokemonObject) => {
        let singlePokemon = await fetchSingleItem(singlePokemonObject);
        console.log(singlePokemon);
        
        allPokemonsRef.innerHTML += renderSinglePokemon(singlePokemon)
        // setAllElementsOfType(singlePokemon);


    });
}

function setAllElementsOfType(singlePokemon){
    let singlePokemonRef = document.getElementById('types');
    let typeKeyArrays = Object.keys(singlePokemon.types);    
    for (let index = 0; index < typeKeyArrays.length; index++) {
        let type = singlePokemon.types[index].type;
        singlePokemonRef.innerHTML += renderTypes(type);
        if (index == 0){
            setBackgroundColorOfType(type);
        }
    }
}

function getArrayOfFetchedItems(arrayOfObjects){
    let arrayOfKeys = Object.keys(arrayOfObjects);
    console.log(arrayOfKeys);
    
    return arrayOfKeys
}

function setBackgroundColorOfType(type){
    let imgRef = document.getElementById('poke_img');
    imgRef.classList.add("background_color_"+type.name);
}

function showLoadingSpinner(){
    document.getElementById('overlay').classList.remove('d_none');
}

function hideLoadingSpinner(){
    document.getElementById('overlay').classList.add('d_none');
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const OFFSET = 0;
let limit = 20;

function initFormFieldEventListener(){
    let formSearchPokemon = document.getElementById('formSearchPokemon');
    if (formSearchPokemon){
        formSearchPokemon.addEventListener('submit', function(event){
            handleFormSubmit(event);
        })
    };
}

function handleFormSubmit(event){
    event.preventDefault();
    let submittedForm = event.target;
    if (!submittedForm){
        return;
    }
    if (submittedForm.classList.contains('container_input_field')){
        let inputText = document.getElementById('input_field').value;
        findPokemonByName(inputText);
    }
}

function findPokemonByName(inputText){

}

async function initDOMContentEventListener(){
    initFormFieldEventListener();
    await getItemsFromAPI();
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

async function getItemsFromAPI(){
    let path = "?offset="+OFFSET+"0&limit="+limit;
    let arrayOfItemObjects = await fetchAllItems(path);
    storeArrayOfItemObjectsToLocalStorage(arrayOfItemObjects);
    await renderAllPokemons(arrayOfItemObjects);
}

async function renderAllPokemons(arrayOffetchedPokemonsObjects){
    let allPokemonsRef = document.getElementById('container_pokemons');
    clearContainerPokemons(allPokemonsRef);
    for (let itemObject of arrayOffetchedPokemonsObjects){
        let singlePokemon = await fetchSingleItem(itemObject);
        allPokemonsRef.innerHTML += renderSinglePokemon(singlePokemon)
        setAllElementsOfType(singlePokemon);
    }
}

function clearContainerPokemons(allPokemonsRef){
    allPokemonsRef.innerHTML = '';
}

function setAllElementsOfType(singlePokemon){
    let singlePokemonRef = document.getElementById(singlePokemon.id);
    let typeKeyArrays = Object.keys(singlePokemon.types);    
    for (let index = 0; index < typeKeyArrays.length; index++) {
        let type = singlePokemon.types[index].type;
        singlePokemonRef.innerHTML += renderTypes(type);
        if (index == 0){
            setBackgroundColorOfType(type, singlePokemon.id);
        }
    }
}

function setBackgroundColorOfType(type, id){
    let imgRef = document.getElementById('poke_img_'+id);
    imgRef.classList.add("background_color_"+type.name);
}

function showLoadingSpinner(){
    document.getElementById('overlay').classList.remove('d_none');
}

function hideLoadingSpinner(){
    document.getElementById('overlay').classList.add('d_none');
}

async function loadmore(){
    limit = limit + 20;
    showLoadingSpinner();
    await getItemsFromAPI();
    hideLoadingSpinner();
}

function storeArrayOfItemObjectsToLocalStorage(arrayOfItemObjects){
    localStorage.setItem('ArrayOfItems', JSON.stringify(arrayOfItemObjects))
}

function getArrayOfItemObjectsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('ArrayOfItems'))
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);
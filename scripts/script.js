// const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const OFFSET = 0;
let limit = 20;
let arrayOfRawItems = [];
let arrayOfSingleItems = [];
let filterdArrayOfItems = [];

async function initFormFieldEventListener(){
    let formSearchPokemon = document.getElementById('formSearchPokemon');
    if (formSearchPokemon){
        formSearchPokemon.addEventListener('submit', function(event){
            handleFormSubmit(event);
        })
    };
}

async function initModalEventListener(){
    let pokemonModal = document.getElementById('pokemonModal');
    
    pokemonModal.addEventListener('show.bs.modal', (event) => {
        let button = event.relatedTarget;

        let pokemonId = button.dataset.pokemonId;
        let pokemonName = button.dataset.pokemonName;
        let pokemonHeight = button.dataset.pokemonHeight;
        let pokemonWeight = button.dataset.pokemonWeight;
        let pokemonAbilityArr = JSON.parse(button.dataset.pokemonAbility.replace(/'/g, '"'));
        let pokemonStatsArr = JSON.parse(button.dataset.pokemonStats.replace(/'/g, '"'));
        console.table(pokemonAbilityArr);
        

        let modalPokemonImg = pokemonModal.querySelector('.modal-pokemon-img');
        let modalPokemonId = pokemonModal.querySelector('.modal-pokemon-id');
        let modalPokemonName = pokemonModal.querySelector('.modal-pokemon-name');
        let modalPokemonHeight = pokemonModal.querySelector('.modal-pokemon-height');
        let modalPokemonWeight = pokemonModal.querySelector('.modal-pokemon-weight');
        
        // hier muss eine Function die Abilities und Stats heraussuchen!
        handleStats(pokemonStatsArr);
        handleAbilities(pokemonAbilityArr);
        
        
        modalPokemonName.textContent = pokemonName.toUpperCase();
        modalPokemonId.textContent = pokemonId.padStart(4,'0');
        modalPokemonImg.innerHTML = `<img src = "${IMG_URL}${pokemonId}.svg" alt="Pokemon image">`;
    });
}

function handleStats(pokemonStatsArr){
    let statsObject = getStatsToObject(pokemonStatsArr);
    let modalPokemonstats = pokemonModal.querySelector('.modal-pokemon-stats');
    modalPokemonstats.innerHTML = renderStatsToModal(statsObject); 
}

function getStatsToObject(pokemonStatsArr){
    let statsObjVar = {};
    let key = "";
    for (let itemObject of pokemonStatsArr){
        key = itemObject.stat.name;
        console.log(key);
        
        statsObjVar[key] = itemObject.base_stat;
    }
    return statsObjVar
}

function handleAbilities(pokemonAbilityArr){
    let modalPokemonAbility = pokemonModal.querySelector('.modal-pokemon-ability');
    let arrOfAbilities = [];
    for (const ability of pokemonAbilityArr) {
        arrOfAbilities.push(ability.ability.name)
    }
    console.log(arrOfAbilities);
    
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

async function findPokemonByName(inputText){
    let count = 0;
    arrayOfRawItems.forEach((item) => {        
        if(item.name.substring(0, inputText.length).toLowerCase() == inputText.toLowerCase()){
            count++;
            filterdArrayOfItems.push(item);
        }
    });
    if (filterdArrayOfItems != []){
        arrayOfRawItems = filterdArrayOfItems;
        await getSingleItemsFromApi();
        await renderAllPokemons();
    }
    filterdArrayOfItems = [];
}

async function reloadLastView(){
    resetInputField();
    await getItemsFromApi();
    await getSingleItemsFromApi();
    await renderAllPokemons();
}

function resetInputField(){
    document.getElementById('formSearchPokemon').reset();
}

async function initDOMContentEventListener(){
    await initFormFieldEventListener();
    await getItemsFromApi();
    await getSingleItemsFromApi();
    await renderAllPokemons();
    hideLoadingSpinner();
    handleModal();
    await initModalEventListener();
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

async function getItemsFromApi(){
    let path = "?offset="+OFFSET+"0&limit="+limit;
    arrayOfRawItems = await fetchAllItems(path);
    storeArrayOfItemObjectsToLocalStorage(arrayOfRawItems);
}

async function getSingleItemsFromApi() {
    arrayOfSingleItems = [];
    for (let itemObject of arrayOfRawItems){
        let singlePokemon = await fetchSingleItem(itemObject);
        arrayOfSingleItems.push(singlePokemon) ;
    }
}

async function renderAllPokemons(){
    let allPokemonsRef = document.getElementById('container_pokemons');
    clearContainerPokemons(allPokemonsRef);

    for (let itemObject of arrayOfSingleItems){
        allPokemonsRef.innerHTML += renderSinglePokemon(itemObject)
        setAllElementsOfType(itemObject);
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
    await getItemsFromApi();
    await getSingleItemsFromApi();
    await renderAllPokemons();
    hideLoadingSpinner();
}

function storeArrayOfItemObjectsToLocalStorage(arrayOfItemObjects){
    localStorage.setItem('ArrayOfItems', JSON.stringify(arrayOfItemObjects));
}

function getArrayOfItemObjectsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('ArrayOfItems'))
}

function handleModal(){
    let modalElement = document.getElementById('pokemonModal');
    
    if(modalElement){
        modalElement.innerHTML = renderModal();
    }
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);
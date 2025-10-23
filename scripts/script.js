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
        let pokemonId = button.getAttribute('data-pokemon-id');       

        let modalTitle = pokemonModal.querySelector('.modal-title');
        
        modalTitle.textContent = "Ich bin Pokemon mit der ID: " + pokemonId +"!"
    });
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
const BASE_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";
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
    
    pokemonModal.addEventListener('show.bs.modal', async (event) => {
        let button = event.relatedTarget;

        let classNameBackgroundColor = findImgClassName(button);  
        let pokemonId = button.dataset.pokemonId;
        let singlePokemon = await fetchSelectedPokemon(pokemonId);
        let pokemonName = singlePokemon.name;
        
        handleStats(singlePokemon);
        handleNameIdImg(pokemonId, pokemonName, classNameBackgroundColor);
        handlePreferences(singlePokemon, pokemonId);
    });
}

function findImgClassName(button){
    for (let child of button.children){
            if(child.className.includes("background_color_")){
                return child.className
            }
        }
}

function handleStats(singlePokemon){
    let pokemonStatsArr = singlePokemon.stats;
    let statsObject = getStatsToObject(pokemonStatsArr);
    let modalPokemonstats = pokemonModal.querySelector('.modal-pokemon-stats');
    modalPokemonstats.innerHTML = renderStatsToModal(statsObject); 
}

function getStatsToObject(pokemonStatsArr){
    let statsObjVar = {};
    let key = "";
    for (let itemObject of pokemonStatsArr){
        key = itemObject.stat.name;
        statsObjVar[key] = itemObject.base_stat;
    }
    return statsObjVar
}

async function handlePreferences(singlePokemon, pokemonId){
    let preferenceObj = await getPreferencesObj(singlePokemon, pokemonId);

    let modalPokemonPreferences = pokemonModal.querySelector('.modal-preferences');
    modalPokemonPreferences.innerHTML = renderPreferencesToModal(preferenceObj);
}

async function getPreferencesObj(singlePokemon, pokemonId){
    let preferenceObjVar = {};

    let singleSpecies = await fetchSelectedSpecies(pokemonId);
    let pokemonGenus = getGenusOfSinglePokemon(singleSpecies);
    let pokemonHeight = singlePokemon.height;
    let pokemonWeight = singlePokemon.weight;
    let arrOfAbilities = singlePokemon.abilities;
    let pokemonAbilityArr = getAbilities(arrOfAbilities);

    preferenceObjVar['genus'] = pokemonGenus;
    preferenceObjVar['height'] = pokemonHeight;
    preferenceObjVar['weight'] = pokemonWeight;
    preferenceObjVar['abilities'] = pokemonAbilityArr;

    return preferenceObjVar
}

function getGenusOfSinglePokemon(singleSpecies){
    for (let generaItem of singleSpecies.genera) {
        if (generaItem.language.name == "en"){
            return generaItem.genus
        }
    }
}

function getAbilities(pokemonAbilityArr){
    let arrOfAbilities = [];
    for (const ability of pokemonAbilityArr) {
        arrOfAbilities.push(ability.ability.name)
    }
    return arrOfAbilities
}

function handleNameIdImg(pokemonId, pokemonName, classNameBackgroundColor){
    let modalPokemonId = pokemonModal.querySelector('.modal-pokemon-id');
    let modalPokemonName = pokemonModal.querySelector('.modal-pokemon-name');
    let modalPokemonImg = pokemonModal.querySelector('.modal-pokemon-img');
        
    modalPokemonId.textContent = pokemonId.padStart(4,'0');
    modalPokemonName.textContent = pokemonName.toUpperCase();
    modalPokemonImg.setAttribute("class", "modal-pokemon-img " + classNameBackgroundColor);
    modalPokemonImg.innerHTML = `<img src = "${IMG_URL}${pokemonId}.svg" alt="Pokemon image">`;
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

async function fetchSelectedPokemon(pokemonId) {
    let responsePokemon = await fetch(BASE_URL + "/" + pokemonId + "/");
    let singlePokemon = await responsePokemon.json();
    return singlePokemon
}

async function fetchSelectedSpecies(pokemonId) {
    let responsePokemonSpecies = await fetch(BASE_SPECIES_URL + "/" + pokemonId + "/");
    let singleSpecies = responsePokemonSpecies.json();
    return singleSpecies
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
const BASE_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";
const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let offset = 0;
let limit = 20;
let arrayOfRawItems = [];
let arrayOfSingleItems = [];
let filterdArrayOfItems = [];
let filterdArrayOfSingleItems = [];

function initFormFieldEventListener(){
    let searchInput = document.getElementById('input_field');
    if (searchInput){
        searchInput.addEventListener('input', function(event){
            let searchTerm = event.target.value.toLowerCase();
            event.preventDefault();            
            handleFormSubmit(searchTerm);
            return true;
        })
    };
}

function initModalEventListener(){
    let pokemonModal = document.getElementById('pokemonModal');
    
    pokemonModal.addEventListener('show.bs.modal', async (event) => {
        let button = event.relatedTarget;
        let pokemonId = button.dataset.pokemonId;
        renderPokemonToModal(pokemonId);
    });
}

function renderPokemonToModal(pokemonId) {
    handleStats(pokemonId);
    handleNameIdImg(pokemonId);
    handlePreferences(pokemonId);
    resetDisabledButton('button_next');
    resetDisabledButton('button_previous');
    disableNavButtonWhenFirstOrLastItem(pokemonId);
}

async function handleStats(pokemonId){
    let singlePokemon = await fetchSelectedPokemon(pokemonId);
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

async function handlePreferences(pokemonId){
    let singlePokemon = await fetchSelectedPokemon(pokemonId);
    let preferenceObj = await getPreferencesObj(singlePokemon, pokemonId);

    let modalPokemonPreferences = pokemonModal.querySelector('.modal-preferences');
    modalPokemonPreferences.innerHTML = renderPreferencesToModal(preferenceObj);
}

async function getPreferencesObj(singlePokemon, pokemonId){
    let preferenceObjVar = {};
    let singleSpecies = await fetchSelectedSpecies(pokemonId);

    preferenceObjVar['genus'] = getGenusOfSinglePokemon(singleSpecies);
    preferenceObjVar['height'] = singlePokemon.height;
    preferenceObjVar['weight'] = singlePokemon.weight;
    preferenceObjVar['abilities'] = getAbilities(singlePokemon.abilities);

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
    let numOfAbilities = 0
    for (const ability of pokemonAbilityArr) {
        numOfAbilities++;
        if (numOfAbilities < 3){
            arrOfAbilities.push(ability.ability.name)
        }
    }
    return arrOfAbilities
}

function disableNavButtonWhenFirstOrLastItem(pokemonId){
    let arrayToJump = getArrayToRender();
    let indexOfCurrentPokemon = getPosInArrayOfCurrentPokemon(arrayToJump, pokemonId);

    if (indexOfCurrentPokemon == 0){
        document.getElementById('button_previous').disabled = true;
    }
    if (indexOfCurrentPokemon == arrayToJump.length - 1){
        document.getElementById('button_next').disabled = true;
    }
}

async function handleNameIdImg(pokemonId){ 
    let singlePokemon = await fetchSelectedPokemon(pokemonId);
    
    let modalPokemonId = pokemonModal.querySelector('.modal-pokemon-id');
    let modalPokemonName = pokemonModal.querySelector('.modal-pokemon-name');
    let modalPokemonImg = pokemonModal.querySelector('.modal-pokemon-img-container');
    
    modalPokemonId.textContent = pokemonId.padStart(4,'0');
    modalPokemonName.textContent = singlePokemon.name.toUpperCase();
    modalPokemonImg.innerHTML = `<img src = "${IMG_URL}${pokemonId}.svg" alt="Pokemon image" class="modal-pokemon-img">`;
    
    setBackgroundColorOfImgInModal(singlePokemon);
}
async function jumpPokemonForward(){
    resetDisabledButton('button_previous');
    let arrayToJump = getArrayToRender();
    let indexOfCurrentPokemon = getPosInArrayOfCurrentPokemon(arrayToJump, id=-1);
    
    
    if (indexOfCurrentPokemon == arrayToJump.length -1 ){
        return
    }
    else if (indexOfCurrentPokemon == arrayToJump.length - 2){
        pokemonId = arrayToJump[indexOfCurrentPokemon + 1].id;
        document.getElementById('button_next').disabled = true;
    }
    else{
        pokemonId = arrayToJump[indexOfCurrentPokemon + 1].id;
    }
    renderPokemonToModal(String(pokemonId));
}

async function jumpPokemonBackward(){
    let arrayToJump = getArrayToRender();
    let indexOfCurrentPokemon = getPosInArrayOfCurrentPokemon(arrayToJump, id=-1);
    resetDisabledButton('button_next');
    
    if(indexOfCurrentPokemon == 0){
        return
    }
    else if (indexOfCurrentPokemon == 1){
        pokemonId = arrayToJump[indexOfCurrentPokemon - 1].id;        
        document.getElementById('button_previous').disabled = true;
    }
    else{
        pokemonId = arrayToJump[indexOfCurrentPokemon - 1].id;
    }
    renderPokemonToModal(String(pokemonId)); 
}

function getPosInArrayOfCurrentPokemon(arrayToMove, id){
    let idCurrentPokemon = 0;
    if (id == -1){
        idCurrentPokemon = getIdCurrentPokemon();
    }
    else {
        idCurrentPokemon = id;
    }

    for (let index = 0; index < arrayToMove.length; index++) {
        if (arrayToMove[index].id == idCurrentPokemon){       
            return index
        }
        else{
            continue
        }        
    }
}

function  getIdCurrentPokemon() {
    let idContainer = pokemonModal.querySelector('.modal-pokemon-id');
    let idCurrentPokemonString = idContainer.innerHTML;
    let idCurrentPokemon = parseInt(idCurrentPokemonString.replace(/^0+/, ''));
    return idCurrentPokemon
}

function resetDisabledButton(buttonId){
     if (document.getElementById(buttonId).disabled = true){
        document.getElementById(buttonId).disabled = false;
    }
}

function setBackgroundColorOfImgInModal(singlePokemon){
    let modalPokemonImg = pokemonModal.querySelector('.modal-pokemon-img-container');
    let type = singlePokemon.types[0].type;
    let classNameBackgroundColor = "background_color_" + type.name;
    modalPokemonImg.setAttribute("class", "modal-pokemon-img-container " + classNameBackgroundColor);
}

async function handleFormSubmit(searchTerm){
    if (!searchTerm){
        return;
    }
    if (searchTerm.length > 2){
        await findPokemonByName(searchTerm);
    }
    else{
        reloadLastView();
    }
}

async function findPokemonByName(inputText){
    filterdArrayOfItems = [];
    filterdArrayOfSingleItems = [];

    arrayOfRawItems.forEach((item) => {        
        if(item.name.substring(0, inputText.length).toLowerCase() == inputText.toLowerCase()){
            filterdArrayOfItems.push(item);
        }
    });
    if (filterdArrayOfItems != []){
        getFilteredArrayOfSingleItems(filterdArrayOfItems);
        await renderAllPokemons();
    }
}

function getFilteredArrayOfSingleItems(filterdArrayOfItems){
    filterdArrayOfItems.forEach(element => {
        let id = getIdFromURL(element.url);
        arrayOfSingleItems.forEach(element => {
            if (element.id == id){
                filterdArrayOfSingleItems.push(element);
            }
        });
    });
}

function getIdFromURL(url){
    let cleanedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    let parts = cleanedUrl.split('/');
    let numberString = parts[parts.length - 1];
    return parseInt(numberString, 10);
}

async function reloadLastView(){
    await getItemsFromApi();
    await getSingleItemsFromApi();
    await renderAllPokemons();
}

function resetInputField(){
    document.getElementById('formSearchPokemon').reset();
}

async function initDOMContentEventListener(){
    initFormFieldEventListener();
    await getItemsFromApi();
    await getSingleItemsFromApi();
    await renderAllPokemons();
    hideLoadingSpinner();
    handleModal();
    initModalEventListener();
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
    let path = "?limit=" + limit + "&offset=" + offset;
    let arrayOfRawItemsTmp = await fetchAllItems(path);
    arrayOfRawItemsTmp.forEach(element => {
        arrayOfRawItems.push(element);
    });
    storeArrayOfItemObjectsToLocalStorage(arrayOfRawItems);
}

async function getSingleItemsFromApi() {
    let startIndex = offset;
    let endIndex = offset + limit;
    for (let index = startIndex; index < endIndex; index++) {      
        let singlePokemon = await fetchSingleItem(arrayOfRawItems[index]);
        arrayOfSingleItems.push(singlePokemon) ;   
    }   
}

async function renderAllPokemons(){
    let allPokemonsRef = document.getElementById('container_pokemons');
    clearContainerPokemons(allPokemonsRef);
    let arrayToRender = getArrayToRender();

    for (let itemObject of arrayToRender){
        allPokemonsRef.innerHTML += renderSinglePokemon(itemObject)
        setAllElementsOfType(itemObject);
    }
}

function clearContainerPokemons(allPokemonsRef){
    allPokemonsRef.innerHTML = '';
}

function getArrayToRender(){
    let arrayToRender = [];

    if (filterdArrayOfSingleItems.length > 0){        
        arrayToRender = filterdArrayOfSingleItems;
    }
    else {
        arrayToRender = arrayOfSingleItems;
    }
    return arrayToRender
}

function setAllElementsOfType(singlePokemon){
    let singlePokemonRef = document.getElementById(singlePokemon.id);
    let typeKeyArrays = Object.keys(singlePokemon.types);    
    for (let index = 0; index < typeKeyArrays.length; index++) {
        let type = singlePokemon.types[index].type;
        
        singlePokemonRef.innerHTML += renderTypes(type, index+1);
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
    limit = 20;
    offset = offset + 20;
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
const BASE_URL = "https://pokeapi.co/api/v2/pokemon"

function initFormFieldEventListener(){
    let formSearchPokemon = document.getElementById('formSearchPokemon');
    if (formSearchPokemon){
        formSearchPokemon.addEventListener('submit', function(event){
            handleFormSubmit(event);
            // schiebe die Funktion "findPokemonByName()" nach handleFormSubmit
        })
    };
}

function initDOMContentEventListener(){
    let path = "/76";
    // initDialog();   
    initFormFieldEventListener();
    fetchSinglePokemon(path);
    // hideLoadingSpinner();
}

async function fetchSinglePokemon(path="") {
    let response = await fetch(BASE_URL + path)
    let responseToJson = await response.json();
    console.log(responseToJson);
    renderAllPokemons(responseToJson);
}

function renderAllPokemons(singlePokemon){
    let allPokemonsRef = document.getElementById('container_pokemons');
    allPokemonsRef.innerHTML = renderSinglePokemon(singlePokemon);
    setAllElementsOfType(singlePokemon);
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

function setBackgroundColorOfType(type){
    let imgRef = document.getElementById('poke_img');
    imgRef.classList.add("background_color_"+type.name);
}

function showLoadingSpinner(){
    document.getElementById('overlay').classList.toggle('d_none');
}

function hideLoadingSpinner(){
    document.getElementById('overlay').classList.toggle('d_none');
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);
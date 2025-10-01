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
    let path = "/1";
    // initDialog();   
    initFormFieldEventListener();
    fetchSinglePokemon(path);
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
}

document.addEventListener('DOMContentLoaded', initDOMContentEventListener);
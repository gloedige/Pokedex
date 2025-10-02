const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

function renderSinglePokemon(singlePokemon){
    return  `
            <li class="animating">
                <a href="">
                    <img src = "${IMG_URL}${singlePokemon.id}.svg" alt="Pokemon image" class="poke_img">
                </a>
                <div class="pokemon_info" id="types">
                    <p class="id">
                        <span class="number_prefix">Nr.&nbsp;</span>
                        ${String(singlePokemon.id).padStart(4,'0')}
                    </p>
                    <h5>${(singlePokemon.name).toUpperCase()}</h5>
                </div>
            </li>
            `
}

function renderTypes(type){
    return  `
            <div class="abilities">
                <span class="pill background_color_${type.name}">${type.name}</span>
            </div>
            `
}
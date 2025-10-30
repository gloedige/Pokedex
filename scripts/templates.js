const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

function renderSinglePokemon(singlePokemon){
    return  `
            <li class="animating">
                <button  
                    data-bs-toggle="modal" 
                    data-bs-target="#pokemonModal"
                    data-pokemon-id="${singlePokemon.id}">
                    <img src = "${IMG_URL}${singlePokemon.id}.svg" alt="Pokemon image" id="poke_img_${singlePokemon.id}">
                </button>
                <div class="pokemon_info" id="${singlePokemon.id}">
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

function renderModal(){
    return  `
            
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-pokemon-name">Pokemon Name</h5>
                            <h5 class="modal-pokemon-id">
                                <span class="number_prefix">Nr.&nbsp;</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-pokemon-img-container"></div>
                            <h5>Stats</h5>
                            <div class="modal-pokemon-stats"></div>
                            <div class="modal-preferences"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary jump-button" onclick="jumpPokemonBackward()">Previous</button>
                            <button type="button" class="btn btn-secondary jump-button" onclick="jumpPokemonForward()">Next</button>
                        </div>
                    </div>
                </div>
            
            `
}

function renderStatsToModal(statsObj){
    return `
            <table class="table table-striped rounded overflow-hidden">
                <tr class="pref-name">
                    <td>HP</td>
                    <td>Attack</td>
                    <td>Defense</td>
                    <td>Special-Attack</td>
                    <td>Special-Defense</td>
                    <td>Speed</td>
                </tr>
                <tr>
                    <td>${(statsObj.hp)}</td>
                    <td>${(statsObj.attack)}</td>
                    <td>${(statsObj.defense)}</td>
                    <td>${(statsObj['special-attack'])}</td>
                    <td>${(statsObj['special-defense'])}</td>
                    <td>${(statsObj.speed)}</td>
                </tr>
            </table>

            `
}

function renderPreferencesToModal(preferenceObj){
    return  `
                <table class="pref-table-one">
                    <tr>
                        <td class="pref-name">Height: </td>
                        <td class="td-left">${preferenceObj.height*10} cm</td>
                    </tr>
                    <tr>
                        <td class="pref-name">Weight: </td>
                        <td class="td-left">${preferenceObj.weight/10} kg</td>
                    </tr>
                    
                </table>
                <table class="pref-table-two">
                    <tr>
                        <td class="pref-name">Abilities: </td>
                        <td class="td-left">${preferenceObj.abilities}</td>
                    </tr>
                    <tr>
                        <td class="pref-name">Genus: </td>
                        <td class="td-left">${preferenceObj.genus}</td>
                    </tr>
                </table>
            `
}
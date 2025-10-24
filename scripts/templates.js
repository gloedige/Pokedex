const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

function renderSinglePokemon(singlePokemon){
    return  `
            <li class="animating">
                <button  
                    data-bs-toggle="modal" 
                    data-bs-target="#pokemonModal"
                    data-pokemon-id="${singlePokemon.id}"
                    data-pokemon-name="${singlePokemon.name}"
                    data-pokemon-height="${singlePokemon.height}"
                    data-pokemon-weight="${singlePokemon.weight}"
                    data-pokemon-ability="${JSON.stringify(singlePokemon.abilities)}"
                    data-pokemon-stats="${JSON.stringify(singlePokemon.stats).replace(/"/g, "'")}">
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
                            <div class="modal-pokemon-img"></div>
                            <h5>Stats</h5>
                            <p>Modal body text goes here.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Previous</button>
                            <button type="button" class="btn btn-secondary">Next</button>
                        </div>
                    </div>
                </div>
            
            `
}

function renderStatsToModal(stats){
    return `
            <table>
                <tr>
                    <td>HP</td>
                    <td>Attack</td>
                    <td>Defense</td>
                    <td>Special-Attack</td>
                    <td>Special-Defense</td>
                    <td>Speed</td>
                </tr>
                <tr>
                    <td>${(stats.hp)}</td>
                    <td>${(stats.attack)}</td>
                    <td>${(stats.defense)}</td>
                    <td>${(stats.special-attack)}</td>
                    <td>${(stats.special-defense)}</td>
                    <td>${(stats.speed)}</td>
                </tr>
            </table>

            `
}
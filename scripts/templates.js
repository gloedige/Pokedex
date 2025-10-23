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
                            <h5 class="modal-title">Modal title</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Save changes</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            
            `
}
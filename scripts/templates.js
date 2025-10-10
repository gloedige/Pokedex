const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

function renderSinglePokemon(singlePokemon){
    return  `
            <li class="animating">
                <button onclick="handleModal()" data-toggle="modal" data-target="#exampleModalCenter">
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
            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
            </div>
            `
}
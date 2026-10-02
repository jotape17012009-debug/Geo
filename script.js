// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const btnLocalizacao =
    document.getElementById("btnLocalizacao");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const status =
    document.getElementById("status");

const ultimaLocalizacao =
    document.getElementById("ultimaLocalizacao");

const papel =
    document.getElementById("papel");

const lixeira =
    document.getElementById("lixeira");


// ==========================================
// VARIÁVEIS DO MAPA
// ==========================================

let mapa = null;

let marcador = null;


// ==========================================
// INICIAR MAPA
// ==========================================

function iniciarMapa() {

    // Verifica se o MapLibre foi carregado
    if (typeof maplibregl === "undefined") {

        console.error(
            "MapLibre não foi carregado."
        );

        status.textContent =
            "Mapa indisponível, mas a localização pode ser obtida.";

        return;
    }


    try {

        // Criar mapa
        mapa = new maplibregl.Map({

            container: "mapa",

            style:
                "https://tiles.openfreemap.org/styles/liberty",

            center: [
                -51.9253,
                -14.2350
            ],

            zoom: 3.5
        });


        // Controles de zoom
        mapa.addControl(
            new maplibregl.NavigationControl(),
            "top-right"
        );


        console.log(
            "Mapa carregado com sucesso."
        );

    } catch (erro) {

        console.error(
            "Erro ao iniciar o mapa:",
            erro
        );

        mapa = null;
    }
}


// ==========================================
// MOSTRAR LOCALIZAÇÃO NO MAPA
// ==========================================

function mostrarNoMapa(lat, long) {

    // Se o mapa não estiver disponível,
    // não impede o restante do sistema
    if (mapa === null) {

        console.log(
            "Mapa indisponível."
        );

        return;
    }


    // Remove marcador anterior
    if (marcador !== null) {

        marcador.remove();

        marcador = null;
    }


    // Cria marcador
    marcador = new maplibregl.Marker({
        color: "#1565c0"
    });


    // Define posição
    marcador
        .setLngLat([
            long,
            lat
        ])
        .addTo(mapa);


    // Cria popup
    const popup =
        new maplibregl.Popup({
            offset: 25
        }).setHTML(
            "<strong>📍 Você está aqui!</strong>"
        );


    marcador.setPopup(popup);


    // Abre o popup
    marcador.togglePopup();


    // Centraliza o mapa
    mapa.flyTo({

        center: [
            long,
            lat
        ],

        zoom: 16,

        essential: true
    });
}


// ==========================================
// MOSTRAR ÚLTIMA LOCALIZAÇÃO
// ==========================================

function mostrarUltimaLocalizacao() {

    const localizacaoSalva =
        localStorage.getItem(
            "localizacao"
        );


    // Se existe localização salva
    if (localizacaoSalva) {

        try {

            const dados =
                JSON.parse(
                    localizacaoSalva
                );


            // Mostrar coordenadas
            latitude.textContent =
                dados.latitude;

            longitude.textContent =
                dados.longitude;


            // Mostrar mensagem
            ultimaLocalizacao.textContent =
                `Sua última localização salva foi: ` +
                `${dados.latitude}, ${dados.longitude}`;


            // Mostrar no mapa
            mostrarNoMapa(
                dados.latitude,
                dados.longitude
            );


        } catch (erro) {

            console.error(
                "Erro ao ler localização salva:",
                erro
            );

            localStorage.removeItem(
                "localizacao"
            );

            ultimaLocalizacao.textContent =
                "Nenhuma localização salva.";
        }


    } else {

        ultimaLocalizacao.textContent =
            "Nenhuma localização salva.";
    }
}


// ==========================================
// OBTER LOCALIZAÇÃO
// ==========================================

function obterLocalizacao() {

    console.log(
        "Botão de localização clicado."
    );


    // Verificar suporte
    if (!navigator.geolocation) {

        status.textContent =
            "Seu navegador não suporta geolocalização.";

        return;
    }


    // Mostrar mensagem
    status.textContent =
        "📍 Obtendo sua localização...";


    // Desabilitar botão temporariamente
    btnLocalizacao.disabled = true;

    btnLocalizacao.textContent =
        "📍 Buscando localização...";


    navigator.geolocation.getCurrentPosition(

        // ======================================
        // SUCESSO
        // ======================================

        function(posicao) {

            console.log(
                "Localização encontrada:",
                posicao
            );


            // Pegar latitude
            const lat =
                posicao.coords.latitude;


            // Pegar longitude
            const long =
                posicao.coords.longitude;


            // ======================================
            // MOSTRAR NA TELA
            // ======================================

            latitude.textContent =
                lat.toFixed(6);


            longitude.textContent =
                long.toFixed(6);


            status.textContent =
                "✅ Localização encontrada com sucesso!";


            // ======================================
            // SALVAR NO LOCALSTORAGE
            // ======================================

            const dados = {

                latitude: lat,

                longitude: long
            };


            localStorage.setItem(

                "localizacao",

                JSON.stringify(dados)
            );


            console.log(
                "Localização salva:",
                dados
            );


            // ======================================
            // MOSTRAR NO MAPA
            // ======================================

            mostrarNoMapa(
                lat,
                long
            );


            // ======================================
            // ATUALIZAR TEXTO
            // ======================================

            ultimaLocalizacao.textContent =
                `Sua última localização salva foi: ` +
                `${lat.toFixed(6)}, ${long.toFixed(6)}`;


            // ======================================
            // LIBERAR BOTÃO
            // ======================================

            btnLocalizacao.disabled =
                false;

            btnLocalizacao.textContent =
                "📍 Atualizar minha localização";
        },


        // ======================================
        // ERRO
        // ======================================

        function(erro) {

            console.error(
                "Erro de geolocalização:",
                erro
            );


            if (erro.code === 1) {

                status.textContent =
                    "❌ Permissão de localização negada. Permita a localização no navegador.";

            }

            else if (erro.code === 2) {

                status.textContent =
                    "❌ Não foi possível encontrar sua localização.";

            }

            else if (erro.code === 3) {

                status.textContent =
                    "❌ A localização demorou muito para responder.";

            }

            else {

                status.textContent =
                    "❌ Ocorreu um erro ao obter sua localização.";
            }


            // Liberar botão
            btnLocalizacao.disabled =
                false;

            btnLocalizacao.textContent =
                "📍 Tentar novamente";
        },


        // ======================================
        // OPÇÕES
        // ======================================

        {
            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0
        }
    );
}


// ==========================================
// BOTÃO DE LOCALIZAÇÃO
// ==========================================

btnLocalizacao.addEventListener(
    "click",
    obterLocalizacao
);


// ==========================================
// DRAG AND DROP
// ==========================================


// Começar a arrastar
papel.addEventListener(
    "dragstart",

    function(evento) {

        evento.dataTransfer.setData(
            "text/plain",
            "papel"
        );


        lixeira.classList.add(
            "destino"
        );
    }
);


// Terminar de arrastar
papel.addEventListener(
    "dragend",

    function() {

        lixeira.classList.remove(
            "destino"
        );
    }
);


// Permitir soltar
lixeira.addEventListener(
    "dragover",

    function(evento) {

        evento.preventDefault();
    }
);


// Soltar papel
lixeira.addEventListener(
    "drop",

    function(evento) {

        evento.preventDefault();


        const objeto =
            evento.dataTransfer.getData(
                "text/plain"
            );


        // Verificar se é o papel
        if (objeto === "papel") {


            // ======================================
            // LIMPAR LOCALSTORAGE
            // ======================================

            localStorage.clear();


            // ======================================
            // LIMPAR COORDENADAS
            // ======================================

            latitude.textContent =
                "---";

            longitude.textContent =
                "---";


            // ======================================
            // ATUALIZAR TEXTO
            // ======================================

            ultimaLocalizacao.textContent =
                "Localização salva apagada!";


            status.textContent =
                "🗑️ Os dados foram removidos com sucesso!";


            // ======================================
            // REMOVER MARCADOR
            // ======================================

            if (marcador !== null) {

                marcador.remove();

                marcador = null;
            }


            // ======================================
            // VOLTAR MAPA PARA O BRASIL
            // ======================================

            if (mapa !== null) {

                mapa.flyTo({

                    center: [
                        -51.9253,
                        -14.2350
                    ],

                    zoom: 3.5,

                    essential: true
                });
            }


            // Aviso
            alert(
                "🗑️ Localização apagada do localStorage!"
            );
        }


        lixeira.classList.remove(
            "destino"
        );
    }
);


// ==========================================
// INICIAR SISTEMA
// ==========================================

console.log(
    "Sistema iniciado."
);


// Iniciar mapa
iniciarMapa();


// Verificar localização salva
mostrarUltimaLocalizacao();
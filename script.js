let cartas = ['Diamantes', 'Corazones', 'Picas', 'Tréboles'];
let valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jota', 'Reina', 'Rey', 'As'];

let money = 100;

const start = document.getElementById('start');
const hit = document.getElementById('hit');
const deal = document.getElementById('deal');
const stand = document.getElementById('stand');
const manoUsuarioInp = document.getElementById('manoUsuario');
const manoCrupierInp = document.getElementById('manoCrupier');
const juego = document.getElementById('juego');
const startDiv = document.getElementById('startDiv');
const mensaje = document.getElementById('mensaje');
const plataActual = document.getElementById('plataActual');
const valorUsuario = document.getElementById('valorUsuario');
const valorCrupier = document.getElementById('valorCrupier');

juego.style.display = 'none';
mensajeDiv.style.display = 'none';

//crear baraja
function crearBaraja() {
    const baraja = [];
    cartas.forEach(carta => {
        valores.forEach(valor => {
            baraja.push({carta, valor});
        });
    }); 
    return baraja;
}

//barajar las cartas
function barajar(baraja){
    for (let i = baraja.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baraja[i], baraja[j]] = [baraja[j], baraja[i]];
    } 
}

//repartir cartas
function repartir(baraja){
    return baraja.pop();
}

//calcular el valor de la mano
function valorMano(mano){
    let valor = 0;
    let as = false;

    mano.forEach(carta => {
        if (carta.valor === 'Jota' || carta.valor === 'Reina' || carta.valor === 'Rey') {
            valor += 10;
        } else if (carta.valor === 'As') {
            valor += 11;
            as = true;
        } else {
            valor += parseInt(carta.valor);
        }
    })
    
    if (as && valor > 21) {
        valor -= 10;
    }
    
    return valor;
}


function mostrarCartas(manoUsuario, manoCrupier) {
    const valorManoUsuario = valorMano(manoUsuario);
    const valorManoCrupier = valorMano(manoCrupier);

    manoUsuarioInp.innerHTML = `<u>Tu mano </u> <br>${manoUsuario.map(carta => carta.valor).join(', ')} <br> <u>Total </u> <br>${valorManoUsuario}`;
    manoCrupierInp.innerHTML = `<u>Mano del crupier </u><br> ${manoCrupier.map(carta => carta.valor).join(', ')} <br> <u>Total </u> <br>${valorManoCrupier}`;
    valorUsuario.innerHTML = `Usuario <br> ${valorManoUsuario}`;
    valorCrupier.innerHTML = `Crupier <br> ${valorManoCrupier}`;
}







function terminar(gano, plata) {
    deal.disabled = false;
    hit.disabled = true;
    stand.disabled = true;
    
    if (gano === true) {
        mensajeDiv.style.display = '';
        juego.style.display = 'none';
        mensaje.textContent = 'Ganaste :)';
        manoUsuarioInp.style.display = 'none';
        manoCrupierInp.style.display = 'none';
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
            juego.style.display = '';
        }, 2000);
        sumaDeDinero(plata);
    } else if (gano === false) {
        mensajeDiv.style.display = '';
        juego.style.display = 'none';
        mensaje.textContent = 'Perdiste :(';
        manoUsuarioInp.style.display = 'none';
        manoCrupierInp.style.display = 'none';
        if(money === 0){
            juego.style.display = 'none';
            setTimeout(() => {
                window.location.href = ""; 
        }, 2000);
        }else{
            setTimeout(() => {
                mensajeDiv.style.display = 'none';
                juego.style.display = '';
            }, 2000);
        }
    } else {
        mensajeDiv.style.display = '';
        juego.style.display = 'none';
        mensaje.textContent = 'Empate :/';
        manoUsuarioInp.style.display = 'none';
        manoCrupierInp.style.display = 'none';
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
            juego.style.display = '';
        }, 2000);
        devolverDinero(plata);
    }

    
}

function sumaDeDinero(plata){
    money = money + (plata*2);
    plataActual.value = `$${money}`;
}

function restaDeDinero(plata){
    money = money - plata;
    plataActual.value = `$${money}`;
}
function devolverDinero(plata){
    money = money + plata;
    plataActual.value = `$${money}`;
}

start.addEventListener('click', () => {

    manoUsuarioInp.style.display = 'none';
    manoCrupierInp.style.display = 'none';
    plataActual.value = `$${money}`;

    juego.style.display = '';
    startDiv.style.display = 'none';

    let baraja = crearBaraja();
    barajar(baraja);

    const manoUsuario = [];
    const manoCrupier = [];

    function hitBtn() {
        const plata = parseFloat(document.getElementById('plata').value);
        manoUsuario.push(repartir(baraja));
        mostrarCartas(manoUsuario, manoCrupier);

        if (valorMano(manoUsuario) > 21) {
            terminar(false, plata);
        }
    }

    function standBtn() {
        const plata = parseFloat(document.getElementById('plata').value);
        while (valorMano(manoCrupier) < 17) {
            manoCrupier.push(repartir(baraja));
        }
        mostrarCartas(manoUsuario, manoCrupier);

        if (valorMano(manoCrupier) > 21 || valorMano(manoCrupier) < valorMano(manoUsuario)) {
            terminar(true, plata);
        } else if (valorMano(manoCrupier) > valorMano(manoUsuario)) {
            terminar(false, plata);
        } else {
            terminar(null, plata);
        }
    }

    deal.addEventListener('click', () => {

        if(baraja.length < 10){
            baraja = crearBaraja();
            barajar(baraja);
        }

        hit.removeEventListener('click', hitBtn);
        stand.removeEventListener('click', standBtn);

        manoUsuario.length = 0;
        manoCrupier.length = 0;
        const plata = parseFloat(document.getElementById('plata').value);

        if (!isNaN(plata) && plata <= money && plata > 0) {
            manoUsuarioInp.style.display = '';
            manoCrupierInp.style.display = '';
            restaDeDinero(plata);

            manoUsuario.push(repartir(baraja));
            manoCrupier.push(repartir(baraja));
            manoUsuario.push(repartir(baraja));
            manoCrupier.push(repartir(baraja));

            mostrarCartas(manoUsuario, manoCrupier);

            deal.disabled = true;
            hit.disabled = false;
            stand.disabled = false;

            if (valorMano(manoUsuario) === 21 && valorMano(manoCrupier) !== 21) {
                terminar(true, plata);
            }else if (valorMano(manoUsuario) === 21 && valorMano(manoCrupier) === 21) {
                terminar(null, plata);
            }

            hit.addEventListener('click', hitBtn);
            stand.addEventListener('click', standBtn);
        } else {
            alert('Valor ingresado incorrecto o insuficiente');
        }
    });
});



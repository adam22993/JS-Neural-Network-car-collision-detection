const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 750;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 3);

const N = 300;
const cars = generateCars(N)
let bestCar = cars[0]
if (localStorage.getItem("bestBrain")) {
    bestCar.brain = JSON.parse(localStorage.getItem(
        localStorage.getItem("bestBrain")));
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2.2)
];


animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for(let i=0; i<N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50,"AI", Math.random()+2.5));
    }
    return cars;
}

function animate(time) {
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].update(road.boarders, []);
    }
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.boarders, traffic);
    }
    bestCar = cars.find(car => car.y === Math.min(...cars.map(car => car.y)));


    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // these two lines are used to make the car appear to move up and down the road
    carCtx.save()
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].draw(carCtx, 'darkred');
    }

    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'darkblue');
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'darkblue', true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}



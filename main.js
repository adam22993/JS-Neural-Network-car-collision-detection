const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2.2),
];


animate();

function animate() {
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].update(road.boarders, []);
    }
    car.update(road.boarders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    // these two lines are used to make the car appear to move up and down the road
    carCtx.save()
    carCtx.translate(0, -car.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].draw(carCtx, 'darkred');
    }
    car.draw(carCtx, 'darkblue');

    carCtx.restore();

    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}



const canvas = document.getElementById('canvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width/2, canvas.width*0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50,"DUMMY", 2.2),
];


animate();

function animate() {
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].update(road.boarders, []);
    }
    car.update(road.boarders, traffic);

    canvas.height = window.innerHeight;

    // these two lines are used to make the car appear to move up and down the road
    ctx.save()
    ctx.translate(0, -car.y+canvas.height*0.7);

    road.draw(ctx);
    for(let i = 0 ; i < traffic.length; i++){
        traffic[i].draw(ctx, 'darkred');
    }
    car.draw(ctx, 'darkblue');

    ctx.restore();
    requestAnimationFrame(animate);
}



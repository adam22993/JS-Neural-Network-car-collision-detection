const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = 200;

const road = new Road(canvas.width/2, canvas.width*0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
    car.update();
    canvas.height = window.innerHeight;

    // these two lines are used to make the car appear to move up and down the road
    ctx.save()
    ctx.translate(0, -car.y+canvas.height*0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}

// the lines appear off center because the canvas is not centered in the page
// the canvas is centered in the page by adding the following to the css:
// #canvas {
//     position: absolute;
//     top: 50%;
//     left: 50%;

//     transform: translate(-50%, -50%);
//     background-color: #333;


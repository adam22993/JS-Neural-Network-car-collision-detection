class Car{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed= 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }
    draw(ctx) {
        ctx.fillStyle = this.damaged ? "gray" : "black";

        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle);
        //
        // ctx.beginPath();
        // ctx.rect(
        //     this.width / -2,
        //     this.height / -2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill();
        // ctx.restore();

        // all of the above is replaced by the following:
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        this.sensor.draw(ctx); // the car has the responsibility of drawing the sensor
    }

    update(roadBoarders) {
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBoarders);
        }

        this.sensor.update(roadBoarders);
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x + Math.sin(this.angle - alpha) * rad,
            y: this.y + Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(this.angle + alpha) * rad,
            y: this.y + Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(this.angle + Math.PI - alpha) * rad,
            y: this.y + Math.cos(this.angle + Math.PI - alpha) * rad
        });
        points.push({
            x: this.x + Math.sin(this.angle + Math.PI + alpha) * rad,
            y: this.y + Math.cos(this.angle + Math.PI + alpha) * rad
        });

        return points;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if(this.speed>this.maxSpeed){ // forward max speed
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){ // reverse max speed is half of forward speed
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0){ // forward friction
            this.speed-=this.friction;
        }
        if(this.speed<0){ // reverse friction
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){ // stop if speed is less than friction
            this.speed=0;
        }
        // if(this.controls.left){
        //     this.angle+=0.03;
        // }
        // if(this.controls.right){
        //     this.angle-=0.03;
        // }
        if(this.speed!==0){ // replacing the above two if statements
            const flip = this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }
        this.y -= Math.cos(this.angle) * this.speed
        this.x -= Math.sin(this.angle) * this.speed;
    }


    #assessDamage(roadBoarders) {
        // this collision detection is not perfect, but it is good enough for this example
        // the issue that rises here is what happens when the car is moving fast enough to jump over the road boarders?
        // the car will not detect the collision and will not be damaged
        // one solution is to increase the number of rays in the sensor
        // another solution is to increase the length of the rays in the sensor
        // another solution is to use a different collision detection algorithm
        for(let i = 0; i < roadBoarders.length; i++){
            if(polysIntersect(this.polygon, roadBoarders[i])){
                return true;
            }
        }
        return false;
    }
}
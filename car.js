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

        this.controls = new Controls();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            this.width / -2,
            this.height / -2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.#move();
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


}
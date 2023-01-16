class RPS { 

    constructor(text, {x, y}) {
        this.text = text;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-5,5), random(-5,5));
        this.acceleration = createVector(random(-2,2), random(-2,2));
        this.maxAcceleration = 2;
        this.maxSpeed = 5;
        this.visualRadius = 200;
        this.avoidanceRadius = 50;
    }

    draw() {
        fill(255);
        text(this.text, this.position.x, this.position.y);
    }

    move() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    checkEdges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    flock(boids, target, enemy) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let steering = this.seek(target);
        let avoid = this.avoidBoids(enemy);

        alignment.mult(0.5);
        cohesion.mult(-1);
        separation.mult(5);
        steering.mult(3);
        avoid.mult(3);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        this.acceleration.add(steering);
        this.acceleration.add(avoid);
    }

    align(boids) {
        let perceptionRadius = this.visualRadius + 500;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxAcceleration);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = this.visualRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxAcceleration);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = this.avoidanceRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxAcceleration);
        }
        return steering;
    }

    seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed + 10);
        let steering = p5.Vector.sub(desired, this.velocity);
        steering.limit(this.maxAcceleration);
        return steering;
    }

    averagePosition(boids) {
        let average = createVector();
        for (let other of boids) {
            average.add(other.position);
        }
        average.div(boids.length);
        return average.add(15,15);
    }

    avoidBoids(boids) {
        let perceptionRadius = this.avoidanceRadius + 30;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxAcceleration);
        }
        return steering;
    }

    checkCollision(boids){
        for(let i=0; i<boids.length; i++){
            let d = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);     
            if (d < 20) {
                return true;
            }
        }
        return false;
    }
}

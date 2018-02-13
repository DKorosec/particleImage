class PullAwayZone {
    constructor(x, y, radius, out_gravity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.out_gravity = out_gravity;
    }

    applyTo(particle) {

        let distance = ((this.x - particle.x) ** 2 + (this.y - particle.y) ** 2) ** 0.5; //euclid distance
        if (distance > this.radius)
            return;

        //norm
        let z2p_x = (-this.x + particle.x) / distance;
        let z2p_y = (-this.y + particle.y) / distance;

        let push_power = (1 - distance / this.radius) * this.out_gravity;

        let p_vel_x = z2p_x * push_power;
        let p_vel_y = z2p_y * push_power;

        particle.xv += p_vel_x;
        particle.yv += p_vel_y;

    }
}
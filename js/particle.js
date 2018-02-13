class Particle {
    constructor(x, y, max_x, max_y) {
        this.x = x;
        this.y = y;
        this.max_x = max_x;
        this.max_y = max_y;
        this.xv = 0;
        this.yv = 0;
        this.history_x = [];
        this.history_y = [];
    }

    setVelocity(dx, dy) {
        this.xv = dx;
        this.yv = dy;
        return this;
    }

    update(store_history = false) {
        this.yv += Particle.Gravity;
        if (this.x > this.max_x) {
            this.x = this.max_x - 1;
            this.xv *= -1 //* Particle.Friction;
        }
        if (this.x < 0) {
            this.x = 1;
            this.xv *= -1 //* Particle.Friction;
        }

        if (this.y > this.max_y) {
            this.y = this.max_y;
            this.yv *= -1 * Particle.Friction;
        }
        if (this.y < 0) {
            this.y = 1;
            this.yv *= -1;
        }

        if (store_history) {
            this.history_x.push(this.x);
            this.history_y.push(this.y);
        }
        this.x += this.xv;
        this.y += this.yv;
    }

    historyArrayConverged(debug = false) {
        let min_len = 50;
        let min_diff = min_len;
        if (this.history_y.length < min_len)
            return false;
        let ediff = 0;
        for (let i = this.history_y.length - min_len; i < this.history_y.length - 1; i++) {
            let diff = Math.abs(this.history_y[i] - this.history_y[i + 1]);
            ediff += diff < 1 ? 0 : diff;
        }
        if (debug)
            console.log(ediff, '------------');
        return ediff < min_diff;
    }

    updateBackInTime() {
        let [px, py] = [this.history_x.pop(), this.history_y.pop()];
        if (px == undefined || py == undefined) {
            return;
        }
        this.x = px;
        this.y = py;
    }

    render(ctx) {
        ctx.fillRect(this.x - Particle.Size / 2, this.y - Particle.Size / 2, Particle.Size, Particle.Size);
    }

}
Particle.Gravity = 0.4;
Particle.Size = 2;
Particle.Friction = 0.2;

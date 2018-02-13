raw_img = null;
async function main() {
    ctx = canvas.getContext('2d');
    canvas.$mouse = {
        x: Number.MAX_SAFE_INTEGER,
        y: Number.MAX_SAFE_INTEGER
    };
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = (() => {
            var rect = this.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        })();
        canvas.$mouse = mousePos;

    }, false);


    let img = new Image();
    img.src = 'test.png';
    await new Promise((resolve, reject) => {
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            console.log(this);
            ctx.drawImage(this, 0, 0);
            resolve(true);
        }
    });
    raw_img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let img_data = raw_img.data;
    img_data.setGrayScale = function (pixel_i, value) {
        let i = pixel_i * 4;
        this[i] = this[i + 1] = this[i + 2] = value;
    }

    document.onkeypress();
}

document.onkeypress = e => {
    if (!raw_img)
        return;
    let particles = dither(raw_img);
    let use_inverse = false;
    let pull_away_points = [
        new PullAwayZone(canvas.width / 2, canvas.height / 1.5, canvas.width / 10, 8.0),
        new PullAwayZone(0, canvas.height / 2, canvas.width / 5, 5.0),
        new PullAwayZone(canvas.width, canvas.height / 2, canvas.width / 5, 5.0)
    ];


    const logicLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let inverse = true;
        let i = 0;
        for (let p of particles) {
            p.render(ctx);
            if (!use_inverse) {
                //[pull_away_point.x, pull_away_point.y] = [canvas.$mouse.x, canvas.$mouse.y];
                for (let pull_away_point of pull_away_points) {
                    pull_away_point.applyTo(p);
                }
                p.update(true);
                if (!p.historyArrayConverged())
                    inverse = false;
            } else {
                p.updateBackInTime();
            }
            ++i;
        }
        if (inverse)
            use_inverse = true;

        requestAnimationFrame(logicLoop);
    }
    logicLoop();
    document.onkeypress = () => null;
}
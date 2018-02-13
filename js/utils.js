function toGrayscale(img_data) {
    for (let i = 0; i < img_data.length; i += 4) {
        let sum = img_data[i] + img_data[i + 1] + img_data[i + 2];
        img_data.setGrayScale(i / 4, Math.floor(sum / 3));
    }
}

function dither(raw_img, T = 128) {
    let img_data = raw_img.data;
    toGrayscale(img_data);
    let getIndex = (x, y) => y * raw_img.width * 4 + x * 4;
    for (let y = 0; y < raw_img.height - 1; y++) {
        for (let x = 1; x < raw_img.width - 1; x++) {
            let old_px = img_data[getIndex(x, y)];
            let new_px = Math.round(old_px / 255) * 255;
            let error = old_px - new_px;
            let vectors = [
                [1, 0, error * 7 / 16],
                [-1, 1, error * 3 / 16],
                [0, 1, error * 5 / 16],
                [1, 1, error * 1 / 16]
            ];
            for (let vec of vectors) {
                let i = getIndex(x + vec[0], y + vec[1]);
                let new_val = img_data[i] + vec[2];
                img_data.setGrayScale(i / 4, new_val);
            }
        }
    }

    let particles = [];
    let rng = max => (Math.random() * 2 - 1) * max;

    for (let y = 0; y < raw_img.height - 1; y++) {
        for (let x = 1; x < raw_img.width - 1; x++) {
            let i = getIndex(x, y);
            let new_val = img_data[i] < T ? 0 : 255;
            if (new_val == 0) {
                particles.push(new Particle(x, y, raw_img.width, raw_img.height).setVelocity(rng(1), rng(1)));
            }
            img_data.setGrayScale(i / 4, new_val);
        }
    }
    return particles;
}
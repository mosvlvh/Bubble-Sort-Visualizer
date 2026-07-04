let values = [];

const ballSize = 70;
const gap = 30;
const step = ballSize + gap;

const stage = document.getElementById("stage");
const stickman = document.getElementById("stickman");
const startBtn = document.getElementById("startBtn");
const numbersInput = document.getElementById("numbersInput");

let ballEls = [];

function createBalls() {

    // حذف الكرات القديمة
    document.querySelectorAll(".ball").forEach(ball => ball.remove());

    ballEls = [];

    values.forEach((value) => {
        const ball = document.createElement("div");
        ball.className = "ball";
        ball.textContent = value;

        stage.appendChild(ball);
        ballEls.push(ball);
    });
    stage.style.width = `${Math.max(600, values.length * step + 100)}px`;
    
    positionBalls();
    positionStickman(0);
}

function positionBalls() {
    ballEls.forEach((el, i) => {
        el.style.transform = `translateX(${i * step}px)`;
    });
}

function positionStickman(j) {
    const x = j * step + ballSize + gap / 2;
    stickman.style.transform = `translateX(${x}px)`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffleBalls() {

    for (let i = values.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [values[i], values[j]] = [values[j], values[i]];
        [ballEls[i], ballEls[j]] = [ballEls[j], ballEls[i]];
    }

    positionBalls();
}

async function bubbleSortVisual() {

    const n = values.length;

    for (let i = 0; i < n - 1; i++) {

        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {

            positionStickman(j);

            ballEls[j].classList.add("active");
            ballEls[j + 1].classList.add("active");

            await sleep(650);

            if (values[j] > values[j + 1]) {

                [values[j], values[j + 1]] = [values[j + 1], values[j]];
                [ballEls[j], ballEls[j + 1]] = [ballEls[j + 1], ballEls[j]];

                positionBalls();

                swapped = true;

                await sleep(650);
            }

            ballEls[j].classList.remove("active");
            ballEls[j + 1].classList.remove("active");
        }

        if (!swapped)
            break;
    }

    ballEls.forEach(ball => ball.classList.add("sorted"));

    startBtn.disabled = false;
    startBtn.textContent = "أعد الترتيب";
}

startBtn.addEventListener("click", async () => {

    // أول مرة
    if (startBtn.textContent === "ابدأ الترتيب") {

        const input = numbersInput.value.trim();

        if (input === "") {
            alert("أدخل الأرقام أولاً.");
            return;
        }

        values = input
            .split(",")
            .map(x => Number(x.trim()))
            .filter(x => !isNaN(x));

        if (values.length < 2) {
            alert("أدخل رقمين على الأقل.");
            return;
        }

        createBalls();

    } else {

        ballEls.forEach(ball => ball.classList.remove("sorted"));

        shuffleBalls();

        await sleep(600);
    }

    startBtn.disabled = true;

    bubbleSortVisual();
});
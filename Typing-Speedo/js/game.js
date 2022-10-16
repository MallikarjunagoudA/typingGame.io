const canvas = $("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 250;

let speedY = 0.6;

class Wall {
    constructor(x, y, w, h, col) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;
    }
    draw() {
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        this.draw();
    }
}

class Block {
    constructor(x, y, w, h, col, word) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.col = col;
        this.vel = {
            x: 0,
            y: speedY
        };
        this.word = word;
        this.active = true;
    }
    draw() {
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.word, canvas.width/2, this.y + this.h - 4);
    }
    update() {
        this.draw();
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
}

// Wall
let dis = 80;
wall1 = new Wall(canvas.width/2 - dis, 100, 10, 100, "#08f");
wall2 = new Wall(canvas.width/2 + dis - wall1.w, wall1.y, wall1.w, wall1.h, wall1.col);
wall3 = new Wall(wall1.x, wall1.y + wall1.h, wall2.x - wall1.x + wall1.w, wall1.w, wall1.col);

// blocks
let blocks = [];
let collisionY = wall3.y;
let lastLetter = null, currentBlock = null;
let score = 0;
let gameOver = false;

function createBlock() {
    let words = [
        "HimachalPradesh",
        "Maharashtra" ,
        "Rajasthan",
        "TamilNadu",
        "Munnar",
        "Coorg",
        "Manali",
        "Ooty",
        "Delhi",
        "Goa",
        "Varanasi",
        "Kolkata",
        "Amritsar",
        "Sikkim",
        "Shimla",
        "Kashmir",
        "Ladakh",
        "Mumbai",
        "Kanyakumari",
        "Hyderabad",
        "Mysore"
        ];
        blocks.push(new Block(wall1.x + wall1.w, -25, wall3.w - wall1.w*2, 20, "#202830", words[Math.floor(Math.random() * words.length)]));
    }
    createBlock();

    function animate() {
        animation = requestAnimationFrame(animate);
        ctx.fillStyle = "#f1f5f8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        wall1.update();
        wall2.update();
        wall3.update();

        blocks.forEach(block => {
            block.update();
            if (block.y + block.h > collisionY && block.active && !gameOver) {
                block.active = false;
                block.vel.y = 0;
                block.y = collisionY - block.h;
                createBlock();
                collisionY -= block.h;
            }
        })

        if (collisionY - blocks[0].h < wall1.y) {
            blocks.splice(blocks.length -1, 1);
            gameOver = true;
            cancelAnimationFrame(animation);
            blocks[blocks.length -1].y = collisionY;
            blocks[blocks.length -1].update();
            $("#restart").style.opacity = "1";
            $("#restart").style.pointerEvents = "all";
        }

    }
    // animate()

    $("#openKeyboard").addEventListener("click", () => {
        $("#game-input").focus();
    })

    $("#game-input").addEventListener("input", () => {
        if ($("#game-input").value.length == 1) {
            lastLetter = $("#game-input").value;
        } else {
            lastLetter = $("#game-input").value.charAt($("#game-input").value.length -1);
        }

        if (blocks[blocks.length -1].word != "Press Space!") {
            if (lastLetter != blocks[blocks.length -1].word.charAt(0)) {
                score -= 5;
                $("#score").innerHTML = score;
            }
        } else {
            if (lastLetter == " ") {
                score += Math.round(Math.random() * (15 - 5) + 5);
                $("#score").innerHTML = score;
            }
        }

        if (lastLetter == blocks[blocks.length -1].word.charAt(0) && blocks[blocks.length -1].word != "Press Space!") {
            blocks[blocks.length -1].word = blocks[blocks.length -1].word.slice(1, blocks[blocks.length]);
            if (blocks[blocks.length -1].word == "") {
                blocks[blocks.length -1].word = "Press Space!";
            }
        } else if (blocks[blocks.length -1].word == "Press Space!") {
            if (lastLetter == " ") {
                blocks.splice(blocks.length -1, 1);
                createBlock();
            }
        }


    })
    function restartGame() {
        blocks = [];
        gameOver = false;
        collisionY = wall3.y;
        score = 0;
        speedY = 0.6;
        $("#score").innerHTML = score;
        createBlock();
        animate();
        $("#restart").style.opacity = "0";
        $("#restart").style.pointerEvents = "none";
    }
    $("#restart").addEventListener("click", restartGame);

    setInterval(() => {
        speedY += 0.01;
    }, 90000)

    // }



    $("#startGameBtn").addEventListener("click", () => {
        container.style.display = "none";
        nav.style.display = "none";
        restartGame();
        $("#game-container").style.display = "block";
        window.scrollTo(0, 0);
    })
    $("#game-back-btn").addEventListener("click", () => {
        $("#game-container").style.display = "none";
        container.style.display = "block";
        nav.style.display = "flex";
        cancelAnimationFrame(animation);
        // $("#game-input").value = "";
    })


    $("#contact-us-submit-btn").addEventListener("click", e => {
        e.preventDefault();
        sendMail();
    })

    function sendMail() {
        let name = $("#contact-us-name").value;
        let subject = $("#contact-us-subject").value;
        let message = $("#contact-us-message").value;
        message = message.replace(/\n/g,
            "%0A");
        let email = "avinash13032006@gmail.com";

        let url = `mailto:${email}?subject=${subject}%20-%20${name}&body=${message}`;
        location.href = url;
    }


    $("#input").addEventListener("paste", e => {
        e.preventDefault();
    })

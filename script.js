/* ============================================================
   MOBILE MENU
============================================================ */
function toggleMenu(){
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("dropdown").classList.toggle("show");
}

/* ============================================================
   PUZZLE GAME (UNCHANGED)
============================================================ */
let firstTile = null;
let timeLeft = 15;
let timer;
let gameStarted = false;

function shufflePuzzle() {
    let grid = document.getElementById("puzzleGrid");
    let tiles = Array.from(grid.children);
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach(t => grid.appendChild(t));
}

function startPuzzle() {
    clearInterval(timer);
    timeLeft = 15;
    gameStarted = true;

    document.getElementById("puzzleGrid").classList.remove("locked");
    document.getElementById("puzzleResult").innerHTML = "";
    document.getElementById("timer").innerHTML = "Time Left: 15s";

    shufflePuzzle();

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerHTML = "Time Left: " + timeLeft + "s";

        if (timeLeft <= 0) {
            clearInterval(timer);
            gameStarted = false;
            document.getElementById("puzzleGrid").classList.add("locked");
            document.getElementById("puzzleResult").innerHTML = "⏳ Time's up!";
        }
    }, 1000);
}


function selectTile(img) {
    if (!gameStarted) return;

    if (!firstTile) {
        firstTile = img;
        img.style.border = "3px solid #b79a7d";
        return;
    }

    let tempSrc = firstTile.src;
    let tempId = firstTile.dataset.id;

    firstTile.src = img.src;
    firstTile.dataset.id = img.dataset.id;

    img.src = tempSrc;
    img.dataset.id = tempId;

    firstTile.style.border = "2px solid #e0e0e0";
    firstTile = null;

    checkWin();
}

function checkWin() {
    let tiles = document.querySelectorAll(".puzzle-grid img");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].dataset.id != i + 1) return;
    }

    clearInterval(timer);
    document.getElementById("puzzleGrid").classList.add("locked");
    document.getElementById("puzzleResult").innerHTML =
        "🎉 DONE! Use code HANDMADE10";

    document.getElementById("coupon").value = "HANDMADE10";
    localStorage.setItem("puzzlePlayed", "yes");

    let priceInput = document.getElementById("price");
    if (priceInput.value) {
        priceInput.value = Number(priceInput.value) - 10;
    }
}

/* ============================================================
   PRODUCT SELECT
============================================================ */
function selectProduct(name, price) {
    document.getElementById("pname").value = name;
    document.getElementById("price").value = price;

    if (localStorage.getItem("puzzlePlayed") === "yes") {
        document.getElementById("price").value = price;
    }

    document.getElementById("orderForm").scrollIntoView({ behavior: "smooth" });
}

/* ============================================================
   CONFETTI EFFECT
============================================================ */
let canvas = document.getElementById("confettiCanvas");
let ctx = canvas ? canvas.getContext("2d") : null;
let confetti = [];
let animationFrame;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

if (canvas) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function startConfetti() {
  if (!ctx) return;

  confetti = [];

  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      s: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  }

  animateConfetti();
  setTimeout(stopConfetti, 1500);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    c.y += c.s;

    if (c.y > canvas.height) c.y = -5;
  });

  animationFrame = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* ============================================================
   RAZORPAY PAYMENT INTEGRATION
============================================================ */
let orderSubmitted = false;

document.getElementById("orderForm").addEventListener("submit", function(e){
    e.preventDefault();

    if(orderSubmitted){
        alert("Order already placed!");
        return;
    }

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let pname = document.getElementById("pname").value;
    let price = document.getElementById("price").value;

    if(!name || !phone || !address || !pname || !price){
        alert("Please fill all required fields.");
        return;
    }

    var options = {
        "key": "rzp_live_SMK99MSb5eHF92",   
        "amount": Number(price) * 100,
        "currency": "INR",
        "name": "V Crafts Studio",
        "description": pname,
        "handler": function (response){

            orderSubmitted = true;

            // Add Payment ID to form
            let form = document.getElementById("orderForm");

            let paymentInput = document.createElement("input");
            paymentInput.type = "hidden";
            paymentInput.name = "Payment ID";
            paymentInput.value = response.razorpay_payment_id;
            form.appendChild(paymentInput);

            // Confetti 🎉
            if(typeof startConfetti === "function"){
                startConfetti();
            }

            alert("🎉 Payment Successful! Order placed successfully. We will contact you soon.");

            // Submit form to email
            form.submit();
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": "#8e44ff"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
});
/* ============================================================
   REVIEW POPUP (UNCHANGED)
============================================================ */
function openReviewPopup() {
    document.getElementById("reviewPopup").style.display = "flex";
}

function closeReviewPopup() {
    document.getElementById("reviewPopup").style.display = "none";
}

function submitReview() {
    let name = document.getElementById("reviewName").value;
    let text = document.getElementById("reviewText").value;

    if (!name || !text) {
        alert("Please type your name and review.");
        return;
    }

    database.ref("reviews").push({
        name, text, time: Date.now()
    });

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";
    closeReviewPopup();
}

/* ============================================================
   AUTO FILL FROM URL
============================================================ */
window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const productName = params.get("name");
    const productPrice = params.get("price");

    if (productName && document.getElementById("pname")) {
        document.getElementById("pname").value = productName;
    }

    if (productPrice && document.getElementById("price")) {
        document.getElementById("price").value = productPrice;
    }
});
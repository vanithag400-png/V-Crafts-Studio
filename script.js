/* ============================================================
   MOBILE MENU
============================================================ */
function toggleMenu(){
    
    // ⭐ AUTO SCROLL TO TOP WHEN MENU IS CLICKED
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    document.getElementById("dropdown").classList.toggle("show");
}

/* ============================================================
   PUZZLE GAME
============================================================ */
let firstTile = null;
let timeLeft = 15;
let timer;
let gameStarted = false;

// Shuffle puzzle tiles
function shufflePuzzle() {
    let grid = document.getElementById("puzzleGrid");
    let tiles = Array.from(grid.children);
    tiles.sort(() => Math.random() - 0.5);
    tiles.forEach(t => grid.appendChild(t));
}

// Start Timer + Unlock Puzzle
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

// Swap tiles logic
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

// Check puzzle complete
function checkWin() {
    let tiles = document.querySelectorAll(".puzzle-grid img");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].dataset.id != i + 1) return;
    }

    clearInterval(timer);
    document.getElementById("puzzleGrid").classList.add("locked");
    document.getElementById("puzzleResult").innerHTML =
        "🎉 DONE! Use code <strong>HANDMADE10</strong>";

    document.getElementById("coupon").value = "HANDMADE10";
    localStorage.setItem("puzzlePlayed", "yes");

    let priceInput = document.getElementById("price");
    if (priceInput.value) {
        priceInput.value = Number(priceInput.value) - 10;
    }

    startConfetti();
}

/* ============================================================
   CONFETTI
============================================================ */
let canvas = document.getElementById("confettiCanvas");
let ctx = canvas.getContext("2d");
let confetti = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

function startConfetti() {
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
    setTimeout(stopConfetti, 1000);
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
   ORDER FORM SUBMISSION
============================================================ */
function sendOrder(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let pname = document.getElementById("pname").value;
    let price = document.getElementById("price").value;
    let coupon = document.getElementById("coupon").value;
    let txn = document.getElementById("txn").value.trim();

    if (!name || !phone || !address ) {
        alert("Please fill all required fields.");
        return;
    }
    if (!txn || txn.length < 5) {
        alert("Please enter a valid Transaction ID.");
        return;
    }

    let orderData = {
        name, phone, address,
        product: pname,
        price,
        coupon,
        transaction: txn
    };

    // Send to Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbwhao0F4jMxv51mrpulV-x8-mNRoE5GkATawgRsNcD5jO1gdrcLVm04yn_ghxk9L1AE/exec", {
        method: "POST",
        body: JSON.stringify(orderData)
    });

    // WhatsApp
    let message =
`NEW ORDER RECEIVED

Name - ${name}
Phone - ${phone}
Address - ${address}

Product - ${pname}
Final Price - ₹${price}
Coupon - ${coupon}
Transaction ID - ${txn}

Thank you
V Crochet Studio`;

    let whatsappURL = "https://wa.me/916360693160?text=" + encodeURIComponent(message);

    document.getElementById("orderSuccess").style.display = "block";
    setTimeout(() => {
        document.getElementById("orderSuccess").style.display = "none";
        window.location.href = whatsappURL;
    }, 1200);
}
/* ============================================================
   INTRO SCREEN
============================================================ */
setTimeout(() => {
    if (!localStorage.getItem("skipIntro")) {
        let intro = document.getElementById("introScreen");
        if (intro) intro.style.display = "none";
    }
}, 2500);

if (localStorage.getItem("skipIntro")) {
    let intro = document.getElementById("introScreen");
    if (intro) intro.style.display = "none";
    localStorage.removeItem("skipIntro");
}

/* ============================================================
   HOME PAGE PRODUCT (puzzle coupon)
============================================================ */
function selectProduct(name, price) {
    document.getElementById("pname").value = name;
    document.getElementById("price").value = price;

    if (localStorage.getItem("puzzlePlayed") === "yes") {
        document.getElementById("price").value = price - 10;
    }

    document.getElementById("orderForm").scrollIntoView({ behavior: "smooth" });
}

/* ============================================================
   MORE PRODUCTS → SEND PRODUCT TO HOME PAGE
============================================================ */
function orderThis(event) {
    event.stopPropagation();

    let card = event.target.closest(".more-product-card");

    let pname = card.querySelector(".mp-name").innerText;
    let pprice = card.querySelector(".mp-price").innerText;

    localStorage.setItem("orderName", pname);
    localStorage.setItem("orderPrice", pprice);
    localStorage.setItem("skipIntro", "yes");

    window.location.href = "index.html#order";
}

/* ============================================================
   AUTO-FILL WHEN COMING FROM MORE PRODUCTS
============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    let name = localStorage.getItem("orderName");
    let price = localStorage.getItem("orderPrice");

    if (name && price) {
        let nameInput = document.getElementById("pname");
        let priceInput = document.getElementById("price");

        if (nameInput) nameInput.value = name;
        if (priceInput) priceInput.value = price;

        localStorage.removeItem("orderName");
        localStorage.removeItem("orderPrice");

        document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    }
});

/* ============================================================
   REVIEW POPUP + FIREBASE
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

    // Save to Firebase
    database.ref("reviews").push({
        name, text, time: Date.now()
    });

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";
    closeReviewPopup();
}
/* ============================================================
   REVIEW JAR → CREATE POLAROID + ANIMATION
============================================================ */

function addReviewCard(name, text) {
    let area = document.querySelector(".polaroid-area");

    let card = document.createElement("div");
    card.className = "polaroid-card";

    // Polaroid content
    card.innerHTML = `
        <div class="pin">📌</div>
        <p><b>${name}</b><br>${text}</p>
    `;

    // Start small at jar
    card.style.opacity = "0";
    card.style.transform = "translateY(60px) scale(0.7)";
    card.style.transition = "0.8s ease";

    area.appendChild(card);

    // Animate to ribbon
    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0px) rotate(-5deg)";
    }, 50);
}

/* ============================================================
   LOAD REVIEWS FROM FIREBASE + DISPLAY
============================================================ */
database.ref("reviews").on("value", snapshot => {
    let area = document.querySelector(".polaroid-area");
    area.innerHTML = ""; // clear old

    snapshot.forEach(child => {
        let data = child.val();
        if (!data.name || !data.text) return;

        addReviewCard(data.name, data.text);
    });
});
function downloadOrderPDF() {
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let pname = document.getElementById("pname").value;
    let price = document.getElementById("price").value;
    let txn = document.getElementById("txn").value;

    if (!name || !phone || !address || !pname  || !price || !txn) {
        alert("Please fill the complete order form before downloading PDF.");
        return;
    }

    // Create PDF
    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    pdf.setFillColor(255, 240, 247);
    pdf.rect(5, 5, 200, 285, "F");

    pdf.setFontSize(22);
    pdf.setTextColor(120, 80, 140);
    pdf.text("V Crafts Studio", 105, 30,{align:"center"});

    // Polaroid box
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(25, 55, 160, 200, 8, 8, "F");

    pdf.setLineWidth(0.4);
    pdf.roundedRect(25, 55, 160, 200, 8, 8);

    pdf.setFontSize(14);
    pdf.text("Customer Details", 30, 75);
    pdf.setFontSize(12);
    pdf.text(`Name: ${name}`, 30, 90);
    pdf.text(`Phone: ${phone}`, 30, 105);
    pdf.text(`Address: ${address}`, 30, 120);

    pdf.setFontSize(14);
    pdf.text(" Order Details", 30, 145);
    pdf.setFontSize(12);
    pdf.text(`Product: ${pname}`, 30, 160);
    pdf.text(`Final Price: ${price}`, 30, 190);
    pdf.text(`Transaction ID: ${txn}`, 30, 205);

    pdf.setFontSize(14);
    pdf.text(" Thank you for shopping with us! Have a nice day ", 40, 240);

    // Save PDF
    pdf.save(`Order_${name.replace(/\s+/g, "_")}.pdf`);
}
/* AUTO FILL PRODUCT NAME & PRICE FROM URL */
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
function payPhonePe(){

  let amount = document.getElementById("price").value || 1;

  window.location.href =
  "upi://pay?pa=gvanitha26@ibl&pn=V Crafts Studio&am="+amount+"&cu=INR";
}


function payGPay(){

  let amount = document.getElementById("price").value || 1;

  window.location.href =
  "upi://pay?pa=vanithag400@oksbi&pn=V Crafts Studio&am="+amount+"&cu=INR";
}
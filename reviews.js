/* -------------------- FIREBASE SETUP --------------------- */
var firebaseConfig = {
    apiKey: "AIzaSyAm_d9Se8_el891KcWKYU5GxCDFlpyRHgE",
    authDomain: "vcrochet-reviews.firebaseapp.com",
    databaseURL: "https://vcrochet-reviews-default-rtdb.firebaseio.com",
    projectId: "vcrochet-reviews",
    storageBucket: "vcrochet-reviews.firebasestorage.app",
    messagingSenderId: "241162887129",
    appId: "1:241162887129:web:b2c9d679438a55b975c3c8"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.database();

/* -------------------- MENU --------------------- */
function toggleMenu() {
    // ⭐ AUTO SCROLL TO TOP WHEN MENU IS CLICKED
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    let menu = document.getElementById("dropdown");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

/* -------------------- OPEN/CLOSE POPUP --------------------- */
document.querySelector(".review-jar").onclick = () => {
    document.getElementById("reviewPopup").style.display = "flex";
};
function closeReviewPopup() {
    document.getElementById("reviewPopup").style.display = "none";
}

/* -------------------- SUBMIT REVIEW --------------------- */
let cardIndex = 0;

function submitReview() {
    let name = document.getElementById("reviewName").value.trim();
    let text = document.getElementById("reviewText").value.trim();

    if (!name || !text) {
        alert("Please fill all fields");
        return;
    }

// ✅ Max 70 characters check
if (text.length > 70) {
    alert("Review can be maximum 70 characters only.");
    return;
}

    let review = {
        name: name,
        text: text,
        time: Date.now()
    };

    db.ref("reviews").push(review).then(()=>{
        launchHearts();

setTimeout(() => {

    document.querySelector(".polaroid-area")
        .lastElementChild
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}, 200);

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";

    closeReviewPopup();
    })
}

/* -------------------- LOAD REVIEWS ----------------------- */
db.ref("reviews").on("value", snapshot => {
    let container = document.getElementById("reviewsContainer");
    container.innerHTML = "";
    cardIndex = 0;

    snapshot.forEach(child => {
        let r = child.val();
        let id = child.key;

        let card = document.createElement("div");
        card.className = "card " + (cardIndex % 2 === 0 ? "green" : "pink");

        card.innerHTML = `
    <div class="pin">📌</div>
    <p><b>${r.name}</b></p>
    <p>${r.text}</p>
`;

        container.appendChild(card);
        cardIndex++;
    });
});

function openReviewPopup() {
    document.getElementById("reviewPopup").style.display = "flex";
}

function closeReviewPopup() {
    document.getElementById("reviewPopup").style.display = "none";
}
/* ========================================================
   ADMIN DELETE – Delete ALL Reviews (Password Protected)
======================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const deleteLink = document.getElementById("adminDeleteLink");

    if (deleteLink) {
        deleteLink.addEventListener("click", function (event) {
            event.preventDefault();

            let pass = prompt("Enter Admin Password:");

            // 🔐 Change this password to anything YOU want
            if (pass === "vcrochetadmin") {

                if (confirm("Are you sure you want to delete ALL reviews?")) {

                    firebase.database().ref("reviews").remove()
                        .then(() => {
                            alert("All reviews deleted successfully!");
                            location.reload();
                        })
                        .catch(err => {
                            alert("Error deleting reviews: " + err);
                        });
                }

            } else {
                alert("Incorrect password!");
            }
        });
    }
});
function launchHearts() {
    const colors = ["❤️","💜","💙","💖","💛","🩷","💚","🤍","🧡","🖤"];

    for (let i = 0; i < 20; i++) {
        let heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerText = colors[Math.floor(Math.random() * colors.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "-20px";

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2000);
    }
}
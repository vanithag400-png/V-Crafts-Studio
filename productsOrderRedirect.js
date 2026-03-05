function orderFromOtherPage(productName, productPrice) {

    // Save product details
    localStorage.setItem("orderProductName", productName);
    localStorage.setItem("orderProductPrice", productPrice);

    // Go to homepage order form
    window.location.href = "index.html#order";
}


// Autofill when index page opens
window.addEventListener("load", function () {

    const pname = localStorage.getItem("orderProductName");
    const price = localStorage.getItem("orderProductPrice");

    if (pname && price) {

        // Fill order form fields using YOUR existing ids
        document.getElementById("pname").value = pname;
        document.getElementById("price").value = price;

        // Scroll to order form
        document.getElementById("orderForm").scrollIntoView({
            behavior: "smooth"
        });

        // Clear storage after fill
        localStorage.removeItem("orderProductName");
        localStorage.removeItem("orderProductPrice");
    }

});
/* SMOOTH ORDER REDIRECT — NO GLITCH */

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("orderProductName")) {

        // Hide intro instantly
        const intro = document.getElementById("introScreen") || 
                      document.getElementById("intro") || 
                      document.getElementById("splash");

        if (intro) intro.style.display = "none";

        // Wait for page to render fully
        setTimeout(() => {

            const orderSection = document.getElementById("order");

            if (orderSection) {
                window.scrollTo({
                    top: orderSection.offsetTop - 20,
                    behavior: "smooth"
                });
            }

        }, 500); // delay removes jump feeling
    }

});
/* DIRECT OPEN ORDER FORM — NO SCROLL, NO INTRO */

document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("orderProductName")) {

        // hide intro completely
        const intro = document.getElementById("introScreen") || 
                      document.getElementById("intro") || 
                      document.getElementById("splash");

        if (intro) intro.style.display = "none";

        // jump directly to order section instantly
        window.location.hash = "order";

    }

});
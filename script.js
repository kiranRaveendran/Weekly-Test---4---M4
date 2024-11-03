const API_URL = "https://openapi.programming-hero.com/api/phones?search=";
const phoneList = document.getElementById("phone-list");
const searchInput = document.getElementById("search-input");
const showAllBtn = document.getElementById("show-all-btn");
const phoneModal = document.getElementById("phoneModal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-btn");

document.getElementById("search-btn").addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchPhones(query);
    }
});

showAllBtn.addEventListener("click", () => {
    fetchPhones("phone", true); // Use "phone" as a general search term for more results
});

async function fetchPhones(query, showAll = false) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();

        if (data.status && data.data.length > 0) {
            // If "Show All" is clicked, display all phones without limiting to 5
            displayPhones(data.data, showAll);
            showAllBtn.style.display = data.data.length > 5 && !showAll ? "block" : "none";
        } else {
            phoneList.innerHTML = "<p>No results found.</p>";
            showAllBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        phoneList.innerHTML = "<p>Something went wrong.</p>";
    }
}

function displayPhones(phones, showAll = false) {
    phoneList.innerHTML = "";
    // Limit display to 5 phones unless "Show All" is clicked
    const phonesToDisplay = showAll ? phones : phones.slice(0, 5);
    phonesToDisplay.forEach(phone => {
        const phoneCard = document.createElement("div");
        phoneCard.classList.add("phone-card");
        phoneCard.innerHTML = `
            <img src="${phone.image}" alt="${phone.phone_name}">
            <h3>${phone.phone_name}</h3>
            <p>There are many variations of passages available, but the majority have suffered.</p>
            <button class="show-details-btn" onclick="showPhoneDetails('${phone.slug}')">Show Details</button>
        `;
        phoneList.appendChild(phoneCard);
    });
}

async function showPhoneDetails(slug) {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/phone/${slug}`);
        const data = await response.json();
        if (data.status) {
            const phone = data.data;
            modalBody.innerHTML = `
                <h2>${phone.name}</h2>
                <img class="modal_img" src="${phone.image}" alt="${phone.name}" style="width: 100px;">
                <p><strong>Brand:</strong> ${phone.brand}</p>
                <p><strong>Release Date:</strong> ${phone.releaseDate || "N/A"}</p>
                <p><strong>Features:</strong> ${Object.keys(phone.mainFeatures).map(
                    feature => `<br> ${feature}: ${phone.mainFeatures[feature]}`
                ).join('')}</p>
            `;
            phoneModal.style.display = "block"; // Show the modal
        } else {
            modalBody.innerHTML = "<p>Details not found.</p>";
            phoneModal.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching details:", error);
        modalBody.innerHTML = "<p>Something went wrong.</p>";
        phoneModal.style.display = "block";
    }
}

// Close the modal when the user clicks on <span> (x)
closeModalBtn.onclick = function() {
    phoneModal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == phoneModal) {
        phoneModal.style.display = "none";
    }
}

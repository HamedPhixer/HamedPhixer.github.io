// Function to create a thumbnail that opens the image directly in full size
function createSketchbookThumbnail(src, alt) {
    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");

    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = src;
    thumbnailImg.alt = alt;

    thumbnailDiv.appendChild(thumbnailImg);
    thumbnailDiv.onclick = () => openModal(src); // Use openModal on click
    return thumbnailDiv;
}

// Get the thumbnail container element
const thumbnailContainer = document.getElementById("thumbnail-container");

// Function to fetch and parse the sketchbook.txt file
function fetchSketchbookImages() {
    return fetch('../Config/sketchbook.txt')
        .then(response => response.text())
        .then(text => {
            // Split each line in the text file, filter out empty lines
            return text.split('\n').map(line => line.trim()).filter(line => line);
        })
        .catch(error => console.error('Error loading sketchbook images:', error));
}

// Fetch images and create thumbnails
fetchSketchbookImages().then(imageUrls => {
    const fragment = document.createDocumentFragment(); // Use a document fragment for efficient DOM updates

    imageUrls.forEach((imageUrl, index) => {
        const thumbnail = createSketchbookThumbnail(imageUrl, `Sketch ${index + 1}`);
        fragment.appendChild(thumbnail); // Append each thumbnail to the fragment
    });

    // Append the fragment to the container once all thumbnails are created
    thumbnailContainer.appendChild(fragment);
});

function openModal(src) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'flex';
    modalImg.src = src;
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.display = 'none';
    modal.classList.add('modal-overlay');
    modal.innerHTML = `<div class="modal-content"><img id="modal-image" src="" /></div>`;
    document.body.appendChild(modal);

    modal.onclick = () => (modal.style.display = 'none');
});


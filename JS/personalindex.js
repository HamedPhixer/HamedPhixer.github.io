// Function to create a thumbnail with overlay icons
function createThumbnail(src, alt, galleryPageUrl, hasMultipleImages, hasVideo, hasYouTube, hasSketchfab) {
    const thumbnailLink = document.createElement("a");
    thumbnailLink.href = galleryPageUrl;

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");

    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = src;
    thumbnailImg.alt = alt;
    thumbnailImg.loading = "lazy"; // Add lazy loading attribute

    const thumbnailTitle = document.createElement("div");
    thumbnailTitle.classList.add("thumbnail-title");
    thumbnailTitle.innerText = alt;

    let iconIndex = 0;

    if (hasMultipleImages) {
        const multipleImagesIcon = document.createElement("i");
        multipleImagesIcon.className = "fa-solid fa-layer-group overlay-icon";
        multipleImagesIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(multipleImagesIcon);
        iconIndex++;
    }

    if (hasVideo) {
        const videoIcon = document.createElement("i");
        videoIcon.className = "fa-solid fa-video overlay-icon";
        videoIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(videoIcon);
        iconIndex++;
    }

    if (hasYouTube) {
        const youtubeIcon = document.createElement("i");
        youtubeIcon.className = "fa-brands fa-youtube overlay-icon";
        youtubeIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(youtubeIcon);
        iconIndex++;
    }

    if (hasSketchfab) {
        const sketchfabIcon = document.createElement("i");
        sketchfabIcon.className = "fa-solid fa-cube overlay-icon";
        sketchfabIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(sketchfabIcon);
        iconIndex++;
    }

    thumbnailDiv.appendChild(thumbnailImg);
    thumbnailDiv.appendChild(thumbnailTitle);
    thumbnailLink.appendChild(thumbnailDiv);

    return thumbnailLink;
}

// Get the thumbnail container element
const thumbnailContainer = document.getElementById("thumbnail-container");

// Function to fetch and parse the description.txt file
function fetchProjectData(projectName) {
    const descriptionPath = `../PersonalProjects/${projectName}/description.txt`;
    const mediaPath = `../PersonalProjects/${projectName}/media.txt`;

    return Promise.all([
        fetch(descriptionPath).then(response => response.text()),
        fetch(mediaPath).then(response => response.text())
    ])
    .then(([descriptionText, mediaText]) => {
        const [title, description, tags, thumbnailUrl, htmlFileName] = descriptionText.split('---').map(line => line.trim());
        const galleryPageUrl = descriptionPath.replace('description.txt', htmlFileName);

        const mediaLines = mediaText.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
        const hasMultipleImages = mediaLines.filter(line => line.match(/\.(jpeg|jpg|gif|png)$/)).length > 1;
        const hasVideo = mediaLines.some(line => line.match(/\.(mp4)$/));
        const hasYouTube = mediaLines.some(line => line.includes('youtube.com'));
        const hasSketchfab = mediaLines.some(line => line.includes('sketchfab.com'));

        // Find the banner image
        const bannerImageLine = mediaLines.find(line => line.endsWith('*'));
        const bannerImageUrl = bannerImageLine ? bannerImageLine.replace('*', '').trim() : null;

        return { src: thumbnailUrl, alt: title, galleryPageUrl, hasMultipleImages, hasVideo, hasYouTube, hasSketchfab, bannerImageUrl };
    })
    .catch(error => console.error('Error loading project data:', error));
}

// Function to fetch the projects.txt file
function fetchProjects() {
    return fetch('../Config/personalprojects.txt')
        .then(response => response.text())
        .then(text => text.split('\n').map(line => line.trim()).filter(line => line))
        .catch(error => console.error('Error loading projects:', error));
}

// Fetch projects and create thumbnails
fetchProjects().then(projects => {
    let bannerImageSet = false;

    // Fetch project data for all projects
    const fetchProjectDataPromises = projects.map(projectName => fetchProjectData(projectName));

    Promise.all(fetchProjectDataPromises).then(projectDataArray => {
        // Preserve the order from `personalprojects.txt`
        const fragment = document.createDocumentFragment();

        projects.forEach((projectName, index) => {
            const artwork = projectDataArray[index];
            const thumbnail = createThumbnail(artwork.src, artwork.alt, artwork.galleryPageUrl, artwork.hasMultipleImages, artwork.hasVideo, artwork.hasYouTube, artwork.hasSketchfab);
            fragment.appendChild(thumbnail);

            // Set the banner image if not already set
            if (!bannerImageSet && artwork.bannerImageUrl) {
                document.querySelector('.top-container').style.backgroundImage = `url(${artwork.bannerImageUrl})`;
                bannerImageSet = true;
            }
        });

        thumbnailContainer.appendChild(fragment);
    }).catch(error => console.error('Error processing projects:', error));
});

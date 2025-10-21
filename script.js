document.querySelector('.menu-icon').addEventListener('click', () => {
    const headerContainer = document.querySelector('.header-container');

    // Toggle 'active' class on header
    document.querySelector('header').classList.toggle('active');
    
    // Check if .name-role exists
    // let element = document.querySelector('.name-role');
    // if (element) {
    //     // Remove it if it exists
    //     element.remove();
    // } else {
    //     console.log("object");
    //     // Create and add it if it doesn't exist
    //     element = document.createElement('div');
    //     element.className = 'name-role';
    //     element.innerHTML = `
    //         <h1>Solomon Bekele</h1>
    //         <h3>Full Stack Developer</h3>
    //     `;
    //     headerContainer.appendChild(element);
    // }
});

const uploadContainer = document.getElementById('uploadVideoContainer');
let videoInput = document.getElementById('videoInput');
let chooseVideoButton = document.getElementById('chooseVideoButton');

// Trigger file input when button is clicked
chooseVideoButton.addEventListener('click', () => videoInput.click());

// Centralized file processor
function handleFileSelection(file) {
  if (!file) return;

  // Clear previous content
  uploadContainer.innerHTML = '';
  uploadContainer.classList.remove('upload-video-container-before');
  uploadContainer.classList.add('upload-video-container-after');

  // Create video element
  const video = document.createElement('video');
  video.controls = true;
  video.autoplay = false;
  video.preload = 'metadata';      // load only metadata until play
  video.src = URL.createObjectURL(file);
  video.classList.add('uploaded-video');

  // Wrapper div for filename and buttons
  const fileButtonDiv = document.createElement('div');
  fileButtonDiv.classList.add('file_name-remove_button');

  // File name text
  const fileName = document.createElement('p');
  fileName.textContent = `File: ${file.name}`;
  fileName.classList.add('video-file-name');

  // Remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.classList.add('remove-video-button');

  // Replace button
  const replaceButton = document.createElement('button');
  replaceButton.textContent = 'Replace Video';
  replaceButton.classList.add('replace-video-button');

  // Handle remove button click
  removeButton.addEventListener('click', () => {
    URL.revokeObjectURL(video.src);

    // Restore original UI
    uploadContainer.classList.remove('upload-video-container-after');
    uploadContainer.classList.add('upload-video-container-before');

    uploadContainer.innerHTML = `
      <h3 class="upload-video-text">Upload a short introduction video</h3>
      <h3 class="video-format">MP4, WebM, or OGG format</h3>
      <button class="choose-video-button" id="chooseVideoButton">Choose Video File</button>
      <input type="file" id="videoInput" accept="video/mp4,video/webm,video/ogg" style="display: none;">
    `;

    chooseVideoButton = document.getElementById('chooseVideoButton');
    videoInput = document.getElementById('videoInput');

    chooseVideoButton.addEventListener('click', () => videoInput.click());
    videoInput.addEventListener('change', (e) => handleFileSelection(e.target.files[0]), { once: true });
  });

  // Handle replace button click
  replaceButton.addEventListener('click', () => {
    videoInput.click(); // trigger file picker again
    videoInput.addEventListener('change', (e) => handleFileSelection(e.target.files[0]), { once: true });
  });

  // Append elements
  fileButtonDiv.appendChild(fileName);
  fileButtonDiv.appendChild(removeButton);
  uploadContainer.appendChild(fileButtonDiv);
  uploadContainer.appendChild(video);
  uploadContainer.appendChild(replaceButton);
}

// Initial binding
videoInput.addEventListener('change', (e) => {
  handleFileSelection(e.target.files[0]);
});


// _____________ add a edit modal

const editIcons = document.querySelectorAll('.edit-icon');
const modal = document.getElementById('editModal');
const cancelBtn = document.getElementById('cancelBtn');
const editForm = document.getElementById('editForm');
let currentCard = null;

// When edit icon is clicked
editIcons.forEach(icon => {
  icon.addEventListener('click', (e) => {
    const card = e.target.closest('.certification-card');
    const title = card.querySelector('.certification-title').textContent;
    const organization = card.querySelector('p').textContent;

    document.getElementById('title').value = title;
    document.getElementById('organization').value = organization;
    
    currentCard = card;
    modal.style.display = 'flex';

    // 🔥 Automatically focus on title input
    const titleInput = document.getElementById('title');
    setTimeout(() => titleInput.focus(), 100); // small delay for smooth render

  });
});

// Cancel button
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Save form
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTitle = document.getElementById('title').value;
  const newOrg = document.getElementById('organization').value;

  if (currentCard) {
    currentCard.querySelector('.certification-title').textContent = newTitle;
    currentCard.querySelector('p').textContent = newOrg;
  }

  modal.style.display = 'none';  
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

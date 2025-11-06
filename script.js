import { notify } from "./additionalJs/notification.js";
//--------------- add/remove a toggle for a menu icon -------------

document.querySelector('.menu-icon').addEventListener('click', () => {
    // Toggle 'active' class on header
    document.querySelector('header').classList.toggle('active');
});


// ------------upload a video ------------

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
  video.preload = 'none';      // load only metadata until play
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
    videoInput.addEventListener('change', (e) => {
      handleFileSelection(e.target.files[0]), { once: true }
    });
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
  notify()
}

// Initial binding
videoInput.addEventListener('change', (e) => {
  handleFileSelection(e.target.files[0]);
});

// ----------------------toggle  certification button --------------------

// Function that handles certificate toggling for a given card
function toggleCertificate(card,event) {
   const text = card.querySelector('.certificateText');
    const chevron = card.querySelector('.chevron');

    const content = card.querySelector('.certificate-content');
    const iframeWrapper = card.querySelector('.iframeWrapper');
    const iframeFallback = card.querySelector('.iframeFallback');
    const url = card.querySelector('.openLink').href;

    const isHidden = content.style.display === 'none' || content.style.display === '' 
    
    if (isHidden && event) {
        // Clear and reload iframe
        iframeWrapper.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '400';
        iframe.style.border = '1px solid #ddd';

        try {
            iframeWrapper.appendChild(iframe);
        } catch (e) {
            iframeWrapper.innerHTML = '';
            iframeFallback.style.display = 'block';
            iframeFallback.querySelector('.openLink').href = url;
        }

        // Handle timeout fallback
        let loaded = false;
        iframe.onload = () => { loaded = true; };
        setTimeout(() => {
            if (!loaded) {
                iframeWrapper.style.display = "none";
                iframeFallback.style.display = "block";
            }
        }, 2000);

        // Update UI
        content.style.display = 'block';
        text.textContent = 'Hide Certification';
        chevron.style.transform = 'rotate(180deg)';
    } else {
        // Hide content
        content.style.display = 'none';
        text.textContent = 'View Certification';
        chevron.style.transform = 'rotate(0deg)';
    }
}

// Add event listeners to all buttons
document.querySelectorAll('.toggleCertificateBtn').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.certification-card');
        toggleCertificate(card,true);
    });
});


// ----hide expiry if it is empity

const expiryContainers = document.querySelectorAll('.certificate-expiry');
expiryContainers.forEach((expiryContainer) => {
  if (!expiryContainer.querySelector('span').textContent.trim()) {
    expiryContainer.style.display = 'none';
} else {
  expiryContainer.style.display = 'block';
}
  });




// _____________------------ add a edit modal-----------

const editIcons = document.querySelectorAll('.edit-icon');
const modal = document.getElementById('editModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeModalIcon = document.getElementById('closeModalIcon');
const editForm = document.getElementById('editForm');

let currentShadow = null;

let currentCard = null;

let clickedToggleCard= null
editIcons.forEach(icon => {
  icon.addEventListener('click', (e) => {
    const card = e.target.closest('.certification-card');
    const title = card.querySelector('.certification-title').textContent;
    const organization = card.querySelector('.certificate-organization').textContent;
    const year = card.querySelector('.certificate-year').textContent;
    const url = card.querySelector('.openLink').href;
    const expiryDate = card.querySelector('.certificate-expiry > span')?.textContent || null;

    const datePicker = document.querySelector("date-picker");
    const shadow = datePicker.shadowRoot; 
   

    document.getElementById('title').value = title;
    document.getElementById('organization').value = organization;
    document.getElementById('year').value=year;
    document.getElementById('certification-url').value= url;
    shadow.getElementById('date-input').value = expiryDate || "";

    
    currentCard = card; 
    currentShadow = shadow;
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
closeModalIcon.addEventListener('click',()=>{
  modal.style.display = 'none';
})

// Save form
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTitle = document.getElementById('title').value;
  const newOrg = document.getElementById('organization').value;
  const newYear = document.getElementById('year').value;
  const newUrl = document.getElementById('certification-url').value;
  const newExpiry = currentShadow.getElementById('date-input').value;

  

  if (currentCard) {
    currentCard.querySelector('.certification-title').textContent = newTitle;
    currentCard.querySelector('.certificate-organization').textContent = newOrg;
    currentCard.querySelector('.certificate-year').textContent= newYear;
    currentCard.querySelector('.certificate-url').href = newUrl;
    currentCard.querySelector('.certificate-expiry > span').textContent=newExpiry;
  }
  if(newExpiry){
     currentCard.querySelector('.certificate-expiry').style.display = 'block';
  }

  modal.style.display = 'none'; 
    toggleCertificate(currentCard,false)
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});



// ---------------- theme -------------------
const toggleBtn = document.getElementById('themeToggle');

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Toggle theme
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    // Change icon
    toggleBtn.textContent = isDark ? '🌙' : '☀️';
    
    // Optional: Save preference
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Load saved theme on page load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }



  // __________________________ add section?



    const addSectionBtn = document.getElementById("addSectionBtn");
    const sideNavLinlList = document.querySelector(".link-list");
    const rightSideContainer = document.querySelector(".right-side-container");
    const addSectionContainer = document.querySelector(".add-section-container");


    let sectionCount = 3;

    addSectionBtn.addEventListener("click", () => {
      const event = new CustomEvent("sectionAdded");
      document.dispatchEvent(event);
    });

    document.addEventListener("sectionAdded", () => {
      sectionCount++;

      const newSection = document.createElement("section");
      newSection.innerHTML = `
        <h2>Section ${sectionCount}</h2>
        <p>This is dynamically added section number ${sectionCount}.</p>
      `;

     rightSideContainer.insertBefore(newSection, addSectionContainer);

      const newNavItem = document.createElement("li");
      newNavItem.textContent = `Section ${sectionCount}`;
      sideNavLinlList.appendChild(newNavItem);
    });


    
    //------------- fetch git hub detail info

let github_username = 'SolomonBekele';

async function getGitHubUser() {
  const github_response = await fetch(`https://api.github.com/users/${github_username}`);
  const github = await github_response.json();

  
  // Inject the data into the HTML
  document.querySelector('.github-name').textContent = github.name;
  document.querySelector(".github-bio").textContent = `${github.bio}`;
  document.querySelector('.github-repos').textContent =`${github.public_repos} repositories`;
  document.querySelector('.github-created-at').textContent =`created at ${github.created_at}`

}
getGitHubUser();


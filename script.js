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

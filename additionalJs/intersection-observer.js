const about = document.getElementById('about-me');
const education = document.getElementById('education');
const certification = document.getElementById('certifications');
const introVideo  = document.getElementById('intro-video');
const experience = document.getElementById('experience');
const projects = document.getElementById('projects');
const github = document.getElementById('github');

function callbackFunction(entries){
    // console.log(entries);
    entries.forEach(entry => {
        if(entry.isIntersecting){
            // console.log(entry.target.id);
        entry.target.classList.add('observer');

           observer.unobserve(entry.target)  
        }

       
        
    });
}
const options = {
threshold : 0,
rootMargin : "0px"
}


const observer = new IntersectionObserver(callbackFunction,options)

observer.observe(about);
observer.observe(education);
observer.observe(certification);
observer.observe(introVideo);
observer.observe(experience);
observer.observe(projects);
observer.observe(github);

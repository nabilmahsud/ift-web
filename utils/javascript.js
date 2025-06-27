// GSAP Animation
const element1 = document.getElementById('element1');
const element2 = document.getElementById('element2');
const element3 = document.getElementById('element3');
const element4 = document.getElementById('element4');
const element10 = document.getElementById('element10');
const element20 = document.getElementById('element20');
const element30 = document.getElementById('element30');
const element40 = document.getElementById('element40');

function updateClock() {
    const now = new Date();
    
    // Get hours and minutes
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let period = hours >= 12 ? "PM" : "AM"; // Determine AM or PM

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format numbers to always have 2 digits
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Wrap AM/PM letters in spans for styling
    let periodStyled = `<span class="period-letter">${period[0]}</span><span class="period-letter">${period[1]}</span>`;

    // Update time
    document.querySelector(".time").innerHTML = `${hours} : ${minutes} <span class="period">${periodStyled}</span>`;

    // Format Gregorian Date (With Weekday & Shortened Month)
    const optionsGregorian = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    let gregorianDate = now.toLocaleDateString("en-US", optionsGregorian);
    
    // Format Islamic (Hijri) Date (Without Weekday & Full Month Name)
    const optionsHijri = { year: 'numeric', month: 'long', day: 'numeric' };
    let hijriDate = new Intl.DateTimeFormat("en-TN-u-ca-islamic", optionsHijri).format(now);
    
    // Update HTML
    document.querySelector(".date").innerHTML = `${hijriDate} <br> ${gregorianDate}`;
}

// Update time every minute (60000ms)
updateClock();
setInterval(updateClock, 60000);

// Update date every hour (3600000ms)
setInterval(updateClock, 3600000);
    
// Keep track of the currently visible submenu
let currentSubmenu = null;

// Get the overlay element (assumed to be already in the HTML)
const overlay = document.getElementById('overlay');

// Function to show submenu
function showSubmenu(submenu) {
    // Hide the currently visible submenu if it exists and is not the same as the one to show
    if (currentSubmenu && currentSubmenu !== submenu) {
        hideSubmenu(currentSubmenu);
    }

    // Set visibility to visible before starting the animation
    submenu.style.visibility = 'visible';

    // Show the new submenu
    gsap.to(submenu, { autoAlpha: 1, duration: 0.25, ease: 'power2.in' });
    
    // Show the overlay (with a lower z-index)
    overlay.style.display = 'block';
    overlay.style.zIndex = '10'; // Set z-index lower than header, menu, and submenu

    currentSubmenu = submenu; // Update the currently visible submenu
}

// Function to hide submenu
function hideSubmenu(submenu) {
    gsap.to(submenu, { autoAlpha: 0, duration: 0.25, ease: 'power2.out', onComplete: () => {
        submenu.style.visibility = 'hidden'; // Set visibility to hidden after fade out
    }});

    // Hide the overlay when submenu closes
    overlay.style.display = 'none';
}

// Mouse Enter
element1.addEventListener('mouseenter', () => showSubmenu(element10));
element2.addEventListener('mouseenter', () => showSubmenu(element20));
element3.addEventListener('mouseenter', () => showSubmenu(element30));
element4.addEventListener('mouseenter', () => showSubmenu(element40));

// Mouse Leave
element10.addEventListener('mouseleave', () => hideSubmenu(element10));
element20.addEventListener('mouseleave', () => hideSubmenu(element20));
element30.addEventListener('mouseleave', () => hideSubmenu(element30));
element40.addEventListener('mouseleave', () => hideSubmenu(element40));

// Hide submenu when mouse leaves the main menu
const menuItems = document.querySelectorAll('.mega-menu li');
menuItems.forEach(item => {
    item.addEventListener('mouseleave', () => {
        if (currentSubmenu) {
            hideSubmenu(currentSubmenu);
            currentSubmenu = null; // Reset the currently visible submenu
        }
    });
});

// PRAYER TIMES
function removeSeconds(timeString) {
    let timeArray = timeString.split(''); 
    timeArray.splice(-3, 3);              
    return timeArray.join('');           
}

function convertTo12HourFormat(time) {
    const [hour, minute, second] = time.split(':').map(num => parseInt(num, 10));
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

function getPrayerTimes() {
    var today = new Date();
    var day = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var xhr = new XMLHttpRequest();

    xhr.overrideMimeType("application/json");
    xhr.open("GET", "https://portal.ad-din.ca/v1/masjid/Prayer/GetPrayerTimesOfDay?masjidId=14&day=" + day);
    xhr.setRequestHeader(
        "ADDIN-API-KEY",
        "WVeh6FdhekwxiEiaxhKGsvy7sOh9V4Y6rWDt2vyoFvvMAFQ2eqxYBePjW1EXEAOL8jr6j0cddjcCJRZRAtrobKmXDy7BCEqi"
    );
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhr.responseText);
            
            if (response.data && response.data.prayerOfDay && response.data.prayerOfDay.singlePrayers) {
                var prayers = response.data.prayerOfDay.singlePrayers;
                console.log(response.data);

                prayers.forEach(function (prayer) {
                    switch (prayer.prayerName) {
                        case "Fajr":
                            document.getElementById("fajr-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("fajr-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("fajr-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("fajr-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                        case "Sunrise":
                            document.getElementById("sunrise").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("sunrise-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                        break;
                        case "Dhuhr":
                            document.getElementById("dhuhr-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("dhuhr-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("dhuhr-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("dhuhr-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                        case "Asr":
                            document.getElementById("asr-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("asr-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("asr-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("asr-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;  
                        case "Maghrib":
                            document.getElementById("maghrib-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("maghrib-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("maghrib-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("maghrib-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                        case "Isha":
                            document.getElementById("isha-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("isha-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("isha-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("isha-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                        case "Jumah":
                            document.getElementById("jumma1-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("jumma1-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("jumma1-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("jumma1-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                        case "Jumah 2":
                            document.getElementById("jumma2-adhan").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("jumma2-iqama").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                            document.getElementById("jumma2-adhan-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerAdhan)) || "--:--";
                            document.getElementById("jumma2-iqama-m").textContent = removeSeconds(convertTo12HourFormat(prayer.prayerIqamah)) || "--:--";
                        break;
                    }
                });
            }
        }
    };
    xhr.send();
}
getPrayerTimes();

const container = document.getElementById('scrollContainer');
        // NEXT BUTTON
        function scrollToNext() {
            const scrollAmount = window.innerWidth; // 100vw is equivalent to the viewport width
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            console.log('Next');
        }
        // PREV BUTTON
        function scrollToPrev() {
            const scrollAmount = window.innerWidth; // 100vw is equivalent to the viewport width
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            console.log('Previous');
        }

// MOBILE NAV CONTROLS
function goHome() {
    window.location="./index.html"
}
function openNav() {
    document.getElementById("sidebar").style.left = "0vw";    
}   
function closeNav() {
    document.getElementById("sidebar").style.left = "100vw";    
}

document.addEventListener("DOMContentLoaded", function() {
    var acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            var panel = this.nextElementSibling;
            var icon = this.querySelector('.icon');

            // Close all panels except the one being clicked
            for (let j = 0; j < acc.length; j++) {
                var otherPanel = acc[j].nextElementSibling;
                var otherIcon = acc[j].querySelector('.icon');
                if (otherPanel !== panel) {
                    otherPanel.style.maxHeight = null;
                    otherIcon.textContent = '+'; // Reset icon to plus
                    acc[j].classList.remove("active");
                }
            }

            // Toggle the clicked panel
            this.classList.toggle("active");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                icon.textContent = '+'; // Set icon to plus
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                icon.textContent = '-'; // Set icon to minus
            }
        });
    }
});

// Select only the links that should trigger the scroll-padding-top change
const dynamicLinks = document.querySelectorAll('a.dynamic-scroll');
const htmlEl = document.documentElement;

dynamicLinks.forEach(link => {
    link.addEventListener('click', () => {
    htmlEl.style.scrollPaddingTop = 'calc(5vw + 90px)';
    });
});

// Optionally, reset the scroll-padding-top for all other links
document.querySelectorAll('a:not(.dynamic-scroll)').forEach(link => {
link.addEventListener('click', () => {
    htmlEl.style.scrollPaddingTop = '90px';
});
});

// const sections = [
//     { id: 'slide1', linkId: 'link-slide1' },
//     { id: 'slide2', linkId: 'link-slide2' },
//     { id: 'slide3', linkId: 'link-slide3' }
// ];

const slideIds = ['slide1', 'slide2', 'slide3'];
let currentSlideIndex = 0;
let slideInterval = null;

const scrollContainer = document.getElementById('scrollContainer');

function scrollToSlide(index) {
    const slide = document.getElementById(slideIds[index]);
    if (slide) {
        slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

function startSlideShow() {
    if (!slideInterval) {
        slideInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % slideIds.length;
            scrollToSlide(currentSlideIndex);
        }, 10000);
    }
}

function stopSlideShow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Start by showing slide1 on page load
window.addEventListener('load', () => {
    scrollToSlide(0);
});

// Set up Intersection Observer to watch the container visibility
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Container is visible → start or resume slideshow
            startSlideShow();
        } else {
            // Container not visible → pause slideshow
            stopSlideShow();
        }
    });
}, {
    root: null, // viewport
    threshold: 0.1, // consider visible if at least 10% of container is visible
});

observer.observe(scrollContainer);

const slideElements = slideIds.map(id => document.getElementById(id));
const linkMap = {
    slide1: document.getElementById('link-slide1'),
    slide2: document.getElementById('link-slide2'),
    slide3: document.getElementById('link-slide3')
};

// Track the currently active slide for optimization
let currentActiveId = null;

const slideObserver = new IntersectionObserver((entries) => {
    let mostVisibleEntry = null;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
                mostVisibleEntry = entry;
            }
        }
    });

    if (mostVisibleEntry) {
        const id = mostVisibleEntry.target.id;
        if (id !== currentActiveId) {
            // Remove .active-link from all links
            Object.values(linkMap).forEach(link => link.classList.remove('active-link'));
            // Add .active-link to the current one
            linkMap[id].classList.add('active-link');
            currentActiveId = id;
        }
    }
}, {
    root: scrollContainer,
    threshold: 0.6 // Consider a slide active if 60% or more is in view
});

// Observe each slide
slideElements.forEach(slide => slideObserver.observe(slide));

// Scroll class
function toggleHeaderOnScroll() {
  const header = document.getElementById('headerdsktp');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Initialize the function after the DOM is loaded
document.addEventListener('DOMContentLoaded', toggleHeaderOnScroll);
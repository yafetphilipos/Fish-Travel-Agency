const hamburger = document.querySelector('.hamburger');
// Mobile menu toggle
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hero Slider
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dotsContainer = document.querySelector('.slider-dots');
let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    stopSlider();
    startSlider();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    stopSlider();
    startSlider();
});

startSlider();

// Typing Animation
const typingText = document.querySelector('.typing-text');
const phrases = [
    'FAST • RELIABLE • AFFORDABLE',
    'Domestic & International Flights',
    'Easy Extensions & Rebooking',
    'Fast Refund on Cancellation',
    '24/7 Customer Support'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

setTimeout(typeEffect, 1000);

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Dynamic Passenger Management
const passengers = {
    adult: [],
    child: [],
    infant: []
};

const maxPassengers = {
    adult: 9,
    child: 9,
    infant: 4
};

function createPassengerItem(type, index) {
    const item = document.createElement('div');
    item.className = 'passenger-item';
    item.dataset.type = type;
    item.dataset.index = index;
    
    const typeLabel = type === 'adult' ? 'Adult' : type === 'child' ? 'Child' : 'Infant';
    
    item.innerHTML = `
        <div class="passenger-fields">
            <div class="passenger-number">${index + 1}</div>
            <div class="passenger-field">
                <label>Full Name (as on passport/ID) *</label>
                <input type="text" 
                       class="passenger-name" 
                       placeholder="e.g., John Smith" 
                       ${type === 'adult' ? 'required' : ''} 
                       data-type="${type}" 
                       data-index="${index}">
            </div>
            <div class="passenger-field">
                <label>Date of Birth *</label>
                <input type="date" 
                       class="passenger-dob" 
                       ${type === 'adult' ? 'required' : ''} 
                       data-type="${type}" 
                       data-index="${index}">
            </div>
            <div class="passenger-field">
                <label>Passport/ID Number</label>
                <input type="text" 
                       class="passenger-passport" 
                       placeholder="Optional" 
                       data-type="${type}" 
                       data-index="${index}">
            </div>
        </div>
        <button type="button" class="remove-passenger-btn" data-type="${type}" data-index="${index}">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    
    return item;
}

function addPassenger(type) {
    console.log(`Adding ${type} passenger. Current count:`, passengers[type].length);
    
    // Map type to correct container ID
    const containerMap = {
        'adult': 'adultsContainer',
        'child': 'childrenContainer',
        'infant': 'infantsContainer'
    };
    
    const containerId = containerMap[type];
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container not found for type: ${type}, looking for ID: ${containerId}`);
        return;
    }
    
    const currentCount = passengers[type].length;
    
    if (currentCount >= maxPassengers[type]) {
        alert(`Maximum ${maxPassengers[type]} ${type}s allowed per booking`);
        return;
    }
    
    const index = currentCount;
    passengers[type].push({ name: '', dob: '', passport: '' });
    
    const item = createPassengerItem(type, index);
    container.appendChild(item);
    
    console.log(`Added ${type} passenger at index ${index}`);
    
    // Add event listeners to update passenger data
    const inputs = item.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const idx = parseInt(this.dataset.index);
            const field = this.classList.contains('passenger-name') ? 'name' :
                         this.classList.contains('passenger-dob') ? 'dob' : 'passport';
            passengers[type][idx][field] = this.value;
        });
    });
    
    // Add remove button listener
    const removeBtn = item.querySelector('.remove-passenger-btn');
    removeBtn.addEventListener('click', function() {
        removePassenger(this.dataset.type, parseInt(this.dataset.index));
    });
}

function removePassenger(type, index) {
    console.log(`Removing ${type} passenger at index ${index}`);
    
    // Map type to correct container ID
    const containerMap = {
        'adult': 'adultsContainer',
        'child': 'childrenContainer',
        'infant': 'infantsContainer'
    };
    
    const containerId = containerMap[type];
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container not found for type: ${type}`);
        return;
    }
    
    const items = Array.from(container.querySelectorAll('.passenger-item'));
    
    // Find and remove the item
    const itemToRemove = items.find(item => 
        item.dataset.type === type && parseInt(item.dataset.index) === index
    );
    
    if (itemToRemove) {
        itemToRemove.remove();
        passengers[type].splice(index, 1);
        
        // Renumber remaining passengers
        const remainingItems = container.querySelectorAll('.passenger-item');
        remainingItems.forEach((item, newIndex) => {
            item.dataset.index = newIndex;
            item.querySelector('.passenger-number').textContent = newIndex + 1;
            
            const inputs = item.querySelectorAll('input');
            inputs.forEach(input => {
                input.dataset.index = newIndex;
            });
            
            const removeBtn = item.querySelector('.remove-passenger-btn');
            removeBtn.dataset.index = newIndex;
        });
        
        console.log(`Removed ${type} passenger. New count:`, passengers[type].length);
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
} else {
    initializeForm();
}

function initializeForm() {
    console.log('Initializing form...');
    
    // Initialize with one adult
    addPassenger('adult');
    
    // Setup add passenger buttons
    const addButtons = document.querySelectorAll('.add-passenger-btn');
    console.log('Found add buttons:', addButtons.length);
    
    addButtons.forEach((btn, idx) => {
        const type = btn.dataset.type;
        console.log(`Setting up button ${idx} for type: ${type}`);
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Button clicked for type: ${type}`);
            addPassenger(type);
        });
    });
    
    // Trip type change handler - show/hide return date
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateGroup = document.getElementById('returnDateGroup');
    const returnDateInput = document.querySelector('input[name="returnDate"]');
    
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'Round Trip') {
                returnDateGroup.style.display = 'block';
                returnDateInput.required = true;
            } else {
                returnDateGroup.style.display = 'none';
                returnDateInput.required = false;
                returnDateInput.value = '';
            }
        });
    });
    
    // Phone number validation
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove non-numeric characters except + at the start
            let value = this.value.replace(/[^\d+]/g, '');
            
            // Ensure + is only at the start
            if (value.indexOf('+') > 0) {
                value = value.replace(/\+/g, '');
            }
            
            // Limit to 13 digits (including +)
            if (value.startsWith('+')) {
                value = '+' + value.substring(1, 14);
            } else {
                value = value.substring(0, 13);
            }
            
            this.value = value;
        });
    }
    
    console.log('Form initialization complete');
}

// Form submission
const form = document.getElementById('inquiryForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate at least one adult
    if (passengers.adult.length === 0 || !passengers.adult[0].name) {
        alert('Please add at least one adult passenger');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending Booking Request...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const data = {
        tripType: formData.get('tripType'),
        from: formData.get('from'),
        to: formData.get('to'),
        departureDate: formData.get('departureDate'),
        returnDate: formData.get('returnDate'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        extraBaggage: formData.get('extraBaggage') === 'yes',
        specialMeal: formData.get('specialMeal') === 'yes',
        wheelchair: formData.get('wheelchair') === 'yes',
        flexibleDates: formData.get('flexibleDates') === 'yes',
        additionalRequests: formData.get('additionalRequests'),
        adults: passengers.adult.filter(p => p.name),
        children: passengers.child.filter(p => p.name),
        infants: passengers.infant.filter(p => p.name)
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            formMessage.textContent = result.message;
            formMessage.className = 'success';
            form.reset();
            
            // Reset passengers
            passengers.adult = [];
            passengers.child = [];
            passengers.infant = [];
            document.getElementById('adultsContainer').innerHTML = '';
            document.getElementById('childrenContainer').innerHTML = '';
            document.getElementById('infantsContainer').innerHTML = '';
            
            // Add one adult back
            addPassenger('adult');
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            formMessage.textContent = result.message;
            formMessage.className = 'error';
        }
        
        formMessage.style.display = 'block';
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 10000);
        
    } catch (error) {
        formMessage.textContent = 'An error occurred. Please try again or contact us directly at +251 977 20 90 90';
        formMessage.className = 'error';
        formMessage.style.display = 'block';
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = '#fff';
    }
});

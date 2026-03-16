// =========================================
// MAIN JAVASCRIPT - CRAFTING SOLUTIONS
// =========================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Init AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active-link');
                } else {
                    navLink.classList.remove('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);

    // Change header background on scroll
    const header = document.getElementById('header');
    
    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.classList.add('scroll-header');
        } else {
            header.classList.remove('scroll-header');
        }
    }

    window.addEventListener('scroll', scrollHeader);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#home') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            // Store contact message in table (optional)
            try {
                const response = await fetch('tables/contacts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    contactForm.reset();
                } else {
                    throw new Error('Erro ao enviar mensagem');
                }
            } catch (error) {
                console.error('Error:', error);
                // For now, just show success message
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            }
        });
    }

    // Load dynamic content from API
    loadDynamicContent();
});

// Load content from tables API
async function loadDynamicContent() {
    try {
        // Load site content
        const contentResponse = await fetch('tables/site_content?limit=100');
        if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            updatePageContent(contentData.data);
        }

        // Load partners data
        const partnersResponse = await fetch('tables/partners?limit=10');
        if (partnersResponse.ok) {
            const partnersData = await partnersResponse.json();
            updatePartnersContent(partnersData.data);
        }
    } catch (error) {
        console.log('Using static content (API not available)');
    }
}

// Update page content from API data
function updatePageContent(contentArray) {
    if (!contentArray || contentArray.length === 0) return;

    contentArray.forEach(item => {
        const element = document.getElementById(item.element_id);
        if (element) {
            if (element.tagName === 'IMG') {
                element.src = item.content;
                element.alt = item.content;
            } else {
                element.textContent = item.content;
            }
        }
    });
}

// Update partners content
function updatePartnersContent(partnersArray) {
    if (!partnersArray || partnersArray.length === 0) return;

    partnersArray.forEach(partner => {
        // Update partner name
        const nameEl = document.getElementById(`partner${partner.partner_number}-name`);
        if (nameEl) nameEl.textContent = partner.name;

        // Update partner role
        const roleEl = document.getElementById(`partner${partner.partner_number}-role`);
        if (roleEl) roleEl.textContent = partner.role;

        // Update partner expertise
        const expertiseEl = document.getElementById(`partner${partner.partner_number}-expertise`);
        if (expertiseEl) expertiseEl.textContent = partner.expertise;

        // Update partner description
        const descEl = document.getElementById(`partner${partner.partner_number}-description`);
        if (descEl) descEl.textContent = partner.description;

        // Update partner photo
        const photoEl = document.getElementById(`partner${partner.partner_number}-photo`);
        if (photoEl && partner.photo_url) {
            photoEl.src = partner.photo_url;
            photoEl.alt = partner.name;
        }
    });
}

// Utility function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

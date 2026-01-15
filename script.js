/* ============================================
   Mili Skin & Beauty - JavaScript
   Interactive Features & Form Handling
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a nav link
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================
    // TREATMENT MEGA MENU NAVIGATION
    // ==========================================
    const megaCategoryTriggers = document.querySelectorAll('.mega-category-trigger');
    const megaCategories = document.querySelectorAll('.mega-category');
    const prefersHover = window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches;

    const closeAllMegaMenus = () => {
        megaCategoryTriggers.forEach(trigger => {
            trigger.setAttribute('aria-expanded', 'false');
            const menuId = trigger.getAttribute('aria-controls');
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.setAttribute('aria-hidden', 'true');
            }
        });
    };

    const openMegaMenu = (trigger, menu) => {
        closeAllMegaMenus();
        trigger.setAttribute('aria-expanded', 'true');
        menu?.setAttribute('aria-hidden', 'false');
    };

    megaCategories.forEach(category => {
        const trigger = category.querySelector('.mega-category-trigger');
        if (!trigger) return;

        const menuId = trigger.getAttribute('aria-controls');
        const menu = document.getElementById(menuId);
        if (!menu) return;

        // Desktop: hover-driven menus
        if (prefersHover) {
            category.addEventListener('mouseenter', () => openMegaMenu(trigger, menu));
            category.addEventListener('mouseleave', closeAllMegaMenus);
        }

        // Touch / small screens: click-to-toggle accordion
        trigger.addEventListener('click', (event) => {
            const useClickMode = !prefersHover || window.matchMedia('(max-width: 1024px)').matches;
            if (!useClickMode) return;

            event.preventDefault();
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeAllMegaMenus();
            } else {
                openMegaMenu(trigger, menu);
            }
        });
    });

    // Close mega menu when clicking on a link
    const megaMenuLinks = document.querySelectorAll('.mega-menu a');
    megaMenuLinks.forEach(link => {
        link.addEventListener('click', () => closeAllMegaMenus());
    });

    // Close mega menu when clicking outside
    document.addEventListener('click', function(event) {
        const treatmentNav = document.querySelector('.treatment-mega-nav');
        if (treatmentNav && !treatmentNav.contains(event.target)) {
            closeAllMegaMenus();
        }
    });

    // Close any open mega menus when resizing to avoid stuck states
    window.addEventListener('resize', closeAllMegaMenus);

    // ==========================================
    // SMOOTH SCROLLING FOR NAVIGATION
    // ==========================================
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // BOOK NOW BUTTON - SCROLL TO CONTACT
    // ==========================================
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Focus on the name input field
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 800);
            }
        });
    });

    // ==========================================
    // TOGGLE FEATURED CARDS (SHOW MORE)
    // ==========================================
    const toggleFeaturedBtn = document.getElementById('toggleFeaturedCards');
    
    if (toggleFeaturedBtn) {
        toggleFeaturedBtn.addEventListener('click', function() {
            const hiddenCards = document.querySelectorAll('.featured-card-hidden');
            const isExpanded = this.classList.contains('expanded');
            
            hiddenCards.forEach(card => {
                if (isExpanded) {
                    card.classList.remove('visible');
                } else {
                    card.classList.add('visible');
                }
            });
            
            this.classList.toggle('expanded');
            
            // Update button text
            const btnText = this.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = isExpanded ? 'Show More' : 'Show Less';
            }
        });
    }

    // ==========================================
    // NAV SEARCH WITH SUGGESTIONS - MODERN WITH IMAGES
    // ==========================================
    const searchToggle = document.querySelector('.search-toggle');
    const searchPanel = document.querySelector('.nav-search-panel');
    const searchInput = document.getElementById('nav-search-input');
    const suggestionsBox = document.getElementById('nav-search-suggestions');
    const searchBackdrop = document.querySelector('.nav-search-backdrop');
    const searchClearBtn = document.querySelector('.nav-search-clear');

    // Build search dataset from service cards (prioritize treatments with images)
    const searchItems = [];

    // Service cards - PRIORITY: Extract with images
    document.querySelectorAll('.service-card').forEach(card => {
        const link = card.querySelector('a.service-link');
        const nameEl = card.querySelector('.service-name');
        const imgEl = card.querySelector('.service-image img');
        const catEl = card.closest('.service-category')?.querySelector('.category-title');
        
        if (!link || !nameEl) return;
        
        const item = {
            name: nameEl.textContent.trim(),
            href: link.getAttribute('href'),
            image: imgEl ? imgEl.getAttribute('src') : null,
            category: catEl ? catEl.textContent.trim() : 'Services',
            isService: true,
            priority: 1 // Services get higher priority
        };
        searchItems.push(item);
    });

    // All other meaningful links (nav, footer)
    document.querySelectorAll('a[href]').forEach(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute('href');
        if (!text || !href || href.startsWith('javascript')) return;
        
        // Skip service links already added
        const isServiceLink = document.querySelector(`.service-link[href="${href}"]`);
        if (isServiceLink) return;
        
        searchItems.push({
            name: text,
            href,
            image: null,
            category: 'Site link',
            isService: false,
            priority: 0
        });
    });

    // Deduplicate by name+href
    const uniqueItems = [];
    const seen = new Set();
    searchItems.forEach(item => {
        const key = `${item.name}|${item.href}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueItems.push(item);
        }
    });

    // Sort by priority (services first)
    uniqueItems.sort((a, b) => b.priority - a.priority);

    // Fuzzy search algorithm - tolerates typos, spaces, hyphens and partial matches
    const fuzzyMatch = (query, text) => {
        const q = query.toLowerCase().trim();
        const t = text.toLowerCase().trim();
        
        // Exact substring match gets highest score
        if (t.includes(q)) return 1.0;
        
        // Normalize by removing spaces and hyphens for matching
        const normalizedQ = q.replace(/[\s\-\.]/g, '');
        const normalizedT = t.replace(/[\s\-\.]/g, '');
        
        // Check normalized substring match
        if (normalizedT.includes(normalizedQ)) return 0.95;
        
        // Word-based matching: check if query words appear in text
        const queryWords = q.split(/[\s\-]+/).filter(w => w.length > 0);
        const textWords = t.split(/[\s\-]+/).filter(w => w.length > 0);
        
        let matchedWords = 0;
        for (const qWord of queryWords) {
            for (const tWord of textWords) {
                if (tWord.includes(qWord) || qWord.length > 2 && levenshteinDistance(qWord, tWord) <= 1) {
                    matchedWords++;
                    break;
                }
            }
        }
        
        const wordMatchScore = queryWords.length > 0 ? matchedWords / queryWords.length : 0;
        if (wordMatchScore >= 0.7) {
            return 0.85 * wordMatchScore;
        }
        
        // Character-level fuzzy matching with tolerance
        let queryIdx = 0;
        let matchedChars = 0;
        let skipped = 0;
        
        for (let i = 0; i < normalizedT.length && queryIdx < normalizedQ.length; i++) {
            if (normalizedT[i] === normalizedQ[queryIdx]) {
                matchedChars++;
                queryIdx++;
            } else if (skipped < 2) { // Allow skipping up to 2 characters
                skipped++;
            }
        }
        
        if (queryIdx >= normalizedQ.length * 0.7) { // At least 70% of query matched
            const score = (matchedChars / normalizedQ.length) * 0.6 + (1 - skipped / normalizedQ.length) * 0.4;
            return Math.max(0.4, Math.min(score, 0.8));
        }
        
        return 0; // No match
    };

    // Calculate Levenshtein distance between two strings
    const levenshteinDistance = (a, b) => {
        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));
        
        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }
        
        return matrix[b.length][a.length];
    };

    const renderSuggestions = (items) => {
        if (!suggestionsBox) return;
        if (!items.length) {
            const q = (searchInput?.value || '').trim();
            suggestionsBox.innerHTML = q ? '<div class="no-results">No matches found</div>' : '';
            return;
        }
        suggestionsBox.innerHTML = items.map(item => `
            <button type="button" data-href="${item.href}" class="suggestion-item ${item.isService ? 'is-service' : ''}">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="suggestion-image">` : '<div class="suggestion-image-placeholder"><i class="fas fa-spa"></i></div>'}
                <div class="suggestion-content">
                    <span class="suggest-title">${item.name}</span>
                    <span class="suggest-meta">${item.category}</span>
                </div>
                <i class="fas fa-arrow-right suggestion-arrow"></i>
            </button>
        `).join('');
    };

    const filterSuggestions = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            // Show popular services when search is empty
            const popularServices = uniqueItems.filter(item => item.isService).slice(0, 5);
            renderSuggestions(popularServices);
            return;
        }
        
        // Score all items with fuzzy matching
        const scoredItems = uniqueItems
            .map(item => {
                const score = fuzzyMatch(q, item.name);
                return { ...item, score };
            })
            .filter(item => item.score > 0.35) // More lenient threshold
            .sort((a, b) => {
                // Sort by: service priority first, then match score
                if (a.isService !== b.isService) {
                    return b.isService ? 1 : -1;
                }
                return b.score - a.score;
            })
            .slice(0, 10);
        
        renderSuggestions(scoredItems);
    };

    const openSearch = () => {
        if (!searchPanel) return;
        searchPanel.classList.add('open');
        searchPanel.setAttribute('aria-hidden', 'false');
        searchToggle?.setAttribute('aria-expanded', 'true');
        searchBackdrop?.classList.add('open');
        setTimeout(() => searchInput?.focus(), 50);
        filterSuggestions(searchInput?.value || '');
    };

    const closeSearch = () => {
        if (!searchPanel) return;
        searchPanel.classList.remove('open');
        searchPanel.setAttribute('aria-hidden', 'true');
        searchToggle?.setAttribute('aria-expanded', 'false');
        searchBackdrop?.classList.remove('open');
    };

    if (searchToggle && searchPanel && searchInput && suggestionsBox) {
        searchToggle.addEventListener('click', () => {
            const isOpen = searchPanel.classList.contains('open');
            if (isOpen) {
                closeSearch();
            } else {
                openSearch();
            }
        });

        searchInput.addEventListener('input', (e) => {
            filterSuggestions(e.target.value);
        });

        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!searchInput) return;
                searchInput.value = '';
                filterSuggestions('');
                searchInput.focus();
            });
        }

        suggestionsBox.addEventListener('click', (e) => {
            const target = e.target.closest('button[data-href]');
            if (!target) return;
            const href = target.getAttribute('data-href');
            if (href) {
                window.location.href = href;
            }
        });

        document.addEventListener('click', (e) => {
            const isInside = searchPanel.contains(e.target) || searchToggle.contains(e.target);
            if (!isInside) closeSearch();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            
            // Basic validation
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();
            
            if (!name || !email || !message) {
                showFormStatus('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Send form data to PHP backend
                const response = await fetch('contact.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showFormStatus('Thank you for your message! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormStatus(result.message || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormStatus('Unable to send message. Please email us directly at Militest@gmail.com', 'error');
            } finally {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }

    // ==========================================
    // FORM VALIDATION HELPERS
    // ==========================================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = 'form-status ' + type;
            formStatus.style.display = 'block';
            
            // Auto-hide success message after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        }
    }

    // ==========================================
    // REAL-TIME FORM INPUT VALIDATION
    // ==========================================
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.length > 0 && this.value.length < 2) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
    }

    // ==========================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sections = document.querySelectorAll('.about, .services, .price-list, .contact');

    // Keep sections visible by default; animate only if supported
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'none';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            // Optional mild offset for small lift-on-appear
            section.style.transform = 'translateY(10px)';
            observer.observe(section);
        });
    }

    // ==========================================
    // SERVICE CARDS STAGGERED ANIMATION
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card');

    // Keep cards visible by default
    serviceCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // ==========================================
    // SHOW MORE FOR LONG CATEGORIES
    // ==========================================
    const serviceCategories = document.querySelectorAll('.service-category');

    serviceCategories.forEach(category => {
        const grid = category.querySelector('.services-grid');
        if (!grid) return;

        const cards = grid.querySelectorAll('.service-card');
        if (cards.length <= 3) return;

        grid.classList.add('collapsed');

        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'show-more-wrapper';

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'show-more-toggle';
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.textContent = 'Show more treatments';

        toggleWrapper.appendChild(toggleButton);
        grid.insertAdjacentElement('afterend', toggleWrapper);

        toggleButton.addEventListener('click', () => {
            const isCollapsed = grid.classList.toggle('collapsed');
            const expanded = !isCollapsed;
            toggleButton.setAttribute('aria-expanded', expanded.toString());
            toggleButton.textContent = expanded ? 'Show fewer treatments' : 'Show more treatments';
        });
    });

    if ('IntersectionObserver' in window) {
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 80); // Stagger the animation
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach(card => {
            // Slight lift only if animations supported
            card.style.transform = 'translateY(10px)';
            cardObserver.observe(card);
        });
    }

    // ==========================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ==========================================
    const sections2 = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        sections2.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.style.color = '';
                    link.style.fontWeight = '';
                });
                
                // Add active style to current section link
                if (correspondingLink) {
                    correspondingLink.style.color = 'var(--accent-color)';
                    correspondingLink.style.fontWeight = '600';
                }
            }
        });
    });

    // ==========================================
    // LOADING PLACEHOLDER IMAGES
    // ==========================================
    const images = document.querySelectorAll('.service-image img');
    
    images.forEach(img => {
        // If image fails to load, show placeholder
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #F5F1E8, #C9A87C);
                color: #8B6F47;
                font-size: 3rem;
            `;
            placeholder.innerHTML = '<i class="fas fa-spa"></i>';
            this.parentElement.appendChild(placeholder);
        });
    });

    // ==========================================
    // LOGO IMAGE ERROR HANDLING
    // ==========================================
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            // Logo text will still be visible
        });
    }

    // ==========================================
    // PHONE NUMBER FORMATTING
    // ==========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            e.target.value = value;
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON (Optional Enhancement)
    // ==========================================
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(139, 111, 71, 0.3);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    document.body.appendChild(backToTopButton);

    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 6px 20px rgba(139, 111, 71, 0.4)';
    });

    backToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(139, 111, 71, 0.3)';
    });

    // ==========================================
    // FAQ ACCORDION - SERVICE PAGES
    // ==========================================
    // Handle both old and new FAQ structures
    const faqQuestions = document.querySelectorAll('.faq-question, .faq-question-modern');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function(e) {
                e.preventDefault();
                
                const faqItem = this.closest('.faq-item, .faq-item-modern');
                if (!faqItem) return;
                
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                const allFaqItems = document.querySelectorAll('.faq-item.active, .faq-item-modern.active');
                allFaqItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // TREATMENT CATEGORIES DROPDOWN NAVIGATION
    // ==========================================
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const dropdownId = this.getAttribute('aria-controls');
            const dropdown = document.getElementById(dropdownId);
            
            // Close other dropdowns in the same nav
            const navContainer = this.closest('.treatment-categories-nav');
            if (navContainer) {
                const otherHeaders = navContainer.querySelectorAll('.category-header');
                otherHeaders.forEach(otherHeader => {
                    if (otherHeader !== this) {
                        otherHeader.setAttribute('aria-expanded', 'false');
                        const otherDropdownId = otherHeader.getAttribute('aria-controls');
                        const otherDropdown = document.getElementById(otherDropdownId);
                        if (otherDropdown) {
                            otherDropdown.setAttribute('aria-hidden', 'true');
                        }
                    }
                });
            }
            
            // Toggle current dropdown
            const newState = !isExpanded;
            this.setAttribute('aria-expanded', newState);
            if (dropdown) {
                dropdown.setAttribute('aria-hidden', !newState);
            }
        });
    });

    // ==========================================
    // CONSOLE LOG - WEBSITE LOADED
    // ==========================================
    console.log('✨ Mili Skin & Beauty website loaded successfully!');
    console.log('📧 Contact: Militest@gmail.com');
    console.log('📍 Location: 13b Edinburgh Cl, London E2 9NY');
    
});

// ==========================================
// PREVENT FORM RESUBMISSION ON REFRESH
// ==========================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

$(document).ready(function() {
    // YouTube-Style Sidebar Navigation
    const navbar = $('#navbar');
    const mainContent = $('#mainContent');
    const menuToggle = $('#menuToggle');
    const mobileOverlay = $('#mobileOverlay');
    
    // Toggle sidebar collapse/expand
    menuToggle.on('click', function() {
        navbar.toggleClass('collapsed');
        mainContent.toggleClass('expanded');

        // Update menu toggle icon
        const icon = $(this).find('i');
        if (navbar.hasClass('collapsed')) {
            icon.removeClass('fa-bars').addClass('fa-chevron-right');
        } else {
            icon.removeClass('fa-chevron-right').addClass('fa-bars');
        }
    });
    
    // Mobile overlay click to close sidebar
    mobileOverlay.on('click', function() {
        navbar.removeClass('mobile-open');
        mobileOverlay.removeClass('active');
    });
    
    // Handle mobile menu toggle
    if (window.innerWidth <= 768) {
        menuToggle.on('click', function() {
            navbar.toggleClass('mobile-open');
            mobileOverlay.toggleClass('active');
        });
      }
    
    // Handle window resize
    $(window).on('resize', function() {
        if (window.innerWidth > 768) {
            navbar.removeClass('mobile-open');
            mobileOverlay.removeClass('active');
        }
    });
    
    // Active navigation link highlighting
    $('.nav-links a').on('click', function() {
        $('.nav-links a').removeClass('active');
        $(this).addClass('active');
  });

    // Slideshow functionality
    let currentSlide = 0;
    const slides = $('.slide-test');
    const totalSlides = slides.length;
    
    // Auto-advance slideshow
  function nextSlide() {
        slides.removeClass('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides.eq(currentSlide).addClass('active');
  }

    // Manual slide navigation
    $('#nextTest').on('click', function() {
        nextSlide();
    });
    
    $('#prevTest').on('click', function() {
        slides.removeClass('active');
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        slides.eq(currentSlide).addClass('active');
    });
    
    // Auto-advance every 2 seconds
    let slideshowInterval = setInterval(nextSlide, 2000);
    
    // Pause slideshow on hover
    $('.slideshow-test').on('mouseenter', function() {
        clearInterval(slideshowInterval);
    }).on('mouseleave', function() {
        slideshowInterval = setInterval(nextSlide, 2000);
    });
    
    // Popup form functionality
    $('#loginBtn').on('click', function() {
        $('#loginForm').addClass('active');
  });

    $('#signupBtn').on('click', function() {
        $('#signupForm').addClass('active');
    });

    // Close forms when clicking outside
    $('.popup-form').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('active');
        }
    });
    
    // Form submission handling
    $('.form-box .btn').on('click', function(e) {
      e.preventDefault();
        const form = $(this).closest('.form-box');
        const inputs = form.find('input');
        let isValid = true;
        
        inputs.each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('error');
      } else {
                $(this).removeClass('error');
            }
        });
        
        if (isValid) {
            // Show success message
            form.append('<div class="form-status success">Form submitted successfully!</div>');
            setTimeout(() => {
                form.find('.form-status').remove();
                form.closest('.popup-form').removeClass('active');
                inputs.val('');
            }, 2000);
    }
  });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 800);
        }
  });
    
    // Product card hover effects
    $('.product-card').on('mouseenter', function() {
        $(this).addClass('hover');
    }).on('mouseleave', function() {
        $(this).removeClass('hover');
  });
    
    // Search bar live filtering for product cards
    function filterProductCards(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let found = false;
        const $cards = $('.product-card');
        $cards.each(function() {
            const title = $(this).find('h3').text().toLowerCase();
            const desc = $(this).find('p').first().text().toLowerCase();
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                $(this).show();
                found = true;
            } else {
                $(this).hide();
            }
  });
        $('.no-results').remove();
        if (!found && searchTerm.length > 0) {
            $('.product-grid').after('<div class="no-results" style="text-align:center;color:#f44336;margin-top:2rem;font-size:1.2em;">No results found.</div>');
        }
        if (searchTerm.length === 0) {
            $('.no-results').remove();
        }
    }

    $('.navbar-search input[type="search"]').on('input', function() {
        filterProductCards($(this).val());
  });

    // Handle Enter key in search bar
    $('.navbar-search input[type="search"]').on('keydown', function(e) {
        if (e.key === 'Enter') {
    e.preventDefault();
            filterProductCards($(this).val());
            $(this).blur();
        }
    });

    // If the search bar is ever inside a form, prevent form submit and filter
    $('.navbar-search').on('submit', function(e) {
        e.preventDefault();
        const val = $(this).find('input[type="search"]').val();
        filterProductCards(val);
        $(this).find('input[type="search"]').blur();
});

    // Initialize tooltips for collapsed sidebar
    function initTooltips() {
        if (navbar.hasClass('collapsed')) {
            $('.nav-links a').each(function() {
                const text = $(this).find('span').text();
                $(this).attr('title', text);
            });
        } else {
            $('.nav-links a').removeAttr('title');
        }
      }
    
    // Call tooltip initialization on sidebar toggle
    menuToggle.on('click', function() {
        setTimeout(initTooltips, 300);
    });
    
    // Initialize tooltips on page load
    initTooltips();

    // Cart notification dot logic
    function updateCartNotificationDot() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartLink = $('.nav-links a[href="cart.html"]');
        if (cart.length > 0) {
            cartLink.addClass('has-notification');
            cartLink.find('.notification-dot').show();
    } else {
            cartLink.removeClass('has-notification');
            cartLink.find('.notification-dot').hide();
        }
    }
    updateCartNotificationDot();

    // Update dot on cart changes (add/remove/clear)
    $(document).on('cart-updated', updateCartNotificationDot);

    // Add to Cart functionality (products only)
    $(document).on('click', '.add-to-cart, .product-card .button', function(e) {
        // Only run for product cards, not event registration
        if ($(this).closest('.product-card').find('.price').length === 0) return;
        e.preventDefault();
        // Find product info
        const $card = $(this).closest('.product-card');
        const name = $card.find('h3').text().trim();
        const priceText = $card.find('.price').first().text();
        // Try to extract price from text, fallback to 0
        let price = 0;
        const priceMatch = priceText.match(/([\d,.]+)/);
        if (priceMatch) price = parseFloat(priceMatch[1].replace(/,/g, ''));
        const image = $card.find('img').attr('src') || '';
        // Get cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Check if already in cart
        let found = false;
        for (let item of cart) {
            if (item.name === name) {
                item.quantity += 1;
                found = true;
                break;
            }
        }
        if (!found) {
            cart.push({ name, price, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
        // Show notification
    if ($('.cart-notification').length === 0) {
      $('body').append('<div class="cart-notification" style="position:fixed;top:32px;right:32px;z-index:3000;display:none;"></div>');
    }
    $('.cart-notification').html(`
      <span style="display:flex;align-items:center;gap:0.7em;">
        <i class='fas fa-check-circle' style='color:#fff;background:#4caf50;border-radius:50%;padding:0.2em 0.3em;font-size:1.3em;box-shadow:0 2px 8px rgba(44,29,14,0.10);'></i>
        <span style='font-size:1.1em;font-weight:500;color:#fff;'>${name} added to cart!</span>
        <button class='cart-noti-close' style='background:none;border:none;color:#fff;font-size:1.2em;margin-left:0.7em;cursor:pointer;' aria-label='Close'>&times;</button>
      </span>
    `)
    .css({
      'background':'linear-gradient(90deg,#7c4f29 60%,#b07d4a 100%)',
      'padding':'16px 28px',
      'border-radius':'12px',
      'box-shadow':'0 4px 24px rgba(44,29,14,0.18)',
      'min-width':'220px',
      'max-width':'90vw',
      'font-family':'inherit',
      'transition':'all 0.3s',
      'opacity':'0.98',
      'pointer-events':'auto'
    })
    .stop(true,true).fadeIn(200).delay(1200).fadeOut(400);
    // Close button
    $('.cart-noti-close').off('click').on('click',function(){
      $('.cart-notification').fadeOut(200);
    });
        // Update cart dot
        $(document).trigger('cart-updated');
        // If on cart page, update cart table
        if ($('#cart-table').length) {
            updateCartTable();
      }
    });

    // Cart page rendering
    function updateCartTable() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
      let total = 0;
        let tbody = $('#cart-table tbody');
      tbody.empty();
      if (cart.length === 0) {
            tbody.append("<tr><td colspan='5' style='text-align:center;padding:2rem;'>Your cart is empty.</td></tr>");
      } else {
        cart.forEach((item, index) => {
                total += (item.price || 0) * item.quantity;
          tbody.append(`
            <tr>
              <td>${item.name}</td>
                    <td style='text-align:center;'><img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;"></td>
                    <td style='text-align:center;'>
                      <button class="qty-btn qty-minus" data-index="${index}" style="background:#222;color:#fff;border:none;border-radius:4px;width:32px;height:32px;font-size:1.2em;vertical-align:middle;margin-right:4px;"><i class="fas fa-minus"></i></button>
                      <span style="min-width:32px;display:inline-block;text-align:center;">${item.quantity}</span>
                      <button class="qty-btn qty-plus" data-index="${index}" style="background:#222;color:#fff;border:none;border-radius:4px;width:32px;height:32px;font-size:1.2em;vertical-align:middle;margin-left:4px;"><i class="fas fa-plus"></i></button>
                    </td>
                    <td style='text-align:center;'>$${((item.price || 0) * item.quantity).toFixed(2)}</td>
                    <td style='text-align:center;'><button class="remove-btn" data-index="${index}" style="background:#ff0000;color:#fff;border:none;border-radius:8px;width:48px;height:48px;font-size:1.3em;"><i class='fas fa-trash'></i></button></td>
            </tr>
          `);
        });
      }
        $('#cart-total').text(total.toFixed(2));
    }
    // Remove from cart
    $(document).on('click', '.remove-btn', function() {
        const index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTable();
        $(document).trigger('cart-updated');
    });
    // Clear cart
    $(document).on('click', '.clear-btn', function() {
        localStorage.removeItem('cart');
        updateCartTable();
        $(document).trigger('cart-updated');
    });
    // On cart page load, render cart
    if ($('#cart-table').length) {
        updateCartTable();
    }

    // Quantity plus
    $(document).on('click', '.qty-plus', function() {
        const index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
            $(document).trigger('cart-updated');
        }
    });
    // Quantity minus
    $(document).on('click', '.qty-minus', function() {
        const index = $(this).data('index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index]) {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
            $(document).trigger('cart-updated');
    }
  });

    // Checkout button functionality
    $(document).on('click', '.checkout-btn', function(e) {
        e.preventDefault();
    if ($('.cart-notification').length === 0) {
      $('body').append('<div class="cart-notification" style="position:fixed;top:32px;right:32px;z-index:3000;display:none;"></div>');
    }
    $('.cart-notification').html(`
      <span style="display:flex;align-items:center;gap:0.7em;">
            <i class='fas fa-check-circle' style='color:#fff;background:#4caf50;border-radius:50%;padding:0.2em 0.3em;font-size:1.3em;box-shadow:0 2px 8px rgba(44,29,14,0.10);'></i>
            <span style='font-size:1.1em;font-weight:500;color:#fff;'>Thank you for your order!</span>
        <button class='cart-noti-close' style='background:none;border:none;color:#fff;font-size:1.2em;margin-left:0.7em;cursor:pointer;' aria-label='Close'>&times;</button>
      </span>
    `)
    .css({
      'background':'linear-gradient(90deg,#7c4f29 60%,#b07d4a 100%)',
      'padding':'16px 28px',
      'border-radius':'12px',
      'box-shadow':'0 4px 24px rgba(44,29,14,0.18)',
      'min-width':'220px',
      'max-width':'90vw',
      'font-family':'inherit',
      'transition':'all 0.3s',
      'opacity':'0.98',
      'pointer-events':'auto'
    })
    .stop(true,true).fadeIn(200).delay(1800).fadeOut(400);
    // Close button
    $('.cart-noti-close').off('click').on('click',function(){
      $('.cart-notification').fadeOut(200);
    });
        // Clear cart
        localStorage.removeItem('cart');
        if (typeof updateCartTable === 'function') updateCartTable();
        $(document).trigger('cart-updated');
  });

  $('#topMenuToggle').on('click', function() {
    $('#navbar').toggleClass('mobile-open');
    $('#mobileOverlay').toggleClass('active');
  });
});

// Global function to close forms
function closeForm(formId) {
    $('#' + formId).removeClass('active');
}

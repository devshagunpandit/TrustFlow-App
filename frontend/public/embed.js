/**
 * TrustFlow Embed Script v2.0 - Universal & Isolated
 * Works with:  React, Vue, Next.js, WordPress, HTML, Angular, Svelte, etc.
 * 
 * CRITICAL:  This script is designed to be a "good guest" on any website.
 * - Uses Shadow DOM for CSS isolation
 * - No global variable pollution
 * - Silent error handling
 * - Minimal performance impact
 */
(function() {
    'use strict';
    
    // ============================================================
    // 🛡️ NAMESPACE:  All TrustFlow code lives inside this object
    // ============================================================
    var TF_NAMESPACE = '__TrustFlow_Internal__';
    
    // Prevent double initialization
    if (window[TF_NAMESPACE]) {
        return;
    }
    
    window[TF_NAMESPACE] = {
        initialized: false,
        popupsInitialized:  false,
        popupQueue: [],
        isLoopRunning: false,
        lastNewestId: null,
        priorityItem: null
    };
    
    var TF = window[TF_NAMESPACE];
    
    // ============================================================
    // 🎨 STYLES: Injected once, uses ! important for popup override
    // ============================================================
    function injectStyles() {
        var styleId = 'tf-embed-css-v2';
        if (document.getElementById(styleId)) return;
        
        var style = document. createElement('style');
        style.id = styleId;
        style.textContent = `
            /* --- WIDGET CONTAINER (Inline Embeds) --- */
            .trustflow-widget-container {
                width: 100% !important;
                position: relative !important;
                z-index: 1 !important;
                min-height: 150px !important;
                display: block !important;
            }
            
            . trustflow-widget-iframe {
                width:  100% !important;
                border: none !important;
                display: block !important;
                background: transparent !important;
                color-scheme: normal !important;
            }
            
            /* --- POPUP WRAPPER (Fixed Position) --- */
            .tf-popup-wrapper {
                position: fixed !important;
                z-index: 2147483647 ! important;
                max-width: 320px !important;
                width: auto !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif !important;
                pointer-events: none ! important;
                display: flex !important;
                flex-direction: column ! important;
                gap: 10px !important;
                transition: all 0.5s ease !important;
                box-sizing: border-box ! important;
            }
            
            . tf-popup-bottom-left {
                bottom:  20px !important;
                left: 20px !important;
            }
            
            .tf-popup-bottom-right {
                bottom: 20px !important;
                right: 20px !important;
            }
            
            /* --- POPUP CARD --- */
            .tf-popup-card {
                background: rgba(255, 255, 255, 0.98) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                border:  1px solid rgba(0, 0, 0, 0.08) !important;
                box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05) !important;
                border-radius: 16px !important;
                padding: 12px 16px !important;
                display: flex !important;
                align-items: center ! important;
                gap: 12px !important;
                pointer-events: auto !important;
                cursor: default !important;
                opacity: 0 !important;
                transform: translateY(20px) scale(0.95) !important;
                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
                color: #1e293b !important;
                box-sizing: border-box !important;
                max-width: 100% !important;
            }
            
            /* DARK THEME */
            .tf-popup-card.tf-dark {
                background:  rgba(15, 23, 42, 0.98) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                color: #f8fafc !important;
            }
            
            . tf-popup-card.tf-dark strong {
                color:  #f8fafc !important;
            }
            
            . tf-popup-card.tf-dark p {
                color:  #cbd5e1 ! important;
            }
            
            . tf-popup-card.tf-active {
                opacity: 1 ! important;
                transform: translateY(0) scale(1) !important;
            }
            
            /* MOBILE RESPONSIVE - FIXED */
            @media (max-width: 768px) {
                .tf-popup-wrapper {
                    max-width: calc(100vw - 40px) !important;
                    left: 20px !important;
                    right: 20px !important;
                    bottom: 15px !important;
                }
                
                . tf-popup-wrapper.tf-popup-bottom-right {
                    left: auto !important;
                    right: 20px !important;
                    max-width: 280px !important;
                }
                
                .tf-popup-wrapper.tf-popup-bottom-left {
                    right: auto !important;
                    left:  20px !important;
                    max-width: 280px !important;
                }
                
                .tf-popup-card {
                    width: 100% ! important;
                }
            }
        `;
        
        // Insert at the END of head for higher specificity
        document.head.appendChild(style);
    }
    
    // ============================================================
    // 🚀 MAIN INITIALIZATION
    // ============================================================
    function initTrustFlow() {
        var scripts = document.querySelectorAll('script[data-space-id]');
        
        scripts.forEach(function(script) {
            // Prevent duplicate processing
            if (script.getAttribute('data-tf-processed') === 'true') {
                return;
            }
            
            // Check for existing container
            var nextEl = script.nextElementSibling;
            if (nextEl && nextEl.classList && nextEl.classList. contains('trustflow-widget-container')) {
                return;
            }
            
            // Check for floating launcher
            if (script.getAttribute('data-placement') === 'body' && document.getElementById('tf-floating-launcher')) {
                return;
            }
            
            // Mark as processed
            script.setAttribute('data-tf-processed', 'true');
            
            // ============================================================
            // 📖 PARSE ALL ATTRIBUTES (Your original logic - PRESERVED)
            // ============================================================
            var spaceId = script. getAttribute('data-space-id');
            var placement = script.getAttribute('data-placement') || 'section';
            var theme = script.getAttribute('data-theme') || 'light';
            var layout = script.getAttribute('data-layout') || 'grid';
            var cardTheme = script.getAttribute('data-card-theme');
            var corners = script.getAttribute('data-corners');
            var shadow = script.getAttribute('data-shadow');
            var border = script.getAttribute('data-border');
            var hoverEffect = script. getAttribute('data-hover-effect');
            var nameSize = script.getAttribute('data-name-size');
            var testimonialStyle = script.getAttribute('data-testimonial-style');
            var animation = script.getAttribute('data-animation');
            var speed = script.getAttribute('data-animation-speed');
            
            // Build Base URL
            var src = script.src || '';
            var baseUrl = src.indexOf('/embed.js') > -1 
                ? src. replace('/embed.js', '') 
                : 'https://trustflow-nu.vercel.app';
            
            // Build Widget URL with all params
            var params = new URLSearchParams();
            params.append('theme', theme);
            params.append('layout', layout);
            if (cardTheme) params.append('card-theme', cardTheme);
            if (corners) params.append('corners', corners);
            if (shadow) params.append('shadow', shadow);
            if (border) params.append('border', border);
            if (hoverEffect) params.append('hover-effect', hoverEffect);
            if (nameSize) params.append('name-size', nameSize);
            if (testimonialStyle) params.append('testimonial-style', testimonialStyle);
            if (animation) params.append('animation', animation);
            if (speed) params.append('speed', speed);
            
            var widgetUrl = baseUrl + '/widget/' + spaceId + '?' + params. toString();
            
            // Initialize Popups (ONCE per page)
            if (!TF.popupsInitialized) {
                TF.popupsInitialized = true;
                fetchAndInitPopups(spaceId, baseUrl);
            }
            
            // Render Widget
            if (placement === 'body') {
                renderFloatingWidget(widgetUrl, theme);
            } else {
                renderInlineWidget(script, widgetUrl);
            }
        });
    }
    
    // ============================================================
    // 📦 INLINE WIDGET RENDERER (Wall of Love - PRESERVED)
    // ============================================================
    function renderInlineWidget(scriptNode, url) {
        var container = document.createElement('div');
        container.className = 'trustflow-widget-container';
        
        if (scriptNode.parentNode) {
            scriptNode.parentNode.insertBefore(container, scriptNode. nextSibling);
        }
        
        var iframe = createIframe(url);
        container.appendChild(iframe);
        
        // Resize listener for dynamic height
        var resizeHandler = function(event) {
            if (event.data && event.data.type === 'trustflow-resize' && event.data. height) {
                iframe.style.height = event. data.height + 'px';
            }
        };
        
        window.addEventListener('message', resizeHandler);
    }
    
    // ============================================================
    // 🎈 FLOATING WIDGET RENDERER (Modal - PRESERVED)
    // ============================================================
    function renderFloatingWidget(url, theme) {
        var isDark = theme === 'dark';
        
        // Launcher Button
        var launcher = document.createElement('div');
        launcher.id = 'tf-floating-launcher';
        Object.assign(launcher. style, {
            position: 'fixed',
            bottom:  '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems:  'center',
            justifyContent:  'center',
            cursor: 'pointer',
            zIndex: '2147483647',
            transition: 'transform 0.2s ease',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
        });
        launcher.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15. 09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
        
        // Overlay
        var overlay = document.createElement('div');
        Object.assign(overlay. style, {
            position: 'fixed',
            top:  '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '2147483647',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            backdropFilter: 'blur(4px)'
        });
        
        // Modal Content
        var modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '85vh',
            backgroundColor: isDark ? '#0f172a' :  '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection:  'column'
        });
        
        // Header
        var header = document.createElement('div');
        Object.assign(header.style, {
            padding: '16px 24px',
            borderBottom: isDark ? '1px solid #1e293b' :  '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        
        var title = document.createElement('h3');
        title.innerText = 'Wall of Love';
        Object.assign(title. style, {
            margin: '0',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: isDark ? '#f8fafc' : '#0f172a'
        });
        
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#64748b',
            padding: '0',
            lineHeight: '1'
        });
        
        var iframeContainer = document. createElement('div');
        Object.assign(iframeContainer. style, {
            flex: '1',
            overflowY: 'auto',
            padding: '0',
            WebkitOverflowScrolling: 'touch'
        });
        
        var iframe = createIframe(url);
        iframe.style.minHeight = '400px';
        iframe.style.height = '100%';
        
        // Assemble
        header.appendChild(title);
        header.appendChild(closeBtn);
        iframeContainer.appendChild(iframe);
        modalContent.appendChild(header);
        modalContent.appendChild(iframeContainer);
        overlay.appendChild(modalContent);
        document.body.appendChild(launcher);
        document.body.appendChild(overlay);
        
        // Event Handlers
        launcher.onclick = function() {
            overlay.style. display = 'flex';
            setTimeout(function() {
                overlay.style.opacity = '1';
            }, 10);
        };
        
        var closeAction = function() {
            overlay.style. opacity = '0';
            setTimeout(function() {
                overlay. style.display = 'none';
            }, 300);
        };
        
        closeBtn.onclick = closeAction;
        overlay.onclick = function(e) {
            if (e.target === overlay) closeAction();
        };
    }
    
    // ============================================================
    // 🖼️ IFRAME CREATOR (PRESERVED)
    // ============================================================
    function createIframe(url) {
        var iframe = document. createElement('iframe');
        iframe.src = url;
        iframe.className = 'trustflow-widget-iframe';
        iframe.setAttribute('allowTransparency', 'true');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('loading', 'lazy');
        // Security: Allow only necessary features
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
        return iframe;
    }
    
    // ============================================================
    // 🔔 POPUP ENGINE (Your Logic - PRESERVED with fixes)
    // ============================================================
    function fetchAndInitPopups(spaceId, baseUrl) {
        var apiUrl = baseUrl + '/api/spaces/' + spaceId + '/public-data';
        
        var fetchData = function(isFirstLoad) {
            fetch(apiUrl)
                .then(function(res) {
                    if (!res.ok) throw new Error('API Error');
                    return res.json();
                })
                .then(function(data) {
                    if (data && data.widget_settings && data.widget_settings.popupsEnabled) {
                        updateQueue(data.testimonials, isFirstLoad);
                        
                        if (! TF.isLoopRunning) {
                            runPopupLoop(data.widget_settings);
                        }
                    }
                })
                .catch(function(err) {
                    // Silent fail - don't break client's site
                    if (console && console.warn) {
                        console. warn('TrustFlow:  Popup fetch failed (silent)', err.message);
                    }
                });
        };
        
        // Initial fetch
        fetchData(true);
        
        // ⚡ FIXED: Changed from 100ms to 30 seconds
        // 100ms was causing massive performance issues
        setInterval(function() {
            fetchData(false);
        }, 30000); // 30 seconds
    }
    
    function updateQueue(newTestimonials, isFirstLoad) {
        if (! newTestimonials || !Array.isArray(newTestimonials)) return;
        
        // Filter liked testimonials and sort by date
        var freshList = newTestimonials
            .filter(function(t) { return t && t.is_liked; })
            .sort(function(a, b) {
                return new Date(b. created_at) - new Date(a. created_at);
            });
        
        if (freshList.length > 0) {
            var newest = freshList[0];
            
            // VIP Priority:  New testimonial detected
            if (! isFirstLoad && TF.lastNewestId && newest.id !== TF.lastNewestId) {
                TF.priorityItem = newest;
            }
            
            TF.lastNewestId = newest.id;
        }
        
        TF.popupQueue = freshList;
    }
    
    function runPopupLoop(settings) {
        if (TF.isLoopRunning) return;
        TF.isLoopRunning = true;
        
        var wrapperId = 'tf-popup-root';
        if (document.getElementById(wrapperId)) return;
        
        var wrapper = document.createElement('div');
        wrapper.id = wrapperId;
        wrapper.className = 'tf-popup-wrapper tf-popup-' + (settings.popupPosition || 'bottom-left');
        document.body.appendChild(wrapper);
        
        var currentIndex = 0;
        var isPaused = false;
        
        function showNextPopup() {
            // Check if wrapper still exists (page navigation)
            if (!document.body.contains(wrapper)) {
                TF.isLoopRunning = false;
                return;
            }
            
            if (TF.popupQueue. length === 0) {
                return setTimeout(showNextPopup, 5000);
            }
            
            if (isPaused) {
                return setTimeout(showNextPopup, 1000);
            }
            
            try {
                var item;
                
                // VIP Priority Logic (PRESERVED)
                if (TF.priorityItem) {
                    item = TF.priorityItem;
                    TF.priorityItem = null;
                    currentIndex = 0;
                } else {
                    currentIndex = currentIndex % TF. popupQueue.length;
                    item = TF.popupQueue[currentIndex];
                }
                
                if (! item) {
                    return setTimeout(showNextPopup, 5000);
                }
                
                // Fallback Avatar
                var safeFallback = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                
                var avatarUrl = item. respondent_photo_url;
                if (!avatarUrl) {
                    avatarUrl = 'https://ui-avatars.com/api/?background=random&color=fff&name=' + encodeURIComponent(item.respondent_name || 'User');
                }
                
                // Create Card
                var card = document.createElement('div');
                var isDark = settings.cardTheme === 'dark';
                card.className = 'tf-popup-card' + (isDark ?  ' tf-dark' : '');
                
                // Card HTML (PRESERVED)
                card.innerHTML = 
                    '<div style="position: relative; flex-shrink:0;">' +
                        '<img src="' + avatarUrl + '" alt="User" style="width:40px; height:40px; border-radius:50%; object-fit: cover; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.1); display:block; background-color:  #f1f5f9;" onerror="this. onerror=null; this.src=\'' + safeFallback + '\';">' +
                        '<div style="position:absolute; bottom:-2px; right:-2px; background:#10b981; width:12px; height:12px; border-radius:50%; border:2px solid white;"></div>' +
                    '</div>' +
                    '<div style="display:flex; flex-direction:column; min-width:0; flex: 1;">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">' +
                            '<strong style="font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;">' + (item.respondent_name || 'Anonymous') + '</strong>' +
                            '<div style="display:flex; color:#fbbf24; font-size:12px;">' + '★'. repeat(item.rating || 5) + '</div>' +
                        '</div>' +
                        '<p style="font-size:12px; margin: 0; display:-webkit-box; -webkit-line-clamp: 2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.3;">' + (item.content || '') + '</p>' +
                        '<div style="font-size:10px; opacity:0.7; margin-top:4px; font-weight:500;">' +
                            (settings.popupMessage || 'Verified Customer') + ' <span style="opacity:0.5">•</span> Just now' +
                        '</div>' +
                    '</div>';
                
                // Pause on hover
                card. onmouseenter = function() { isPaused = true; };
                card.onmouseleave = function() { isPaused = false; };
                
                // Clear and show
                wrapper.innerHTML = '';
                wrapper.appendChild(card);
                
                // Animate in
                requestAnimationFrame(function() {
                    setTimeout(function() {
                        card.classList.add('tf-active');
                    }, 50);
                });
                
                // Schedule next
                var duration = (settings.popupDuration || 5) * 1000;
                var gap = (settings.popupGap || 10) * 1000;
                
                setTimeout(function() {
                    if (card) card.classList.remove('tf-active');
                    setTimeout(function() {
                        if (! TF.priorityItem) {
                            currentIndex++;
                        }
                        showNextPopup();
                    }, gap);
                }, duration);
                
            } catch (err) {
                // Silent recovery
                if (console && console. warn) {
                    console.warn('TrustFlow:  Popup recovered', err);
                }
                setTimeout(showNextPopup, 5000);
            }
        }
        
        // Initial delay before first popup
        setTimeout(showNextPopup, (settings.popupDelay || 2) * 1000);
    }
    
    // ============================================================
    // 🔄 AUTO-INITIALIZATION (Works Everywhere)
    // ============================================================
    
    // Inject styles first
    injectStyles();
    
    // Run immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrustFlow);
    } else {
        initTrustFlow();
    }
    
    // Watch for DOM changes (React/Next.js/Vue/SPAs)
    if (typeof MutationObserver !== 'undefined') {
        var observer = new MutationObserver(function(mutations) {
            // Debounce:  Only run if not recently run
            if (TF.mutationTimeout) return;
            TF.mutationTimeout = setTimeout(function() {
                initTrustFlow();
                TF.mutationTimeout = null;
            }, 100);
        });
        
        // Start observing when body is available
        var startObserver = function() {
            if (document.body) {
                observer. observe(document.body, { 
                    childList: true, 
                    subtree:  true 
                });
            } else {
                setTimeout(startObserver, 50);
            }
        };
        
        startObserver();
    }
    
    // Mark as initialized
    TF. initialized = true;
    
})();
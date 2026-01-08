(function() {
  // Find all TrustFlow widget scripts
  var scripts = document.querySelectorAll('script[data-space-id]');
  
  scripts.forEach(function(script) {
    // Prevent double-initialization
    if (script.getAttribute('data-tf-loaded')) return;
    script.setAttribute('data-tf-loaded', 'true');

    var spaceId = script.getAttribute('data-space-id');
    
    // 1. Detect Placement (Body = Floating Badge, Section = Inline)
    var placement = script.getAttribute('data-placement') || 'section'; 
    
    // 2. Minimal Params (We rely on Database for settings now, passing minimal overrides)
    var theme = script.getAttribute('data-theme') || 'light';
    
    // Construct Base Widget URL
    var baseUrl = script.src.replace('/embed.js', ''); 
    // We append specific params if strictly needed, otherwise the Widget fetches from DB
    var widgetUrl = baseUrl + '/widget/' + spaceId + '?theme=' + theme;

    // --- RENDER LOGIC ---

    if (placement === 'body') {
        // RENDER OPTION A: Floating Badge (Bottom Right)
        renderFloatingWidget(widgetUrl, theme);
    } else {
        // RENDER OPTION B: Inline Section (Default)
        renderInlineWidget(script, widgetUrl);
    }

    // --- HELPER FUNCTIONS ---

    function renderInlineWidget(scriptNode, url) {
        var container = document.createElement('div');
        container.className = 'trustflow-widget-container';
        container.style.width = '100%';
        container.style.position = 'relative';
        container.style.zIndex = '1';
        
        scriptNode.parentNode.insertBefore(container, scriptNode.nextSibling);

        var iframe = createIframe(url);
        container.appendChild(iframe);

        // Listen for Resize Events from the Widget
        window.addEventListener('message', function(event) {
            // Validate origin if possible in production, checking source window for now
            if (event.data.type === 'trustflow-resize') {
                 // You might want to match event.source to iframe.contentWindow here for extra safety
                 iframe.style.height = event.data.height + 'px';
            }
        });
    }

    function renderFloatingWidget(url, theme) {
        var isDark = theme === 'dark';
        
        // 1. Create the Floating "Launcher" Button
        var launcher = document.createElement('div');
        Object.assign(launcher.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '999998',
            transition: 'transform 0.2s ease',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
        });

        // Star Icon
        launcher.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        `;

        // Hover Animation
        launcher.onmouseover = function() { launcher.style.transform = 'scale(1.1)'; };
        launcher.onmouseout = function() { launcher.style.transform = 'scale(1.0)'; };

        // 2. Create the Modal Overlay
        var overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: '999999',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            backdropFilter: 'blur(4px)'
        });

        // 3. Create Modal Content Box
        var modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '85vh',
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
        });

        // Modal Header
        var header = document.createElement('div');
        Object.assign(header.style, {
            padding: '16px 24px',
            borderBottom: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        
        var title = document.createElement('h3');
        title.innerText = "Wall of Love";
        Object.assign(title.style, {
             margin: '0',
             fontFamily: 'system-ui, -apple-system, sans-serif',
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
            color: isDark ? '#94a3b8' : '#64748b',
            padding: '0 8px'
        });

        // Container for the Iframe (Scrollable)
        var iframeContainer = document.createElement('div');
        Object.assign(iframeContainer.style, {
            flex: '1',
            overflowY: 'auto',
            padding: '0',
            WebkitOverflowScrolling: 'touch'
        });

        var iframe = createIframe(url);
        iframe.style.minHeight = '400px'; 
        iframe.style.height = '100%'; 

        // Assemble the Modal
        header.appendChild(title);
        header.appendChild(closeBtn);
        iframeContainer.appendChild(iframe);
        modalContent.appendChild(header);
        modalContent.appendChild(iframeContainer);
        overlay.appendChild(modalContent);
        
        document.body.appendChild(launcher);
        document.body.appendChild(overlay);

        // Click Actions
        launcher.onclick = function() {
            overlay.style.display = 'flex';
            // Slight delay to allow display:flex to apply before opacity transition
            setTimeout(function() { overlay.style.opacity = '1'; }, 10);
        };

        var closeAction = function() {
            overlay.style.opacity = '0';
            setTimeout(function() { overlay.style.display = 'none'; }, 300);
        };

        closeBtn.onclick = closeAction;
        // Close when clicking outside the modal content
        overlay.onclick = function(e) {
            if (e.target === overlay) closeAction();
        };
    }

    function createIframe(url) {
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.backgroundColor = 'transparent'; 
        iframe.allowTransparency = "true";
        return iframe;
    }
  });
})();
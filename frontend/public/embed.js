(function() {
  // Find all TrustFlow widget scripts
  var scripts = document.querySelectorAll('script[data-space-id]');
  
  scripts.forEach(function(script) {
    var spaceId = script.getAttribute('data-space-id');
    var theme = script.getAttribute('data-theme') || 'light';
    var layout = script.getAttribute('data-layout') || 'grid';
    console.log(layout, theme, spaceId);
    
    // Create a dedicated container for this specific widget instance
    // (Changed from ID to standard element creation to support multiple widgets on one page)
    var container = document.createElement('div');
    container.className = 'trustflow-widget-container';
    container.style.width = '100%';
    container.style.position = 'relative';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Create iframe
    var iframe = document.createElement('iframe');
    var baseUrl = script.src.replace('/embed.js', '');

    // Updated route to '/widget/' to match your React App routes
    iframe.src = baseUrl + '/widget/' + spaceId + '?theme=' + theme + '&layout=' + layout;
    
    // --- UPDATED VISUAL STYLES FOR SEAMLESS EMBED ---
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.backgroundColor = 'transparent'; // Critical: Shows user's website background
    iframe.allowTransparency = "true";
    iframe.scrolling = 'no'; // Disable scrollbars for "Native" feel
    iframe.style.minHeight = '100px'; // Prevents collapse before loading
    
    // Handle iframe resize (Scoped to this specific iframe)
    window.addEventListener('message', function(event) {
      // Check if the message is coming from THIS specific iframe
      if (event.source === iframe.contentWindow && event.data.type === 'trustflow-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });
    
    container.appendChild(iframe);
  });
})();
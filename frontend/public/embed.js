(function() {
  // Find all TrustFlow widget scripts
  var scripts = document.querySelectorAll('script[data-space-id]');
  
  scripts.forEach(function(script) {
    var spaceId = script.getAttribute('data-space-id');
    
    // Read all configuration attributes (Defaults handled in React component)
    var theme = script.getAttribute('data-theme') || 'light';
    var layout = script.getAttribute('data-layout') || 'grid';
    var cardTheme = script.getAttribute('data-card-theme');
    var corners = script.getAttribute('data-corners');
    var shadow = script.getAttribute('data-shadow');
    var border = script.getAttribute('data-border'); // 'true' or 'false'
    var hoverEffect = script.getAttribute('data-hover-effect');
    var nameSize = script.getAttribute('data-name-size');
    var testimonialStyle = script.getAttribute('data-testimonial-style');
    var animation = script.getAttribute('data-animation');
    var speed = script.getAttribute('data-animation-speed');
    
    // Create a dedicated container for this specific widget instance
    var container = document.createElement('div');
    container.className = 'trustflow-widget-container';
    container.style.width = '100%';
    container.style.position = 'relative';
    script.parentNode.insertBefore(container, script.nextSibling);
    
    // Construct Query Params
    var baseUrl = script.src.replace('/embed.js', '');
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

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = baseUrl + '/widget/' + spaceId + '?' + params.toString();
    
    // Visual Styles
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.backgroundColor = 'transparent'; 
    iframe.allowTransparency = "true";
    iframe.scrolling = 'no'; 
    iframe.style.minHeight = '100px'; 
    
    // Handle iframe resize
    window.addEventListener('message', function(event) {
      if (event.source === iframe.contentWindow && event.data.type === 'trustflow-resize') {
        iframe.style.height = event.data.height + 'px';
      }
    });
    
    container.appendChild(iframe);
  });
})();
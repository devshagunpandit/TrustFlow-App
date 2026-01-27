/**
 * Integration Documentation Data
 * 
 * Comprehensive installation guides for TrustWall widget across all platforms.
 * Each integration includes the universal method and platform-specific alternatives.
 */

// =============================================================================
// UNIVERSAL EMBED CODE (Used across all platforms)
// =============================================================================
export const universalEmbedCode = {
  title: 'Universal Embed Code',
  description: 'This works on any website or platform. Just 2 simple steps!',
  scriptDescription: 'Step 1: Add this script tag inside your global HTML <head> tag or before the closing </body> tag. This loads the TrustWall widget on your entire site.',
  divDescription: 'Step 2: Place this div wherever you want the widget to appear on any page.',
  scriptTag: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
  divTag: `<div id="trustwall-widget"></div>`,
  note: 'Replace YOUR_SPACE_ID with your actual Space ID from the dashboard. You can find it in your Widget tab.',
};

// =============================================================================
// INTEGRATION CATEGORIES
// =============================================================================
export const integrationCategories = [
  { id: 'all', label: 'All Platforms', icon: 'Grid3X3' },
  { id: 'frameworks', label: 'Frameworks', icon: 'Code2' },
  { id: 'nocode', label: 'No-Code', icon: 'MousePointer' },
  { id: 'ecommerce', label: 'E-Commerce', icon: 'ShoppingCart' },
  { id: 'backend', label: 'Backend/Templates', icon: 'Server' },
];

// =============================================================================
// INTEGRATION GUIDES
// =============================================================================
export const integrationGuides = [
  // ============================================
  // MODERN FRONTEND FRAMEWORKS
  // ============================================
  {
    id: 'react',
    name: 'React',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    brandColor: '#61DAFB',
    difficulty: 'Easy',
    globalFile: 'public/index.html or App.jsx',
    description: 'Add the TrustWall widget to your React application.',
    universalMethod: {
      title: 'Method 1: Script Tag (Recommended)',
      steps: [
        {
          title: 'Open your public/index.html file',
          description: 'This is the main HTML template for your React app.',
        },
        {
          title: 'Add the script before closing </body>',
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
  </body>
</html>`,
          language: 'html',
        },
        {
          title: 'Add the widget container where needed',
          description: 'Place this div in any React component where you want the widget to appear.',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: React useEffect Hook',
      description: 'For more control, dynamically load the script in a React component.',
      steps: [
        {
          title: 'Create a TrustWallWidget component',
          code: `import { useEffect } from 'react';

const TrustWallWidget = ({ spaceId }) => {
  useEffect(() => {
    // Load TrustWall script
    const script = document.createElement('script');
    script.src = 'https://trustwall.live/embed.js';
    script.setAttribute('data-space-id', spaceId);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, [spaceId]);

  return <div id="trustwall-widget" />;
};

export default TrustWallWidget;`,
          language: 'jsx',
        },
        {
          title: 'Use the component in your app',
          code: `import TrustWallWidget from './TrustWallWidget';

function App() {
  return (
    <div>
      <h1>Customer Reviews</h1>
      <TrustWallWidget spaceId="YOUR_SPACE_ID" />
    </div>
  );
}`,
          language: 'jsx',
        },
      ],
    },
  },

  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    brandColor: '#000000',
    difficulty: 'Easy',
    globalFile: 'app/layout.tsx or pages/_document.tsx',
    description: 'Integrate TrustWall into your Next.js application using the App Router or Pages Router.',
    universalMethod: {
      title: 'Method 1: App Router (layout.tsx)',
      steps: [
        {
          title: 'Open your app/layout.tsx file',
          description: 'This is the root layout file in Next.js 13+ with App Router.',
        },
        {
          title: 'Add the Script component',
          code: `import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        
        {/* TrustWall Widget */}
        <Script 
          src="https://trustwall.live/embed.js"
          data-space-id="YOUR_SPACE_ID"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}`,
          language: 'tsx',
        },
        {
          title: 'Add the widget container in any page',
          code: `export default function TestimonialsPage() {
  return (
    <main>
      <h1>What Our Customers Say</h1>
      <div id="trustwall-widget" />
    </main>
  );
}`,
          language: 'tsx',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Pages Router (_document.tsx)',
      description: 'For Next.js with Pages Router, add the script in _document.tsx.',
      steps: [
        {
          title: 'Create or edit pages/_document.tsx',
          code: `import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        
        {/* TrustWall Widget */}
        <Script 
          src="https://trustwall.live/embed.js"
          data-space-id="YOUR_SPACE_ID"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}`,
          language: 'tsx',
        },
      ],
    },
  },

  {
    id: 'vue',
    name: 'Vue.js',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    brandColor: '#4FC08D',
    difficulty: 'Easy',
    globalFile: 'public/index.html or App.vue',
    description: 'Add TrustWall widget to your Vue 3 or Vue 2 application.',
    universalMethod: {
      title: 'Method 1: Script Tag in index.html',
      steps: [
        {
          title: 'Open public/index.html',
          description: 'This is the main HTML template for your Vue app.',
        },
        {
          title: 'Add the script before </body>',
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
  </body>
</html>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Vue Component',
      description: 'Create a reusable Vue component for the widget.',
      steps: [
        {
          title: 'Create TrustWallWidget.vue',
          code: `<template>
  <div id="trustwall-widget" ref="widgetContainer" />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  spaceId: {
    type: String,
    required: true
  }
});

let script = null;

onMounted(() => {
  script = document.createElement('script');
  script.src = 'https://trustwall.live/embed.js';
  script.setAttribute('data-space-id', props.spaceId);
  script.async = true;
  document.body.appendChild(script);
});

onUnmounted(() => {
  if (script) {
    document.body.removeChild(script);
  }
});
</script>`,
          language: 'vue',
        },
        {
          title: 'Use in your component',
          code: `<template>
  <div>
    <h1>Testimonials</h1>
    <TrustWallWidget spaceId="YOUR_SPACE_ID" />
  </div>
</template>

<script setup>
import TrustWallWidget from './TrustWallWidget.vue';
</script>`,
          language: 'vue',
        },
      ],
    },
  },

  {
    id: 'nuxt',
    name: 'Nuxt',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',
    brandColor: '#00DC82',
    difficulty: 'Easy',
    globalFile: 'nuxt.config.ts or app.vue',
    description: 'Integrate TrustWall into your Nuxt 3 application.',
    universalMethod: {
      title: 'Method 1: nuxt.config.ts',
      steps: [
        {
          title: 'Edit nuxt.config.ts',
          description: 'Add the script to the head configuration.',
          code: `export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://trustwall.live/embed.js',
          'data-space-id': 'YOUR_SPACE_ID',
          defer: true
        }
      ]
    }
  }
});`,
          language: 'typescript',
        },
        {
          title: 'Add widget container to any page',
          code: `<template>
  <div>
    <h1>Customer Reviews</h1>
    <div id="trustwall-widget" />
  </div>
</template>`,
          language: 'vue',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: useHead Composable',
      description: 'Dynamically add the script on specific pages.',
      steps: [
        {
          title: 'Use in a page component',
          code: `<script setup>
useHead({
  script: [
    {
      src: 'https://trustwall.live/embed.js',
      'data-space-id': 'YOUR_SPACE_ID',
      defer: true
    }
  ]
});
</script>

<template>
  <div>
    <h1>What People Say</h1>
    <div id="trustwall-widget" />
  </div>
</template>`,
          language: 'vue',
        },
      ],
    },
  },

  {
    id: 'svelte',
    name: 'Svelte',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
    brandColor: '#FF3E00',
    difficulty: 'Easy',
    globalFile: 'src/app.html or +layout.svelte',
    description: 'Add TrustWall to your Svelte or SvelteKit application.',
    universalMethod: {
      title: 'Method 1: app.html (SvelteKit)',
      steps: [
        {
          title: 'Edit src/app.html',
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
  </body>
</html>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Svelte Component with onMount',
      steps: [
        {
          title: 'Create TrustWallWidget.svelte',
          code: `<script>
  import { onMount, onDestroy } from 'svelte';
  
  export let spaceId;
  let script;

  onMount(() => {
    script = document.createElement('script');
    script.src = 'https://trustwall.live/embed.js';
    script.setAttribute('data-space-id', spaceId);
    script.async = true;
    document.body.appendChild(script);
  });

  onDestroy(() => {
    if (script && document.body.contains(script)) {
      document.body.removeChild(script);
    }
  });
</script>

<div id="trustwall-widget"></div>`,
          language: 'svelte',
        },
      ],
    },
  },

  {
    id: 'angular',
    name: 'Angular',
    category: 'frameworks',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
    brandColor: '#DD0031',
    difficulty: 'Medium',
    globalFile: 'src/index.html or angular.json',
    description: 'Integrate TrustWall into your Angular application.',
    universalMethod: {
      title: 'Method 1: index.html',
      steps: [
        {
          title: 'Edit src/index.html',
          code: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Angular App</title>
  <base href="/">
</head>
<body>
  <app-root></app-root>
  
  <!-- TrustWall Widget -->
  <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
</body>
</html>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Angular Component',
      description: 'Create a dedicated component with dynamic script loading.',
      steps: [
        {
          title: 'Create trustwall-widget.component.ts',
          code: `import { Component, Input, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-trustwall-widget',
  template: '<div id="trustwall-widget"></div>',
  standalone: true
})
export class TrustWallWidgetComponent implements OnInit, OnDestroy {
  @Input() spaceId!: string;
  private script: HTMLScriptElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.script = document.createElement('script');
      this.script.src = 'https://trustwall.live/embed.js';
      this.script.setAttribute('data-space-id', this.spaceId);
      this.script.async = true;
      document.body.appendChild(this.script);
    }
  }

  ngOnDestroy() {
    if (this.script) {
      document.body.removeChild(this.script);
    }
  }
}`,
          language: 'typescript',
        },
        {
          title: 'Use in your template',
          code: `<h1>Customer Testimonials</h1>
<app-trustwall-widget spaceId="YOUR_SPACE_ID"></app-trustwall-widget>`,
          language: 'html',
        },
      ],
    },
  },

  {
    id: 'remix',
    name: 'Remix',
    category: 'frameworks',
    icon: 'https://cdn.simpleicons.org/remix/000000',
    brandColor: '#000000',
    difficulty: 'Easy',
    globalFile: 'app/root.tsx',
    description: 'Add TrustWall to your Remix application.',
    universalMethod: {
      title: 'Method 1: root.tsx',
      steps: [
        {
          title: 'Edit app/root.tsx',
          code: `import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        
        {/* TrustWall Widget */}
        <script 
          src="https://trustwall.live/embed.js" 
          data-space-id="YOUR_SPACE_ID"
        />
      </body>
    </html>
  );
}`,
          language: 'tsx',
        },
      ],
    },
  },

  {
    id: 'astro',
    name: 'Astro',
    category: 'frameworks',
    icon: 'https://cdn.simpleicons.org/astro/FF5D01',
    brandColor: '#FF5D01',
    difficulty: 'Easy',
    globalFile: 'src/layouts/Layout.astro',
    description: 'Integrate TrustWall into your Astro site.',
    universalMethod: {
      title: 'Add to Layout.astro',
      steps: [
        {
          title: 'Edit src/layouts/Layout.astro',
          code: `---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
  </body>
</html>`,
          language: 'astro',
        },
        {
          title: 'Use in any page',
          code: `---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Testimonials">
  <h1>What Our Customers Say</h1>
  <div id="trustwall-widget"></div>
</Layout>`,
          language: 'astro',
        },
      ],
    },
  },

  // ============================================
  // BACKEND / TEMPLATE ENGINES
  // ============================================
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'backend',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
    brandColor: '#FF2D20',
    difficulty: 'Easy',
    globalFile: 'resources/views/layouts/app.blade.php',
    description: 'Add TrustWall to your Laravel Blade templates.',
    universalMethod: {
      title: 'Add to app.blade.php',
      steps: [
        {
          title: 'Edit resources/views/layouts/app.blade.php',
          code: `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="antialiased">
    @yield('content')
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
</body>
</html>`,
          language: 'blade',
        },
        {
          title: 'Add widget container to any view',
          code: `@extends('layouts.app')

@section('content')
    <h1>Customer Reviews</h1>
    <div id="trustwall-widget"></div>
@endsection`,
          language: 'blade',
        },
      ],
    },
  },

  {
    id: 'django',
    name: 'Django',
    category: 'backend',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',
    brandColor: '#092E20',
    difficulty: 'Easy',
    globalFile: 'templates/base.html',
    description: 'Integrate TrustWall into your Django templates.',
    universalMethod: {
      title: 'Add to base.html',
      steps: [
        {
          title: 'Edit templates/base.html',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}My Django App{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
</body>
</html>`,
          language: 'html',
        },
        {
          title: 'Use in any template',
          code: `{% extends "base.html" %}

{% block content %}
    <h1>Testimonials</h1>
    <div id="trustwall-widget"></div>
{% endblock %}`,
          language: 'html',
        },
      ],
    },
  },

  {
    id: 'rails',
    name: 'Ruby on Rails',
    category: 'backend',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg',
    brandColor: '#CC0000',
    difficulty: 'Easy',
    globalFile: 'app/views/layouts/application.html.erb',
    description: 'Add TrustWall to your Rails application layout.',
    universalMethod: {
      title: 'Add to application.html.erb',
      steps: [
        {
          title: 'Edit app/views/layouts/application.html.erb',
          code: `<!DOCTYPE html>
<html>
  <head>
    <title><%= content_for(:title) || "My Rails App" %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>
    <%= stylesheet_link_tag "application" %>
    <%= javascript_importmap_tags %>
  </head>

  <body>
    <%= yield %>
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
  </body>
</html>`,
          language: 'erb',
        },
      ],
    },
  },

  {
    id: 'aspnet',
    name: 'ASP.NET',
    category: 'backend',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
    brandColor: '#512BD4',
    difficulty: 'Easy',
    globalFile: 'Views/Shared/_Layout.cshtml or Pages/_Layout.cshtml',
    description: 'Add TrustWall to your ASP.NET Core application.',
    universalMethod: {
      title: 'Add to _Layout.cshtml',
      steps: [
        {
          title: 'Edit Views/Shared/_Layout.cshtml',
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@ViewData["Title"] - My App</title>
    <link rel="stylesheet" href="~/css/site.css" />
</head>
<body>
    <main role="main">
        @RenderBody()
    </main>
    
    @RenderSection("Scripts", required: false)
    
    <!-- TrustWall Widget -->
    <script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
</body>
</html>`,
          language: 'cshtml',
        },
      ],
    },
  },

  // ============================================
  // NO-CODE / WEBSITE BUILDERS
  // ============================================
  {
    id: 'webflow',
    name: 'Webflow',
    category: 'nocode',
    icon: 'https://cdn.simpleicons.org/webflow/4353FF',
    brandColor: '#4353FF',
    difficulty: 'Easy',
    globalFile: 'Project Settings > Custom Code',
    description: 'Add TrustWall to your Webflow site using custom code injection.',
    imagePlaceholders: [
      '[Image: Screenshot of Webflow Dashboard]',
      '[Image: Screenshot of Webflow Custom Code Tab]',
      '[Image: Screenshot of Webflow Embed Element]',
    ],
    universalMethod: {
      title: 'Method 1: Site-Wide Installation (Recommended)',
      steps: [
        {
          title: 'Go to Project Settings',
          description: 'In your Webflow dashboard, click the gear icon ⚙️ to open Project Settings.',
        },
        {
          title: 'Navigate to Custom Code tab',
          description: 'Click on the "Custom Code" tab in the left sidebar.',
          imagePlaceholder: '[Image: Screenshot of Webflow Custom Code Tab]',
        },
        {
          title: 'Paste in Footer Code section',
          description: 'Add the following code in the "Footer Code" section (before </body> tag):',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Save and Publish',
          description: 'Click "Save Changes" and then publish your site.',
        },
        {
          title: 'Add widget container',
          description: 'In the Webflow Designer, add an Embed element where you want the widget and paste:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Page-Specific Installation',
      description: 'Add the widget to specific pages only.',
      steps: [
        {
          title: 'Open the page in Designer',
          description: 'Navigate to the specific page where you want the widget.',
        },
        {
          title: 'Add an Embed element',
          description: 'From the Elements panel, drag an "Embed" element to your page.',
          imagePlaceholder: '[Image: Screenshot of Webflow Embed Element]',
        },
        {
          title: 'Paste the complete code',
          code: `<div id="trustwall-widget"></div>
<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Publish your site',
          description: 'The widget will only appear on this page.',
        },
      ],
    },
  },

  {
    id: 'wix',
    name: 'Wix',
    category: 'nocode',
    icon: 'https://cdn.simpleicons.org/wix/0C6EFC',
    brandColor: '#0C6EFC',
    difficulty: 'Easy',
    globalFile: 'Settings > Custom Code',
    description: 'Add TrustWall to your Wix website using Velo or Custom Code.',
    imagePlaceholders: [
      '[Image: Screenshot of Wix Settings Menu]',
      '[Image: Screenshot of Wix Custom Code Settings]',
      '[Image: Screenshot of Wix HTML iframe]',
    ],
    universalMethod: {
      title: 'Method 1: Custom Code (Site-Wide)',
      steps: [
        {
          title: 'Open Wix Dashboard',
          description: 'Go to your Wix site dashboard.',
        },
        {
          title: 'Navigate to Settings > Custom Code',
          description: 'Click "Settings" in the left menu, then "Custom Code".',
          imagePlaceholder: '[Image: Screenshot of Wix Custom Code Settings]',
        },
        {
          title: 'Click "+ Add Code"',
          description: 'Click the button to add new custom code.',
        },
        {
          title: 'Configure the code snippet',
          description: 'Paste the script and configure:\n• Name: TrustWall Widget\n• Add Code to Pages: All pages\n• Place Code in: Body - end',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Add HTML iframe for widget container',
          description: 'In the Wix Editor, add an "HTML iframe" element where you want the widget and paste:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
          imagePlaceholder: '[Image: Screenshot of Wix HTML iframe]',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Embed Widget on Specific Page',
      description: 'Add directly using the Embed option.',
      steps: [
        {
          title: 'Open the Wix Editor',
          description: 'Edit the page where you want the widget.',
        },
        {
          title: 'Add > Embed Code > Embed HTML',
          description: 'Click the "+" button, then Embed > Embed Code.',
        },
        {
          title: 'Paste the complete code',
          code: `<div id="trustwall-widget"></div>
<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Resize and position',
          description: 'Adjust the embed element size to fit your design.',
        },
      ],
    },
  },

  {
    id: 'squarespace',
    name: 'Squarespace',
    category: 'nocode',
    icon: 'https://cdn.simpleicons.org/squarespace/000000',
    brandColor: '#000000',
    difficulty: 'Easy',
    globalFile: 'Settings > Advanced > Code Injection',
    description: 'Add TrustWall to your Squarespace site using Code Injection.',
    imagePlaceholders: [
      '[Image: Screenshot of Squarespace Settings]',
      '[Image: Screenshot of Squarespace Code Injection]',
    ],
    universalMethod: {
      title: 'Site-Wide Installation',
      steps: [
        {
          title: 'Go to Settings',
          description: 'From your Squarespace dashboard, click "Settings".',
        },
        {
          title: 'Navigate to Advanced > Code Injection',
          description: 'Click "Advanced" then "Code Injection".',
          imagePlaceholder: '[Image: Screenshot of Squarespace Code Injection]',
        },
        {
          title: 'Add to Footer section',
          description: 'Paste the script in the "Footer" code injection area:',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Click Save',
          description: 'Save your changes.',
        },
        {
          title: 'Add Code Block for widget',
          description: 'On the page where you want the widget, add a "Code Block" and paste:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
  },

  {
    id: 'framer',
    name: 'Framer',
    category: 'nocode',
    icon: 'https://cdn.simpleicons.org/framer/0055FF',
    brandColor: '#0055FF',
    difficulty: 'Easy',
    globalFile: 'Site Settings > Custom Code',
    description: 'Add TrustWall widget to your Framer site.',
    imagePlaceholders: [
      '[Image: Screenshot of Framer Site Settings]',
      '[Image: Screenshot of Framer Custom Code]',
    ],
    universalMethod: {
      title: 'Using Custom Code',
      steps: [
        {
          title: 'Open Site Settings',
          description: 'Click the gear icon in the top-right corner.',
        },
        {
          title: 'Go to Custom Code',
          description: 'Navigate to the "Custom Code" section.',
          imagePlaceholder: '[Image: Screenshot of Framer Custom Code]',
        },
        {
          title: 'Add to End of <body> tag',
          description: 'Paste the script in the "End of <body> tag" section:',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Add Embed component',
          description: 'On your page, add an "Embed" component and paste:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
        {
          title: 'Publish your site',
          description: 'The widget will appear after publishing.',
        },
      ],
    },
  },

  {
    id: 'wordpress',
    name: 'WordPress',
    category: 'nocode',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg',
    brandColor: '#21759B',
    difficulty: 'Easy',
    globalFile: 'Theme Header/Footer or Plugin',
    description: 'Add TrustWall to your WordPress site using theme files or plugins.',
    imagePlaceholders: [
      '[Image: Screenshot of WordPress Theme Editor]',
      '[Image: Screenshot of WordPress Customizer]',
    ],
    universalMethod: {
      title: 'Method 1: Theme Customizer',
      steps: [
        {
          title: 'Go to Appearance > Customize',
          description: 'In your WordPress dashboard, navigate to Appearance > Customize.',
        },
        {
          title: 'Find Additional CSS/JS section',
          description: 'Look for "Additional JavaScript" or use a plugin like "Insert Headers and Footers".',
        },
        {
          title: 'Add to footer',
          description: 'Paste the script to be added before </body>:',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Add widget using Shortcode or HTML block',
          description: 'In Gutenberg, add a Custom HTML block:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Method 2: Edit Theme Files',
      description: 'Directly edit theme files (for developers).',
      steps: [
        {
          title: 'Go to Appearance > Theme File Editor',
          description: 'Navigate to the theme editor.',
          imagePlaceholder: '[Image: Screenshot of WordPress Theme Editor]',
        },
        {
          title: 'Edit footer.php',
          description: 'Find footer.php and add before wp_footer():',
          code: `<!-- TrustWall Widget -->
<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
<?php wp_footer(); ?>
</body>
</html>`,
          language: 'php',
        },
      ],
    },
  },

  // ============================================
  // E-COMMERCE PLATFORMS
  // ============================================
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    icon: 'https://cdn.simpleicons.org/shopify/7AB55C',
    brandColor: '#96BF48',
    difficulty: 'Easy',
    globalFile: 'theme.liquid',
    description: 'Add TrustWall to your Shopify store by editing theme.liquid.',
    imagePlaceholders: [
      '[Image: Screenshot of Shopify Theme Editor]',
      '[Image: Screenshot of theme.liquid file]',
    ],
    universalMethod: {
      title: 'Edit theme.liquid',
      steps: [
        {
          title: 'Go to Online Store > Themes',
          description: 'From your Shopify admin, navigate to Online Store > Themes.',
        },
        {
          title: 'Click Actions > Edit Code',
          description: 'On your active theme, click "Actions" then "Edit code".',
          imagePlaceholder: '[Image: Screenshot of Shopify Theme Editor]',
        },
        {
          title: 'Open theme.liquid',
          description: 'In the Layout folder, click on theme.liquid.',
          imagePlaceholder: '[Image: Screenshot of theme.liquid file]',
        },
        {
          title: 'Add script before </body>',
          description: 'Find the closing </body> tag and add the script just before it:',
          code: `<!-- TrustWall Widget -->
<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>
</body>`,
          language: 'liquid',
        },
        {
          title: 'Save and add widget container',
          description: 'Save the file. Then add the widget container to any page using a Custom Liquid section:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
    nativeMethod: {
      title: 'Alternative: Shopify Sections',
      description: 'Create a dedicated section for the widget.',
      steps: [
        {
          title: 'Create a new section',
          description: 'In Sections folder, create trustwall-widget.liquid:',
          code: `<div class="trustwall-section">
  <div id="trustwall-widget"></div>
</div>

<script src="https://trustwall.live/embed.js" data-space-id="{{ section.settings.space_id }}"></script>

{% schema %}
{
  "name": "TrustWall Widget",
  "settings": [
    {
      "type": "text",
      "id": "space_id",
      "label": "Space ID",
      "default": "YOUR_SPACE_ID"
    }
  ],
  "presets": [
    {
      "name": "TrustWall Widget"
    }
  ]
}
{% endschema %}`,
          language: 'liquid',
        },
        {
          title: 'Add section to your page',
          description: 'Use the Theme Customizer to add the TrustWall Widget section to any page.',
        },
      ],
    },
  },

  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'ecommerce',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-original.svg',
    brandColor: '#96588A',
    difficulty: 'Easy',
    globalFile: 'theme functions.php or footer.php',
    description: 'Add TrustWall to your WooCommerce store.',
    universalMethod: {
      title: 'Add to WordPress Theme',
      steps: [
        {
          title: 'Go to Appearance > Theme File Editor',
          description: 'Access your theme files from WordPress dashboard.',
        },
        {
          title: 'Edit footer.php or use functions.php',
          description: 'Add to footer.php before </body>, or use functions.php:',
          code: `// Add to functions.php
function add_trustwall_widget() {
    echo '<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>';
}
add_action('wp_footer', 'add_trustwall_widget');`,
          language: 'php',
        },
        {
          title: 'Add widget to product pages',
          description: 'Use a Custom HTML block or shortcode to display the widget:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
  },

  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    category: 'ecommerce',
    icon: 'https://cdn.simpleicons.org/bigcommerce/121118',
    brandColor: '#121118',
    difficulty: 'Easy',
    globalFile: 'Storefront > Script Manager',
    description: 'Add TrustWall to your BigCommerce store.',
    universalMethod: {
      title: 'Using Script Manager',
      steps: [
        {
          title: 'Go to Storefront > Script Manager',
          description: 'From your BigCommerce admin panel.',
        },
        {
          title: 'Click Create a Script',
          description: 'Create a new script with these settings:\n• Name: TrustWall Widget\n• Location: Footer\n• Pages: All pages',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'html',
        },
        {
          title: 'Add widget container',
          description: 'Use the Page Builder to add an HTML widget with:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
  },

  {
    id: 'magento',
    name: 'Magento',
    category: 'ecommerce',
    icon: 'https://cdn.simpleicons.org/magento/EE672F',
    brandColor: '#F26322',
    difficulty: 'Medium',
    globalFile: 'default_head_blocks.xml or CMS',
    description: 'Add TrustWall to your Magento / Adobe Commerce store.',
    universalMethod: {
      title: 'Using Layout XML',
      steps: [
        {
          title: 'Create or edit default.xml',
          description: 'In your theme folder: app/design/frontend/[Vendor]/[theme]/Magento_Theme/layout/',
          code: `<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <body>
        <referenceContainer name="before.body.end">
            <block class="Magento\\Framework\\View\\Element\\Template" name="trustwall.widget" template="Magento_Theme::html/trustwall.phtml"/>
        </referenceContainer>
    </body>
</page>`,
          language: 'xml',
        },
        {
          title: 'Create the template file',
          description: 'Create trustwall.phtml in app/design/frontend/[Vendor]/[theme]/Magento_Theme/templates/html/',
          code: `<script src="https://trustwall.live/embed.js" data-space-id="YOUR_SPACE_ID"></script>`,
          language: 'php',
        },
        {
          title: 'Add widget container via CMS',
          description: 'Use CMS blocks or widgets to add:',
          code: `<div id="trustwall-widget"></div>`,
          language: 'html',
        },
      ],
    },
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all unique categories
 */
export const getCategories = () => integrationCategories;

/**
 * Get integrations by category
 */
export const getIntegrationsByCategory = (category) => {
  if (category === 'all') return integrationGuides;
  return integrationGuides.filter(guide => guide.category === category);
};

/**
 * Get a single integration by ID
 */
export const getIntegrationById = (id) => {
  return integrationGuides.find(guide => guide.id === id);
};

/**
 * Search integrations by name
 */
export const searchIntegrations = (query) => {
  const lowerQuery = query.toLowerCase();
  return integrationGuides.filter(guide => 
    guide.name.toLowerCase().includes(lowerQuery) ||
    guide.description.toLowerCase().includes(lowerQuery) ||
    guide.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get featured/popular integrations
 */
export const getFeaturedIntegrations = () => {
  const featuredIds = ['react', 'nextjs', 'webflow', 'shopify', 'wordpress', 'wix'];
  return integrationGuides.filter(guide => featuredIds.includes(guide.id));
};

export default {
  universalEmbedCode,
  integrationCategories,
  integrationGuides,
  getCategories,
  getIntegrationsByCategory,
  getIntegrationById,
  searchIntegrations,
  getFeaturedIntegrations,
};

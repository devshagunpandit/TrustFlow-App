/**
 * IntegrationDocs - Integration Knowledge Base Page
 * 
 * Comprehensive documentation for installing TrustWall widget on any platform.
 * Includes search, filtering by category, and syntax-highlighted code blocks.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Code2,
  MousePointer,
  ShoppingCart,
  Server,
  Grid3X3,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Star,
  Zap,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Terminal,
  FileCode,
  Info,
  X,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  integrationGuides,
  integrationCategories,
  universalEmbedCode,
  getIntegrationsByCategory,
  getIntegrationById,
  searchIntegrations,
  getFeaturedIntegrations,
} from '@/data/integrationDocs';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

// =============================================================================
// CODE BLOCK COMPONENT WITH SYNTAX HIGHLIGHTING
// =============================================================================
const CodeBlock = ({ code, language = 'html', showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting based on language
  const highlightCode = (code, lang) => {
    // Basic keyword highlighting
    let highlighted = code;
    
    const htmlKeywords = ['script', 'div', 'html', 'head', 'body', 'meta', 'title', 'link', 'style'];
    const jsKeywords = ['import', 'export', 'default', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'from', 'useEffect', 'useState', 'onMounted', 'onUnmounted'];
    const attributes = ['src', 'data-space-id', 'class', 'className', 'id', 'href', 'rel', 'type', 'lang', 'charset'];
    
    return code;
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      html: 'HTML',
      jsx: 'JSX',
      tsx: 'TSX',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      vue: 'Vue',
      svelte: 'Svelte',
      astro: 'Astro',
      blade: 'Blade',
      erb: 'ERB',
      php: 'PHP',
      liquid: 'Liquid',
      xml: 'XML',
      cshtml: 'Razor',
    };
    return labels[lang] || lang.toUpperCase();
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-slate-400 ml-2 font-mono">{getLanguageLabel(language)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1 text-green-400" />
              <span className="text-xs text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-slate-100 whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
};

// =============================================================================
// CATEGORY ICON COMPONENT
// =============================================================================
const CategoryIcon = ({ iconName, className = "w-5 h-5" }) => {
  const icons = {
    Grid3X3: Grid3X3,
    Code2: Code2,
    MousePointer: MousePointer,
    ShoppingCart: ShoppingCart,
    Server: Server,
  };
  const Icon = icons[iconName] || Grid3X3;
  return <Icon className={className} />;
};

// =============================================================================
// DIFFICULTY BADGE
// =============================================================================
const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[difficulty] || colors.Easy}`}>
      {difficulty}
    </span>
  );
};

// =============================================================================
// INTEGRATION CARD (GRID VIEW)
// =============================================================================
const IntegrationCard = ({ guide, onClick, isSelected }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 p-2 flex-shrink-0">
          <img
            src={guide.icon}
            alt={guide.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
              {guide.name}
            </h3>
            <DifficultyBadge difficulty={guide.difficulty} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {guide.globalFile}
          </p>
        </div>
        
        <ChevronRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
      </div>
    </motion.div>
  );
};

// =============================================================================
// UNIVERSAL CODE SECTION
// =============================================================================
const UniversalCodeSection = ({ spaceId }) => {
  const displaySpaceId = spaceId || 'YOUR_SPACE_ID';
  
  return (
    <Card className="border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {universalEmbedCode.title}
              <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                Works Everywhere
              </Badge>
            </CardTitle>
            <CardDescription>{universalEmbedCode.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold mr-2">1</span>
            {universalEmbedCode.scriptDescription || 'Add this script in your global HTML <head> tag or before </body>:'}
          </p>
          <CodeBlock 
            code={universalEmbedCode.scriptTag.replace('YOUR_SPACE_ID', displaySpaceId)} 
            language="html" 
          />
        </div>
        
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-xs font-bold mr-2">2</span>
            {universalEmbedCode.divDescription || 'Place this div wherever you want the widget to appear:'}
          </p>
          <CodeBlock code={universalEmbedCode.divTag} language="html" />
        </div>
        
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {universalEmbedCode.note}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// INTEGRATION DETAIL VIEW
// =============================================================================
const IntegrationDetail = ({ guide, spaceId }) => {
  const displaySpaceId = spaceId || 'YOUR_SPACE_ID';
  
  const replaceSpaceId = (code) => {
    return code.replace(/YOUR_SPACE_ID/g, displaySpaceId);
  };
  
  if (!guide) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
          Select a Platform
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Choose a platform from the list to view installation instructions.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div 
          className="w-14 h-14 rounded-xl p-2.5 flex-shrink-0"
          style={{ backgroundColor: `${guide.brandColor}15` }}
        >
          <img
            src={guide.icon}
            alt={guide.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {guide.name}
            </h2>
            <DifficultyBadge difficulty={guide.difficulty} />
          </div>
          <p className="text-slate-600 dark:text-slate-400">{guide.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <FileCode className="w-4 h-4 text-slate-400" />
            <code className="text-sm text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-0.5 rounded">
              {guide.globalFile}
            </code>
          </div>
        </div>
      </div>

      {/* Universal Method */}
      {guide.universalMethod && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-violet-600" />
            {guide.universalMethod.title}
          </h3>
          
          <ol className="space-y-6">
            {guide.universalMethod.steps.map((step, index) => (
              <li key={index} className="relative pl-8">
                <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {step.title}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {step.description}
                    </p>
                  )}
                  {step.imagePlaceholder && (
                    <div className="my-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                        {step.imagePlaceholder}
                      </span>
                    </div>
                  )}
                  {step.code && (
                    <CodeBlock code={replaceSpaceId(step.code)} language={step.language || 'html'} />
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Native/Alternative Method */}
      {guide.nativeMethod && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="native" className="border-none">
              <AccordionTrigger className="text-lg font-semibold text-slate-900 dark:text-white hover:no-underline py-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {guide.nativeMethod.title}
                  <Badge variant="outline" className="ml-2 text-xs">Alternative</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {guide.nativeMethod.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {guide.nativeMethod.description}
                  </p>
                )}
                
                <ol className="space-y-6">
                  {guide.nativeMethod.steps.map((step, index) => (
                    <li key={index} className="relative pl-8">
                      <span className="absolute left-0 top-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        {step.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {step.description}
                          </p>
                        )}
                        {step.code && (
                          <CodeBlock code={replaceSpaceId(step.code)} language={step.language || 'html'} />
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const IntegrationDocs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Get space ID from URL if provided
  const spaceId = searchParams.get('spaceId') || null;

  // Initialize selected guide from URL
  useEffect(() => {
    const guideId = searchParams.get('platform');
    if (guideId) {
      const guide = getIntegrationById(guideId);
      if (guide) {
        setSelectedGuide(guide);
        setSelectedCategory(guide.category);
      }
    }
  }, [searchParams]);

  // Filter integrations based on search and category
  const filteredGuides = useMemo(() => {
    let guides = searchQuery 
      ? searchIntegrations(searchQuery) 
      : getIntegrationsByCategory(selectedCategory);
    return guides;
  }, [searchQuery, selectedCategory]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setSelectedGuide(null);
    setSearchParams(prev => {
      prev.set('category', categoryId);
      prev.delete('platform');
      return prev;
    });
  };

  // Handle guide selection
  const handleGuideSelect = (guide) => {
    setSelectedGuide(guide);
    setIsMobileSidebarOpen(false);
    setSearchParams(prev => {
      prev.set('platform', guide.id);
      prev.set('category', guide.category);
      return prev;
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <Helmet>
        <title>Integration Guide - TrustWall | Install Widget on Any Platform</title>
        <meta name="description" content="Step-by-step guides to install TrustWall testimonial widget on React, Next.js, Vue, Webflow, Shopify, WordPress, and more." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <MarketingNavbar />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-violet-50 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                <BookOpen className="w-3 h-3 mr-1" />
                Integration Guide
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Install TrustWall on{' '}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Any Platform
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Follow our step-by-step guides to add beautiful testimonial widgets to your website in minutes.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search your platform (e.g., React, Wix, Shopify)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 h-12 text-base rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Menu className="w-4 h-4" />
                  {selectedGuide ? selectedGuide.name : 'Select Platform'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileSidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Sidebar */}
            <aside className={`lg:w-80 flex-shrink-0 ${isMobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-4 space-y-6">
                {/* Category Filters */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 pt-0">
                    {integrationCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <CategoryIcon iconName={category.icon} className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className="ml-auto text-xs text-slate-400">
                          {getIntegrationsByCategory(category.id).length}
                        </span>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Platform List */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {searchQuery ? 'Search Results' : 'Platforms'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {filteredGuides.length > 0 ? (
                          filteredGuides.map((guide) => (
                            <IntegrationCard
                              key={guide.id}
                              guide={guide}
                              isSelected={selectedGuide?.id === guide.id}
                              onClick={() => handleGuideSelect(guide)}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              No platforms found for "{searchQuery}"
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={clearSearch}
                              className="mt-2 text-violet-600"
                            >
                              Clear search
                            </Button>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {/* Universal Code Section - Always visible */}
              <UniversalCodeSection spaceId={spaceId} />

              {/* Selected Platform Guide */}
              <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardContent className="p-6 md:p-8">
                  <IntegrationDetail guide={selectedGuide} spaceId={spaceId} />
                </CardContent>
              </Card>

              {/* Featured Platforms (when nothing selected) */}
              {!selectedGuide && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Popular Platforms
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFeaturedIntegrations().map((guide) => (
                      <IntegrationCard
                        key={guide.id}
                        guide={guide}
                        isSelected={false}
                        onClick={() => handleGuideSelect(guide)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Back to Dashboard CTA */}
        <div className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-center gap-4">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                Go to Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <MarketingFooter />
      </div>
    </>
  );
};

export default IntegrationDocs;

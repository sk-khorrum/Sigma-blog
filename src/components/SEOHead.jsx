import { useEffect } from 'react'

const SEOHead = ({ post, isHomePage = false }) => {
  useEffect(() => {
    if (isHomePage) {
      // Homepage structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Sigma Blog",
        "description": "A modern, SEO-friendly blog platform with multi-language support, author profiles, and interactive features",
        "url": window.location.origin,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": window.location.origin + "/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Sigma Blog",
          "logo": {
            "@type": "ImageObject",
            "url": window.location.origin + "/favicon.ico"
          }
        }
      }

      // Add structured data to head
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(structuredData)
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    } else if (post) {
      // Article structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": post.author.name,
          "url": post.author.website || window.location.origin + "/authors/" + post.author.name.toLowerCase().replace(/\s+/g, '-')
        },
        "publisher": {
          "@type": "Organization",
          "name": "Sigma Blog",
          "logo": {
            "@type": "ImageObject",
            "url": window.location.origin + "/favicon.ico"
          }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        },
        "keywords": post.tags ? post.tags.join(", ") : "",
        "articleSection": post.category,
        "wordCount": post.content.split(' ').length,
        "timeRequired": `PT${post.readTime}M`
      }

      // Google News specific structured data
      const newsData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "author": {
          "@type": "Person",
          "name": post.author.name
        },
        "publisher": {
          "@type": "Organization",
          "name": "Smart Blog",
          "logo": {
            "@type": "ImageObject",
            "url": window.location.origin + "/favicon.ico"
          }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        }
      }

      // Update meta tags
      document.title = `${post.title} - Smart Blog`
      
      // Update or create meta tags
      const updateMetaTag = (name, content, property = false) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
        let meta = document.querySelector(selector)
        if (!meta) {
          meta = document.createElement('meta')
          if (property) {
            meta.setAttribute('property', name)
          } else {
            meta.setAttribute('name', name)
          }
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', content)
      }

      updateMetaTag('description', post.excerpt)
      updateMetaTag('keywords', post.tags ? post.tags.join(', ') : '')
      updateMetaTag('author', post.author.name)
      updateMetaTag('article:published_time', post.publishedAt, true)
      updateMetaTag('article:modified_time', post.updatedAt, true)
      updateMetaTag('article:author', post.author.name, true)
      updateMetaTag('article:section', post.category, true)
      updateMetaTag('article:tag', post.tags ? post.tags.join(', ') : '', true)
      updateMetaTag('og:title', post.title, true)
      updateMetaTag('og:description', post.excerpt, true)
      updateMetaTag('og:image', post.image, true)
      updateMetaTag('og:type', 'article', true)
      updateMetaTag('og:url', window.location.href, true)
      updateMetaTag('twitter:card', 'summary_large_image')
      updateMetaTag('twitter:title', post.title)
      updateMetaTag('twitter:description', post.excerpt)
      updateMetaTag('twitter:image', post.image)

      // Add structured data to head
      const articleScript = document.createElement('script')
      articleScript.type = 'application/ld+json'
      articleScript.textContent = JSON.stringify(structuredData)
      document.head.appendChild(articleScript)

      const newsScript = document.createElement('script')
      newsScript.type = 'application/ld+json'
      newsScript.textContent = JSON.stringify(newsData)
      document.head.appendChild(newsScript)

      return () => {
        document.head.removeChild(articleScript)
        document.head.removeChild(newsScript)
      }
    }
  }, [post, isHomePage])

  return null
}

export default SEOHead


import { useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'

const GoogleTranslate = ({ className = "" }) => {
  const translateRef = useRef(null)

  useEffect(() => {
    // Check if Google Translate script is already loaded
    if (window.google && window.google.translate) {
      initializeTranslate()
    } else {
      // Load Google Translate script
      const script = document.createElement('script')
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      
      // Set up callback
      window.googleTranslateElementInit = initializeTranslate
      
      document.head.appendChild(script)
    }

    function initializeTranslate() {
      if (translateRef.current && !translateRef.current.hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,ru,ja,ko,zh-cn,zh-tw,ar,hi,bn,ur,fa,tr,pl,nl,sv,da,no,fi,cs,sk,hu,ro,bg,hr,sl,et,lv,lt,mt,ga,cy,eu,ca,gl,is,mk,sq,sr,bs,me,az,ka,hy,he,yi,th,vi,lo,km,my,si,ta,te,kn,ml,gu,pa,ne,mr,as,or,bn,sd,ks,dv',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          translateRef.current
        )
      }
    }

    return () => {
      // Cleanup
      if (window.googleTranslateElementInit) {
        delete window.googleTranslateElementInit
      }
    }
  }, [])

  return (
    <div className={`google-translate-container ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Translate this page:</span>
      </div>
      <div ref={translateRef} className="google-translate-element"></div>
      <style jsx>{`
        .google-translate-container .goog-te-gadget {
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .google-translate-container .goog-te-gadget-simple {
          background-color: #f8f9fa !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value {
          color: #374151 !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value:hover {
          text-decoration: none !important;
        }
        .google-translate-container .goog-te-gadget-icon {
          display: none !important;
        }
        .google-translate-container .goog-te-gadget-simple .goog-te-menu-value span {
          color: #6b7280 !important;
        }
      `}</style>
    </div>
  )
}

export default GoogleTranslate


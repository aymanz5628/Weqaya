import type { StrapiApp } from '@strapi/strapi/admin';

// Custom CSS for Arabic RTL support and better styling in admin panel
const rtlStyles = `
  /* Load Arabic fonts */
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap');

  /* RTL support for Blocks editor and text fields */
  [class*="BlocksEditor"],
  [class*="Editor"] [contenteditable],
  [class*="blocks"] [contenteditable],
  .CodeMirror,
  .CodeMirror-code,
  textarea[name="content"],
  textarea[name="description"],
  [class*="Wysiwyg"] {
    direction: rtl !important;
    text-align: right !important;
    font-family: 'IBM Plex Sans Arabic', 'Tajawal', 'Arial', sans-serif !important;
    font-size: 16px !important;
    line-height: 1.9 !important;
  }
  
  /* RTL support for input fields */
  input[name="title"],
  input[name="seoTitle"],
  textarea[name="seoDescription"],
  textarea[name="keywords"] {
    direction: rtl !important;
    text-align: right !important;
    font-family: 'IBM Plex Sans Arabic', 'Tajawal', 'Arial', sans-serif !important;
    font-size: 18px !important;
  }
  
  /* Better styling for contenteditable blocks */
  [contenteditable="true"] {
    direction: rtl !important;
    text-align: right !important;
    font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif !important;
    line-height: 1.9 !important;
  }
  
  /* Headers in editor */
  [contenteditable] h1,
  [contenteditable] h2,
  [contenteditable] h3 {
    font-weight: 700 !important;
    margin: 1em 0 0.5em !important;
  }
  
  /* Lists RTL */
  [contenteditable] ul,
  [contenteditable] ol {
    padding-right: 2em !important;
    padding-left: 0 !important;
    direction: rtl !important;
  }
  
  /* Blockquote styling */
  [contenteditable] blockquote,
  blockquote {
    border-right: 4px solid #4a90d9 !important;
    border-left: none !important;
    padding-right: 1em !important;
    margin-right: 0 !important;
    background: #f8f9fa !important;
  }
`;

export default {
  config: {
    locales: ['ar'],
    translations: {
      ar: {
        'app.components.LeftMenu.navbrand.title': 'لوحة التحكم',
        'app.components.LeftMenu.navbrand.workplace': 'وقاية+',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    // Inject RTL styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = rtlStyles;
    document.head.appendChild(styleSheet);
    
    console.log('Strapi admin bootstrapped with Arabic RTL and Blocks editor support');
  },
};

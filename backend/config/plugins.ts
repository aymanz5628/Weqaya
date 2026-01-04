export default () => ({
  tinymce: {
    enabled: true,
    config: {
      editor: {
        // Your TinyMCE API Key
        apiKey: 'fau67spqatkua4hvv5binyuvvqs3r17wdh5ge8gf767jd0bz',
        
        // Arabic RTL support
        directionality: 'rtl',
        language: 'ar',
        
        // Editor height
        height: 500,
        
        // Rich toolbar with all formatting options
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        
        // All plugins including premium features (trial until Jan 14, 2026)
        plugins: [
          // Core editing features
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          // Premium features
          'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
        ],
        
        // Comments configuration
        tinycomments_mode: 'embedded',
        tinycomments_author: 'وقاية+ المحرر',
        
        // Merge tags for Arabic
        mergetags_list: [
          { value: 'الاسم.الأول', title: 'الاسم الأول' },
          { value: 'البريد.الإلكتروني', title: 'البريد الإلكتروني' },
        ],
        
        // Block formats for headings
        block_formats: 'فقرة=p; عنوان 1=h1; عنوان 2=h2; عنوان 3=h3; عنوان 4=h4; اقتباس=blockquote',
        
        // Font family options including Arabic fonts
        font_family_formats: 'IBM Plex Sans Arabic=IBM Plex Sans Arabic,sans-serif; Tajawal=Tajawal,sans-serif; Cairo=Cairo,sans-serif; Arial=arial,helvetica,sans-serif',
        
        // Font size options
        font_size_formats: '12px 14px 16px 18px 20px 24px 28px 32px 36px 48px',
        
        // Line height options
        lineheight_formats: '1 1.2 1.4 1.6 1.8 2 2.5 3',
        
        // RTL content styling
        content_style: `
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Tajawal:wght@400;500;700&family=Cairo:wght@400;500;600;700&display=swap');
          body { 
            font-family: 'IBM Plex Sans Arabic', 'Tajawal', 'Cairo', sans-serif; 
            font-size: 16px; 
            line-height: 1.8;
            direction: rtl;
            text-align: right;
          }
          h1, h2, h3, h4 { font-weight: 700; margin: 1em 0 0.5em; }
          blockquote { 
            border-right: 4px solid #4a90d9; 
            border-left: none;
            padding-right: 1em; 
            margin-right: 0;
            background: #f8f9fa;
            font-style: italic;
          }
          table { direction: rtl; }
          ul, ol { padding-right: 2em; padding-left: 0; }
        `,
        
        // Enable paste from Word
        paste_as_text: false,
        powerpaste_word_import: 'clean',
        powerpaste_html_import: 'clean',
        
        // Spellchecker for Arabic
        spellchecker_language: 'ar',
      },
    },
  },
});

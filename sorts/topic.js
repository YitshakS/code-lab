window.TOPIC = {
  extraFiles: ['index.html'],

  buildPreview: function(files, getEditorValue, sharedStyles) {
    const bodyContent = extractBody(files['index.html']);
    preview.srcdoc = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${sharedStyles}</style>
  <style>${files['styles.css']}</style>
</head>
<body>
${bodyContent}
<script>${files['scripts.js']}<\/script>
</body>
</html>`;
  }
};

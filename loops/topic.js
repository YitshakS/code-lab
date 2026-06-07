window.TOPIC = {
  extraFiles: ['restore.js'],

  getIframeState: function() {
    try {
      const doc = preview.contentDocument;
      if (!doc || !doc.getElementById('shape-select')) return null;
      const sel = id => doc.getElementById(id);
      return {
        shape:     sel('shape-select').value,
        rows:      sel('rows-input').value,
        cols:      sel('cols-input').value,
        style:     sel('style-toggle').checked,
        thickness: sel('thickness-input').value,
        cellSize:  sel('cell-size-slider').value,
        darkMode:  sel('mode-toggle').checked,
        border:    sel('border-toggle').checked,
        emoji:     preview.contentWindow.emoji || '⭐',
      };
    } catch(e) { return null; }
  },

  buildPreview: function(files, getEditorValue, sharedStyles) {
    const state = window.TOPIC.getIframeState();
    const bodyContent = extractBody(files['index.html']);

    let restoreScript;
    if (state && state.shape) {
      restoreScript = `<script>restoreState(${JSON.stringify(state)});updateControls();drawShape();<\/script>`;
    } else {
      restoreScript = `<script>updateControls();drawShape();<\/script>`;
    }

    preview.srcdoc = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${sharedStyles}</style>
  <style>${files['style.css']}</style>
</head>
<body>
${bodyContent}
<script>${files['restore.js']}<\/script>
<script>${getEditorValue('emojis.js')}<\/script>
<script>${getEditorValue('shapes.js')}<\/script>
<script>${files['script.js']}<\/script>
${restoreScript}
</body>
</html>`;
  }
};

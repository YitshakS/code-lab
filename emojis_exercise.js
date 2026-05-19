function isColorfulEmoji(char) {
  const cp = char.codePointAt(0);
  return (/\p{Emoji_Presentation}/u.test(char) || /\p{Emoji_Modifier_Base}/u.test(char)) &&
    !/\p{Regional_Indicator}/u.test(char) &&
    !/\p{Emoji_Modifier}/u.test(char) &&
    ![0x1F6D8, 0x1FA8A, 0x1FA8E, 0x1FAC8, 0x1FACD, 0x1FAEA, 0x1FAEF].includes(cp);
}

function addEmojiToPicker(char) {
  const span = document.createElement('span');
  span.textContent = char;
  span.classList.add('emoji-item');
  span.addEventListener('click', () => {
    emoji = char;
    emojiBtn.textContent = char;
    pickerOverlay.classList.remove('open');
    drawShape();
  });
  emojiGrid.appendChild(span);
}

function fillEmojiPicker() {
  let count = 0;

  // כתוב כאן לולאה שעוברת על כל הטווח מ-0x231A עד 0x1FAFA
  // לכל תו שעובר את isColorfulEmoji, קרא ל-addEmojiToPicker והגדל את count


  document.getElementById('emoji-grid').insertAdjacentHTML('beforeend',
    '<div style="width:100%;padding:4px 0;font-size:0.85em;color:#888;text-align:center;border-top:1px solid #ccc;margin:4px 0;flex-basis:100%">סה"כ צבעוניים: ' + count + '</div>'
  );
}

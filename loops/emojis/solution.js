function isColorfulEmoji(char) {
  const cp = char.codePointAt(0);
  return (/\p{Emoji_Modifier_Base}/u.test(char) || /\p{Emoji_Presentation}/u.test(char)) &&
    !/\p{Emoji_Modifier}/u.test(char) &&
    !/\p{Regional_Indicator}/u.test(char) &&
    ![0x1F6D8, 0x1FA8A, 0x1FA8E, 0x1FAC8, 0x1FACD, 0x1FAEA, 0x1FAEF].includes(cp);
}

function supportsSkinTone(char) {
  const cp = char.codePointAt(0);
  return /\p{Emoji_Modifier_Base}/u.test(char) &&
    ![0x1F46A, 0x1F46F, 0x1F93C].includes(cp);
}

function addEmojiToPicker(char, fragment) {
  const span = document.createElement('span');
  span.textContent = char;
  span.classList.add('emoji-item');
  fragment.appendChild(span);
}

function fillEmojiPicker() {
  const fragment = new DocumentFragment();
  for (let i = 0x231A; i <= 0x1FAFA; i++) {
    const char = String.fromCodePoint(i);
    if (isColorfulEmoji(char)) {
      addEmojiToPicker(char, fragment);
      if (supportsSkinTone(char)) {
        for (let t = 0x1F3FB; t <= 0x1F3FF; t++) {
          addEmojiToPicker(char + String.fromCodePoint(t), fragment);
        }
      }
    }
  }
  emojiGrid.appendChild(fragment); // שליחת טבלת האמוג'ים לדף
}

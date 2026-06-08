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
  const fragment = new DocumentFragment(); // יצירת קונטיינר שיכול להכיל אמוג'ים

  const num = 0x1F44D; // המספר 128077 בבסיס הקסדצימלי
  const char = String.fromCodePoint(num); // Unicode המרת המספר לתו
  if (isColorfulEmoji(char)) // אם התו הוא אמוג'י צבעוני
  {
    addEmojiToPicker(char, fragment); // הוספתו לקונטיינר
    if (supportsSkinTone(char)) // אם האמוג'י תומך גוונים
      addEmojiToPicker(char + String.fromCodePoint(0x1F3FB), fragment); // הוספת האמוג'י + גוון לקונטיינר
  }

  emojiGrid.appendChild(fragment); // הוספת הקונטיינר לדף
}

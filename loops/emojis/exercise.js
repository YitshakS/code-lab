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
  // דוגמא להוספת אמוג'י של כוכב לטבלת בחירת האמוג'ים
  // עליך לעדכן את הקוד כך שיכניס את כל האמוג'ים שבין
  // 0x231A
  // ל
  // 0x1FAFA
  // כולל, לטבלת האמוג'ים

  const num = 0x2B50; // המספר 11088 בבסיס הקסדצימלי
  const char = String.fromCodePoint(num); // Unicode המרת המספר לתו
  if (isColorfulEmoji(char)) // אם התו הוא אמוג'י צבעוני
    addEmojiToPicker(char); // הוספתו לטבלת האמוג'ים
}

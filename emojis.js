function fillPicker() {
  let count = 0;
  for (let i = 0x231A; i <= 0x1FAFA; i++) {
    const char = String.fromCodePoint(i);
    const cp = char.codePointAt(0);
    if ((/\p{Emoji_Presentation}/u.test(char) || /\p{Emoji_Modifier_Base}/u.test(char)) &&
        !/\p{Regional_Indicator}/u.test(char) && !/\p{Emoji_Modifier}/u.test(char) &&
        ![0x1F6D8, 0x1FA8A, 0x1FA8E, 0x1FAC8, 0x1FACD, 0x1FAEA, 0x1FAEF].includes(cp)) {
      addEmoji(char);
      count++;
    }
  }
  document.getElementById('emoji-grid').insertAdjacentHTML('beforeend',
    '<div style="width:100%;padding:4px 0;font-size:0.85em;color:#888;text-align:center;border-top:1px solid #ccc;margin:4px 0;flex-basis:100%">סה"כ צבעוניים: ' + count + '</div>'
  );

}

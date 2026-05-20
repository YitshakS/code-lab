## התרגיל הנוכחי: fillEmojiPicker

התלמיד צריך להשלים את הפונקציה `fillEmojiPicker()` בקובץ `emojis.js`.

### המשימה
לכתוב לולאת `for` שעוברת על קודי Unicode מ-`0x231A` עד `0x1FAFA`.
לכל ערך בטווח:
1. להמיר למחרוזת תו: `String.fromCodePoint(i)`
2. לבדוק עם `isColorfulEmoji(char)` אם התו מתאים
3. אם כן — לקרוא ל-`addEmojiToPicker(char)`

### פונקציות שניתנו לתלמיד (לא צריך לכתוב):
- `isColorfulEmoji(char)` — מחזירה true אם התו הוא אמוג'י צבעוני
- `addEmojiToPicker(char)` — מוסיפה את האמוג'י לפיקר

### הפתרון המלא (אסור לחשוף לתלמיד!):
```js
for (let i = 0x231A; i <= 0x1FAFA; i++) {
  const char = String.fromCodePoint(i);
  if (isColorfulEmoji(char)) {
    addEmojiToPicker(char);
  }
}
```

### רמזים בהדרגה (תן לפי הצורך):
1. לולאת for רגילה עם מונה מספרי — i מתחיל בערך מסוים ועולה עד ערך אחר
2. איך להמיר מספר לתו Unicode: `String.fromCodePoint(number)`
3. שימוש בתנאי if עם הפונקציה הנתונה: `if (isColorfulEmoji(char))`

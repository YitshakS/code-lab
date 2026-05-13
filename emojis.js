function fillPicker() {
  for (let i = 0x1F600; i <= 0x1F64F; i++) addEmoji(String.fromCodePoint(i)); // faces & emotions
  for (let i = 0x1F300; i <= 0x1F5FF; i++) addEmoji(String.fromCodePoint(i)); // nature, weather & objects
  for (let i = 0x1F680; i <= 0x1F6FF; i++) addEmoji(String.fromCodePoint(i)); // travel & transport
  for (let i = 0x1F900; i <= 0x1F9FF; i++) addEmoji(String.fromCodePoint(i)); // people & fantasy
  for (let i = 0x2600;  i <= 0x26FF;  i++) addEmoji(String.fromCodePoint(i)); // symbols & signs
  for (let i = 0x2700;  i <= 0x27BF;  i++) addEmoji(String.fromCodePoint(i)); // dingbats
}

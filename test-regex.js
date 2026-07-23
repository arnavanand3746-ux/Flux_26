const urls = [
  "https://www.youtube.com/live/dQw4w9WgXcQ?si=...",
  "https://youtu.be/dQw4w9WgXcQ",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
];
urls.forEach(url => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  console.log(match ? match[1] : null);
})

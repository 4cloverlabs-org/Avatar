fetch('http://localhost:3000/api/avatars/test-123/build', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log("Response:", data))
  .catch(console.error);

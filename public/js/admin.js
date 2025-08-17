document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();
    const tbody = document.getElementById('bookings-body');
    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${b.name}</td><td>${b.email}</td><td>${b.service}</td>` +
                     `<td>${b.date}</td><td>${b.time}</td><td>${b.message || ''}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
});

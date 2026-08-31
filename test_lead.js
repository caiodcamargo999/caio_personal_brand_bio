const data = {
  name: "Caio Teste Antigravity",
  email: "caio.test@example.com",
  whatsapp: "+5511988887777",
  instagram: "@caiotest",
  industry: "Marketing Digital",
  struggle: "Escalar com IA",
  budget: "yes",
  budgetAmount: "1000"
};

fetch('http://localhost:3000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json().then(json => ({ status: res.status, body: json })))
.then(result => {
  console.log(JSON.stringify(result, null, 2));
})
.catch(err => {
  console.error('Fetch error:', err);
});

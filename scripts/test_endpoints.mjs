async function testEndpoints() {
  try {
    const resHtml = await fetch('http://localhost:3000/politicians.html');
    console.log('politicians.html HTTP status:', resHtml.status);

    const resApi = await fetch('http://localhost:3000/api/politicians');
    console.log('api/politicians HTTP status:', resApi.status);
    const data = await resApi.json();
    console.log('Politicians count:', data.total);
    console.log('First politician:', data.politicians[0].name, '(', data.politicians[0].role, ')');
    console.log('Sample Senator:', data.politicians.find(p => p.category === 'senators')?.name);
    console.log('Sample Rep:', data.politicians.find(p => p.category === 'reps')?.name);
    console.log('Sample Minister:', data.politicians.find(p => p.category === 'ministers')?.name);
  } catch (err) {
    console.error('Test error:', err);
  }
}
testEndpoints();


console.log('=== Theme Toggle Debug ===');
console.log('1. HTML element:', document.documentElement);
console.log('2. Has dark class:', document.documentElement.classList.contains('dark'));
console.log('3. LocalStorage theme:', localStorage.getItem('theme'));
console.log('4. System prefers dark:', window.matchMedia('(prefers-color-scheme: dark)').matches);

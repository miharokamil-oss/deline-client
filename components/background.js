// Создаем структуру фона если её нет
if (!document.querySelector('.gradient-background')) {
    const bgDiv = document.createElement('div');
    bgDiv.className = 'gradient-background';
    bgDiv.innerHTML = `
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="grid-overlay"></div>
        <div class="noise-overlay"></div>
    `;
    document.body.insertBefore(bgDiv, document.body.firstChild);
}

document.addEventListener('mousemove', (e) => {
    const spheres = document.querySelectorAll('.gradient-sphere');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5;

    spheres.forEach(sphere => {
        sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Interactive Three.js Particle Constellation Background
(function() {
  let scene, camera, renderer, particles;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  init();
  animate();

  function init() {
    const canvas = document.getElementById('three-bg');
    if (!canvas) return;

    // Create scene and camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;

    // Create particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color palette matching the theme (indigo/violet hues)
    const colorChoices = [
      new THREE.Color(0x6366f1), // Electric Indigo
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0x10b981), // Emerald Neon
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random coordinates in space
      positions[i] = Math.random() * 800 - 400;
      positions[i + 1] = Math.random() * 800 - 400;
      positions[i + 2] = Math.random() * 800 - 400;

      // Assign random theme color
      const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a circular glowing canvas texture for particles
    const pMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, pMaterial);
    scene.add(particles);

    // Setup WebGL Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Mouse movement listener
    document.addEventListener('mousemove', onDocumentMouseMove);
    
    // Window resize listener
    window.addEventListener('resize', onWindowResize);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.15;
    mouseY = (event.clientY - windowHalfY) * 0.15;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Interpolate mouse movement for smooth parallax damping
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    if (particles) {
      // Base rotation
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;

      // Parallax shifts relative to mouse position
      particles.rotation.y += (targetX * 0.0005) * 0.05;
      particles.rotation.x += (targetY * 0.0005) * 0.05;
    }

    renderer.render(scene, camera);
  }
})();

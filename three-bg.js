// Interactive Three.js Floating Code Background
(function() {
  let scene, camera, renderer, codeGroup;
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

    // List of developer code snippets to float in the background
    const snippets = [
      'const', 'let', 'function', '=>', 'import', 'export', 'class', 'return',
      'async', 'await', 'Promise', 'git commit', 'git push', 'npm run dev',
      'npm install', 'docker run', 'pip install', 'SELECT * FROM', 'WHERE',
      'frappe.get_doc', 'console.log()', 'print()', '{"status": "ok"}', '[]', '{}',
      'GET /api/v1', '<div />', '<section>', 'useEffect', 'useState', 'undefined',
      'interface', 'extends', 'try { ... } catch', 'while(true)', 'Map<string, any>',
      'cargo build', 'kubernetes.yaml', 'req, res =>', 'db.connect()', 'process.env',
      'git clone', 'npm start', 'localhost:8000', 'new Promise()', 'res.json()',
      'pip3 install', 'python -m', 'virtualenv', 'go build', 'fn main()', 'System.out.println',
      'public static void', 'cout <<', '#include', 'ActiveRecord', 'db:migrate',
      'docker-compose up', 'kubectl apply', 'aws s3 sync', 'server.listen()',
      'document.getElementById', 'window.addEventListener', 'JSON.parse()',
      'localStorage', 'sessionStorage', 'Math.random()', 'new Map()', 'new Set()',
      'Object.keys()', 'Array.map()'
    ];

    // Color palette matching the theme (indigo, purple, emerald, cyan, blue, rose)
    const colorChoices = [
      '#6366f1', // Electric Indigo
      '#a855f7', // Purple
      '#10b981', // Emerald Neon
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
      '#f43f5e'  // Rose
    ];

    // Create a group to hold code sprites
    codeGroup = new THREE.Group();

    // Helper to generate text texture
    function createTextTexture(text, colorStr) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Monospace styling
      ctx.font = 'bold 36px "IBM Plex Mono", monospace';
      ctx.fillStyle = colorStr;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Subtle glow
      ctx.shadowColor = colorStr;
      ctx.shadowBlur = 10;

      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    // Generate sprites
    snippets.forEach((text) => {
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      const texture = createTextTexture(text, color);
      
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.15 + Math.random() * 0.35, // Subtle background presence
        blending: THREE.AdditiveBlending
      });

      const sprite = new THREE.Sprite(material);

      // Random position in 3D volume
      const x = Math.random() * 1400 - 700;
      const y = Math.random() * 900 - 450;
      const z = Math.random() * 800 - 600; // Range: -600 to 200 (camera is at 500)

      sprite.position.set(x, y, z);

      // Scale keeping 4:1 aspect ratio
      const sizeMultiplier = 0.5 + Math.random() * 0.7; // size variety
      const width = 80 * sizeMultiplier;
      const height = 20 * sizeMultiplier;
      sprite.scale.set(width, height, 1);

      // Store animation properties
      sprite.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: 0.2 + Math.random() * 0.5
      };

      codeGroup.add(sprite);
    });

    scene.add(codeGroup);

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

    if (codeGroup) {
      // Base slow rotation of the whole group
      codeGroup.rotation.y += 0.0002;
      codeGroup.rotation.x += 0.0001;

      // Parallax shifts relative to mouse position
      codeGroup.rotation.y += (targetX * 0.0003) * 0.05;
      codeGroup.rotation.x += (targetY * 0.0003) * 0.05;

      // Gentle wave-like drift for each individual floating element
      codeGroup.children.forEach(sprite => {
        const ud = sprite.userData;
        if (ud) {
          ud.phase += 0.004 * ud.driftSpeed;
          sprite.position.x = ud.baseX + Math.sin(ud.phase) * 25;
          sprite.position.y = ud.baseY + Math.cos(ud.phase * 0.8) * 25;
          sprite.position.z = ud.baseZ + Math.sin(ud.phase * 0.5) * 15;
        }
      });
    }

    renderer.render(scene, camera);
  }
})();

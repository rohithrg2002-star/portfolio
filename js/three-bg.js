/**
 * Subtle Background Canvas: Refactored Lightweight Three.js Background
 * - Reduced from 70 to 16 tags
 * - Restrained single-accent color
 * - Pauses automatically when tab is hidden
 * - Respects prefers-reduced-motion
 */

import { getActiveFeatureFlags } from '../data/content.js';

export function initThreeBackground() {
  const canvas = document.getElementById('hero-three-canvas');
  if (!canvas) return;

  // Check feature flag
  const flags = getActiveFeatureFlags();
  if (flags?.features && flags.features.threeBackground === false) {
    canvas.style.display = 'none';
    return;
  }

  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }


  // Ensure THREE is available before initializing
  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer, codeGroup;
  let animationFrameId = null;
  let isPaused = false;

  const snippets = [
    'frappe.get_doc', 'pypika.Query', 'kubectl apply', 'docker-compose up',
    'SELECT * FROM', 'go func()', 'Redis.get()', 'async / await',
    'k8s.StatefulSet', 'PostgreSQL', 'FastAPI', 'gRPC.proto',
    'git commit', 'React.useMemo', 'Prometheus', 'LSM-Tree'
  ];

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.z = 450;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    codeGroup = new THREE.Group();

    // Generate lightweight canvas text textures
    function createTextTexture(text) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 64;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.75)'; // Restrained accent color
      ctx.font = '500 22px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, c.width / 2, c.height / 2);

      const texture = new THREE.CanvasTexture(c);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    snippets.forEach((text, i) => {
      const material = new THREE.SpriteMaterial({
        map: createTextTexture(text),
        transparent: true,
        opacity: 0.55
      });

      const sprite = new THREE.Sprite(material);
      sprite.position.x = (Math.random() - 0.5) * 800;
      sprite.position.y = (Math.random() - 0.5) * 500;
      sprite.position.z = (Math.random() - 0.5) * 400;
      sprite.scale.set(130, 32, 1);

      sprite.userData = {
        baseY: sprite.position.y,
        speed: 0.15 + (i % 4) * 0.05,
        offset: Math.random() * Math.PI * 2
      };

      codeGroup.add(sprite);
    });

    scene.add(codeGroup);

    // Render loop with idle pause
    let clock = new THREE.Clock();

    function animate() {
      if (isPaused) return;

      const elapsed = clock.getElapsedTime();

      codeGroup.children.forEach(sprite => {
        sprite.position.y = sprite.userData.baseY + Math.sin(elapsed * sprite.userData.speed + sprite.userData.offset) * 15;
      });

      codeGroup.rotation.y = Math.sin(elapsed * 0.04) * 0.08;
      codeGroup.rotation.x = Math.cos(elapsed * 0.04) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Window resize handler
    const onWindowResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, { passive: true });

    // Page visibility listener: pause when tab is inactive to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isPaused = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        clock.start();
        animate();
      }
    });

  } catch (err) {
    console.warn('Three.js background initialization gracefully skipped:', err);
    canvas.style.display = 'none';
  }
}

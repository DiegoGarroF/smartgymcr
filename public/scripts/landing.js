// HERO 3D – Floating gym equipment shapes
(function(){
  const canvas = document.getElementById('canvas-bg');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 18;

  function resize(){
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dLight = new THREE.DirectionalLight(0xD2B89A, 1.2);
  dLight.position.set(5, 8, 5);
  scene.add(dLight);
  const dLight2 = new THREE.DirectionalLight(0x6688aa, 0.6);
  dLight2.position.set(-5, -3, 3);
  scene.add(dLight2);

  const matBeige = new THREE.MeshStandardMaterial({
    color: 0xD2B89A, metalness: 0.7, roughness: 0.2,
    transparent: true, opacity: 0.55
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: 0x2a2018, metalness: 0.8, roughness: 0.3,
    transparent: true, opacity: 0.65
  });
  const matLine = new THREE.MeshStandardMaterial({
    color: 0xD2B89A, metalness: 0.9, roughness: 0.1,
    transparent: true, opacity: 0.3, wireframe: true
  });

  const objects = [];

  function makeDumbbell(x,y,z,rot){
    const g = new THREE.Group();
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.6,12), matBeige);
    g.add(bar);
    [-1.2,1.2].forEach((ox) => {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,0.32,16), matBeige.clone());
      plate.position.x = ox;
      plate.rotation.z = Math.PI / 2;
      g.add(plate);
    });
    g.position.set(x,y,z);
    g.rotation.set(rot,rot * .7,rot * .3);
    scene.add(g);
    objects.push({m:g, baseX:x, baseY:y, speed:Math.random() * 0.3 + 0.15, phase:Math.random() * Math.PI * 2, rotSpeed:(Math.random() - .5) * 0.005});
  }

  function makeKettlebell(x,y,z){
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.6,16,16), matDark);
    g.add(body);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.38,0.06,8,20,Math.PI), matBeige);
    handle.position.y = 0.65;
    handle.rotation.z = Math.PI;
    g.add(handle);
    g.position.set(x,y,z);
    scene.add(g);
    objects.push({m:g, baseX:x, baseY:y, speed:Math.random() * 0.25 + 0.1, phase:Math.random() * Math.PI * 2, rotSpeed:(Math.random() - .5) * 0.004});
  }

  function makePlate(x,y,z,scale=1){
    const outer = new THREE.Mesh(new THREE.TorusGeometry(0.7 * scale,0.18 * scale,12,40), matBeige.clone());
    outer.position.set(x, y, z);
    outer.rotation.x = Math.random() * Math.PI;
    outer.rotation.y = Math.random() * Math.PI;
    scene.add(outer);
    objects.push({m:outer, baseX:x, baseY:y, speed:Math.random() * 0.35 + 0.2, phase:Math.random() * Math.PI * 2, rotSpeed:(Math.random() - .5) * 0.006});
  }

  function makeIco(x,y,z,scale=1){
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5 * scale,0), matLine.clone());
    ico.position.set(x,y,z);
    scene.add(ico);
    objects.push({m:ico, baseX:x, baseY:y, speed:Math.random() * 0.5 + 0.3, phase:Math.random() * Math.PI * 2, rotSpeed:(Math.random() - .5) * 0.012});
  }

  makeDumbbell(5, 1.5, -4, 0.5);
  makeDumbbell(7, -2, -6, 1.2);
  makeDumbbell(10, 3, -8, 0.3);
  makeDumbbell(4, -3.5, -5, 0.9);
  makeDumbbell(9, -0.5, -7, 1.5);
  makeKettlebell(6, 2, -5);
  makeKettlebell(8, -1.5, -7);
  makeKettlebell(3.5, 0.5, -3.5);
  makePlate(5.5, -2.5, -4, 1.0);
  makePlate(7.5, 1.5, -6, 0.8);
  makePlate(10, -2, -9, 1.2);
  makePlate(4, 3, -4, 0.7);
  makeIco(6, -0.5, -3.5, 1.0);
  makeIco(9, 2.5, -6, 1.3);
  makeIco(4.5, 1, -5, 0.8);
  makeIco(11, -1, -8, 1.1);

  let mx = 0;
  let my = 0;
  window.addEventListener('mousemove', (event) => {
    mx = (event.clientX / window.innerWidth - .5) * 2;
    my = (event.clientY / window.innerHeight - .5) * 2;
  });

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.01;
    objects.forEach((object) => {
      object.m.position.y = object.baseY + Math.sin(t * object.speed + object.phase) * 0.6;
      object.m.rotation.x += object.rotSpeed;
      object.m.rotation.y += object.rotSpeed * 1.3;
    });
    camera.position.x += (mx * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-my * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0,0,0);
    renderer.render(scene, camera);
  }
  animate();
})();

// MID PARALLAX – Particle field
(function(){
  const canvas = document.getElementById('canvas-mid');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60,1,0.1,1000);
  camera.position.z = 20;

  function resize(){
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w,h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize);

  const count = 800;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for(let i = 0; i < count; i += 1){
    positions[i * 3] = (Math.random() - .5) * 60;
    positions[i * 3 + 1] = (Math.random() - .5) * 20;
    positions[i * 3 + 2] = (Math.random() - .5) * 30;
    const tone = Math.random();
    colors[i * 3] = 0.82 + tone * .1;
    colors[i * 3 + 1] = 0.72 + tone * .05;
    colors[i * 3 + 2] = 0.60 + tone * .05;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors,3));
  const mat = new THREE.PointsMaterial({size:0.12, vertexColors:true, transparent:true, opacity:0.7});
  scene.add(new THREE.Points(geo, mat));

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.008;
    camera.rotation.z = Math.sin(t * .3) * 0.04;
    camera.position.x = Math.sin(t * .2) * 2;
    renderer.render(scene,camera);
  }
  animate();
})();

// CTA 3D – Orbiting rings
(function(){
  const canvas = document.getElementById('canvas-cta');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50,1,0.1,1000);
  camera.position.z = 18;

  function resize(){
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w,h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize',resize);

  scene.add(new THREE.AmbientLight(0xffffff,.4));
  const light = new THREE.PointLight(0xD2B89A, 2, 30);
  light.position.set(5,5,5);
  scene.add(light);

  const mat = new THREE.MeshStandardMaterial({
    color:0xD2B89A, metalness:.85, roughness:.15,
    transparent:true, opacity:.18
  });

  const rings = [];
  [[4,.3],[5.5,.5],[7,.2],[9,.4],[11,.15]].forEach(([radius,thickness]) => {
    const geo = new THREE.TorusGeometry(radius,0.04 + thickness * .1,12,80);
    const mesh = new THREE.Mesh(geo,mat.clone());
    mesh.rotation.x = (Math.random() - .5) * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    scene.add(mesh);
    rings.push({m:mesh, rx:(Math.random() - .5) * 0.005, ry:(Math.random() - .5) * 0.008});
  });

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.2,32,32),
    new THREE.MeshStandardMaterial({color:0xD2B89A, metalness:.9, roughness:.05, transparent:true, opacity:.12})
  );
  scene.add(sphere);

  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.006;
    rings.forEach((ring) => {
      ring.m.rotation.x += ring.rx;
      ring.m.rotation.y += ring.ry;
    });
    light.position.x = Math.sin(t) * 8;
    light.position.y = Math.cos(t * .7) * 5;
    sphere.rotation.y += 0.005;
    renderer.render(scene,camera);
  }
  animate();
})();

const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.line-inner', {
    y:'0%', duration:1, ease:'power3.out',
    stagger:0.1, delay:0.2
  });
  gsap.to(['#hbadge','#hsub','#hbtns','#hpills','#scroll-hint'], {
    opacity:1, y:0, duration:.9, ease:'power2.out',
    stagger:0.12, delay:0.5
  });
}

window.addEventListener('scroll',() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
reveals.forEach((element,index) => {
  element.style.transitionDelay = `${(index % 4) * .08}s`;
  revealObserver.observe(element);
});

const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(!entry.isIntersecting || !hasGsap) return;
    const element = entry.target;
    const target = Number(element.dataset.target || 0);
    const suffix = target === 70 ? '%' : target === 24 ? '/7' : '';
    gsap.to({val:0},{
      val:target, duration:2, ease:'power2.out',
      onUpdate:function(){
        element.textContent = `${Math.round(this.targets()[0].val)}${suffix}`;
      }
    });
    counterObserver.unobserve(element);
  });
},{threshold:0.5});
counters.forEach((counter) => counterObserver.observe(counter));

(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroWorkout = document.getElementById('hero-workout');
  const repCount = document.getElementById('rep-count');
  const repBars = document.querySelectorAll('.rep-bar-fill');
  const chipValues = document.querySelectorAll('.chip-value');
  const statItems = document.querySelectorAll('.stat-item');
  const statFills = document.querySelectorAll('.stat-track-fill');
  const modCards = document.querySelectorAll('.mod-card');
  const flowWrap = document.querySelector('.flow-wrap');
  const heartPath = document.getElementById('heart-path');

  function applyStaticValues(){
    if(heroWorkout) heroWorkout.style.opacity = '1';
    if(repCount) repCount.textContent = '12';
    repBars.forEach((bar) => {
      bar.style.transform = `scaleY(${Number(bar.dataset.level || 20) / 100})`;
    });
    chipValues.forEach((element) => {
      element.textContent = `${element.dataset.target || '0'}${element.dataset.suffix || ''}`;
    });
    statFills.forEach((fill) => {
      fill.style.width = `${fill.dataset.progress || 0}%`;
    });
    if(heartPath){
      heartPath.style.strokeDasharray = 'none';
      heartPath.style.strokeDashoffset = '0';
    }
  }

  if(typeof anime === 'undefined' || reduceMotion){
    applyStaticValues();
    return;
  }

  anime({
    targets:'#hero-workout',
    translateX:[56,0],
    opacity:[0,1],
    scale:[0.96,1],
    duration:1200,
    delay:600,
    easing:'easeOutExpo'
  });

  anime({
    targets:'.hero-workout .workout-panel, .hero-workout .workout-heart',
    translateY:[20,0],
    opacity:[0,1],
    delay:anime.stagger(130,{start:820}),
    duration:850,
    easing:'easeOutExpo'
  });

  if(repCount){
    const repState = { value: 8 };
    anime({
      targets:repState,
      value:18,
      round:1,
      direction:'alternate',
      duration:1800,
      loop:true,
      easing:'easeInOutSine',
      update:() => { repCount.textContent = String(repState.value); }
    });
  }

  anime({
    targets:'.rep-bar-fill',
    keyframes:[
      { scaleY:(element) => Number(element.dataset.level || 70) / 100, duration:900, easing:'easeOutBack' },
      { scaleY:(element) => Number(element.dataset.rest || 20) / 100, duration:850, easing:'easeInOutSine' }
    ],
    delay:anime.stagger(140),
    loop:true
  });

  anime({
    targets:'.weight-side.left .weight-plate',
    translateY:[0,-10,0],
    rotate:[0,-7,0],
    delay:anime.stagger(80),
    duration:1450,
    easing:'easeInOutSine',
    loop:true
  });

  anime({
    targets:'.weight-side.right .weight-plate',
    translateY:[0,-10,0],
    rotate:[0,7,0],
    delay:anime.stagger(80),
    duration:1450,
    easing:'easeInOutSine',
    loop:true
  });

  anime({
    targets:'.barbell-core',
    scaleX:[0.96,1.03,0.96],
    duration:1600,
    easing:'easeInOutSine',
    loop:true
  });

  anime({
    targets:'.hero-workout .workout-chip',
    translateY:[12,0],
    opacity:[0,1],
    delay:anime.stagger(110,{start:1020}),
    duration:650,
    easing:'easeOutQuad'
  });

  chipValues.forEach((element,index) => {
    const metric = { value: 0 };
    anime({
      targets:metric,
      value:Number(element.dataset.target || 0),
      round:1,
      duration:1400,
      delay:980 + index * 140,
      easing:'easeOutExpo',
      update:() => { element.textContent = `${metric.value}${element.dataset.suffix || ''}`; }
    });
  });

  if(heartPath){
    const pathLength = heartPath.getTotalLength();
    heartPath.style.strokeDasharray = String(pathLength);
    heartPath.style.strokeDashoffset = String(pathLength);
    anime({
      targets:heartPath,
      strokeDashoffset:[pathLength,0],
      duration:2100,
      direction:'alternate',
      loop:true,
      easing:'easeInOutSine'
    });
  }

  anime({
    targets:'.heart-glow, .live-dot',
    opacity:[0.25,0.95],
    scale:[0.92,1.08],
    direction:'alternate',
    duration:850,
    loop:true,
    easing:'easeInOutSine'
  });

  anime.set(statItems,{opacity:0,translateY:22});
  const statMotionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      const item = entry.target;
      const fill = item.querySelector('.stat-track-fill');
      const itemIndex = Array.from(statItems).indexOf(item);
      anime({
        targets:item,
        opacity:[0,1],
        translateY:[22,0],
        duration:650,
        delay:itemIndex * 110,
        easing:'easeOutExpo'
      });
      if(fill){
        anime({
          targets:fill,
          width:`${fill.dataset.progress || 0}%`,
          duration:1200,
          delay:140 + itemIndex * 110,
          easing:'easeOutExpo'
        });
      }
      statMotionObserver.unobserve(item);
    });
  },{threshold:0.35});
  statItems.forEach((item) => statMotionObserver.observe(item));

  const modObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting) return;
      const icon = entry.target.querySelector('.mod-ico');
      if(icon){
        anime({
          targets:icon,
          translateY:[18,0],
          rotate:[-14,0],
          scale:[0.7,1],
          duration:820,
          easing:'easeOutElastic(1, .7)'
        });
      }
      modObserver.unobserve(entry.target);
    });
  },{threshold:0.22});
  modCards.forEach((card) => {
    modObserver.observe(card);
    const icon = card.querySelector('.mod-ico');
    card.addEventListener('mouseenter',() => {
      if(!icon) return;
      anime.remove(icon);
      anime({
        targets:icon,
        translateY:[0,-8,0],
        rotate:[0,-8,8,0],
        duration:700,
        easing:'easeOutElastic(1, .75)'
      });
    });
  });

  if(flowWrap){
    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(!entry.isIntersecting) return;
        anime({
          targets:'.flow-node',
          keyframes:[
            { translateX:0, scale:1, duration:0 },
            { translateX:10, scale:1.015, duration:540 },
            { translateX:0, scale:1, duration:540 }
          ],
          delay:anime.stagger(220),
          easing:'easeInOutSine',
          loop:true
        });
        flowObserver.unobserve(entry.target);
      });
    },{threshold:0.35});
    flowObserver.observe(flowWrap);
  }
})();

if (hasGsap) {
  document.querySelectorAll('.mod-card,.plan-card,.testi-card').forEach((card) => {
    card.addEventListener('mousemove',(event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to(card,{
        rotateY:x * 5, rotateX:-y * 5, duration:.4, ease:'power2.out',
        transformPerspective:600
      });
    });
    card.addEventListener('mouseleave',() => {
      gsap.to(card,{rotateY:0, rotateX:0, duration:.5, ease:'elastic.out(1,.5)'});
    });
  });
}

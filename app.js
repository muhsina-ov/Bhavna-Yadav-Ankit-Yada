/* ==========================================================================
   BHAVANA & ANKIT WEDDING INVITATION — INTERACTIVE ENGINE
   Pink & Grey Luxury Theme • Lotus Flower Timeline Scrolling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. WAX SEAL ROYALE OPENING & AUDIO ORCHESTRATION
     ------------------------------------------------------------------------ */
  const overlay    = document.getElementById('weiOverlay');
  const videoWrap  = document.getElementById('weiVideoWrap');
  const video      = document.getElementById('weiVideo');
  const audio      = document.getElementById('weiAudio');
  const audioBtn   = document.getElementById('weiAudioBtn');
  const iconPause  = document.getElementById('weiIconPause');
  const iconPlay   = document.getElementById('weiIconPlay');

  let sequenceStarted = false;
  let sequenceEnded   = false;
  let fallbackTimer   = null;

  function updateAudioButtonState(isPlaying) {
    if (iconPlay && iconPause) {
      if (isPlaying) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    }
  }

  function playAudioSafely() {
    if (!audio) return;
    audio.muted = false;
    audio.volume = 1;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateAudioButtonState(true);
      }).catch(() => {
        updateAudioButtonState(false);
        const unlockAudio = () => {
          if (audio.paused) {
            audio.play().then(() => updateAudioButtonState(true)).catch(() => {});
          }
          ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
            document.removeEventListener(evt, unlockAudio);
          });
        };
        ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
          document.addEventListener(evt, unlockAudio, { passive: true, once: true });
        });
      });
    }
  }

  if (audio) {
    audio.addEventListener('play', () => updateAudioButtonState(true));
    audio.addEventListener('pause', () => updateAudioButtonState(false));
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play();
        updateAudioButtonState(true);
      } else {
        audio.pause();
        updateAudioButtonState(false);
      }
    });
  }

  // Mobile video readiness
  if (video) {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
  }

  function startInvitationSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    // Trigger music immediately in user gesture stack
    playAudioSafely();

    // Lock page during reveal
    document.body.classList.add('video-active', 'envelope-active');

    // Play unveiling video
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      const vp = video.play();
      if (vp && vp.catch) {
        vp.catch(() => {
          setTimeout(endInvitationSequence, 1500);
        });
      }
    }

    // Cross-fade envelope
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => { overlay.style.display = 'none'; }, 800);
    }

    if (videoWrap) {
      videoWrap.classList.add('wei-video-in');
    }

    // Fallback timer
    fallbackTimer = setTimeout(endInvitationSequence, 6500);
  }

  function endInvitationSequence() {
    if (sequenceEnded) return;
    sequenceEnded = true;

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (videoWrap) {
      videoWrap.classList.remove('wei-video-in');
      videoWrap.classList.add('wei-video-out');
      setTimeout(() => {
        videoWrap.style.display = 'none';
        if (video) video.pause();
      }, 1200);
    }

    document.body.classList.remove('envelope-active', 'video-active');

    if (audioBtn) {
      audioBtn.style.visibility = 'visible';
      audioBtn.style.opacity = '1';
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startInvitationSequence);
    overlay.addEventListener('touchstart', startInvitationSequence, { passive: true });
  }

  if (video) {
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.7) {
        endInvitationSequence();
      }
    });
    video.addEventListener('ended', endInvitationSequence);
  }


  /* ------------------------------------------------------------------------
     2. AMBIENT BLUSH PINK & PEARL DUST CANVAS PARTICLES
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width  = canvas.width  = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: Math.random() * 0.45 + 0.25,
        opacity: Math.random() * 0.55 + 0.2,
        color: Math.random() > 0.4 ? 'rgba(212, 130, 150, ' : 'rgba(235, 183, 196, '
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(212, 130, 150, 0.4)';
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }


  /* ------------------------------------------------------------------------
     3. INTERACTIVE SCRATCH-TO-REVEAL DATE CARD (Pink & Silver Foil)
     ------------------------------------------------------------------------ */
  const scratchContainer = document.getElementById('scratch-date-container');
  const scratchCanvas    = document.getElementById('scratch-canvas');
  const scratchHint      = document.getElementById('scratch-hint');

  if (scratchCanvas && scratchContainer) {
    const ctx = scratchCanvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    let strokesCount = 0;

    const dpr = window.devicePixelRatio || 1;
    const width = 250;
    const height = 68;

    scratchCanvas.width = width * dpr;
    scratchCanvas.height = height * dpr;
    scratchCanvas.style.width = width + 'px';
    scratchCanvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    function initFoil() {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#EBB7C4');
      grad.addColorStop(0.25, '#D48296');
      grad.addColorStop(0.5, '#FFF0F3');
      grad.addColorStop(0.75, '#C27285');
      grad.addColorStop(1, '#9E9197');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 36; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.65)' : 'rgba(140, 61, 82, 0.25)';
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5 + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(255, 240, 245, 0.75)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(4, 4, width - 8, height - 8);

      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(90, 77, 83, 0.9)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 2;
      ctx.fillText('✦ SCRATCH TO REVEAL DATE ✦', width / 2, height / 2);
      ctx.shadowColor = 'transparent';
    }

    initFoil();

    function getPointerPos(e) {
      const b = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - b.left, y: clientY - b.top };
    }

    function scratch(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fill();

      strokesCount++;
      if (strokesCount % 8 === 0) {
        checkClearedPercent();
      }
    }

    function checkClearedPercent() {
      if (isRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imgData.data;
        let transparentPixels = 0;
        const step = 32;
        let totalSampled = 0;

        for (let i = 3; i < pixels.length; i += 4 * step) {
          totalSampled++;
          if (pixels[i] === 0) transparentPixels++;
        }

        if (transparentPixels / totalSampled > 0.35) {
          revealComplete();
        }
      } catch (err) {}
    }

    function revealComplete() {
      if (isRevealed) return;
      isRevealed = true;
      scratchCanvas.style.opacity = '0';
      scratchCanvas.style.pointerEvents = 'none';
      if (scratchHint) {
        scratchHint.innerHTML = '<span class="scratch-hint-pill"><i class="fa-solid fa-heart" style="color:#D48296;"></i> Auspicious Day • Thursday, 26 Nov 2026</span>';
      }
      setTimeout(() => { scratchCanvas.style.display = 'none'; }, 600);
    }

    scratchCanvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const pos = getPointerPos(e);
      scratch(pos.x, pos.y);
    });

    window.addEventListener('pointerup', () => {
      if (isDrawing) {
        isDrawing = false;
        checkClearedPercent();
      }
    });
  }


  /* ------------------------------------------------------------------------
     4. REAL-TIME LIVE WEDDING COUNTDOWN TIMER
     Target: 26th November 2026, 11:00 AM IST (+05:30)
     ------------------------------------------------------------------------ */
  const targetWeddingDate = new Date(2026, 10, 26, 11, 0, 0).getTime();
  const elDays  = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMins  = document.getElementById('minutes');
  const elSecs  = document.getElementById('seconds');
  const prevVals = { d: null, h: null, m: null, s: null };

  function flip(el, newVal) {
    if (!el || el.textContent === newVal) return;
    el.classList.add('flip-out');
    setTimeout(() => {
      el.classList.remove('flip-out');
      el.classList.add('flip-in');
      el.textContent = newVal;
      el.offsetHeight;
      el.classList.remove('flip-in');
    }, 280);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetWeddingDate - now;

    if (diff <= 0) {
      const container = document.getElementById('countdownContainer');
      if (container) {
        container.innerHTML = '<div style="font-family:\'Cormorant Garamond\',serif; font-size:24px; color:#8C3D52; font-weight:700;">See you there On behalf of<br><span style="font-size:18px;font-style:italic;color:#6C513F;">MR. Ram Sanjivan Yadav &amp; MRS. Rani Yadav</span></div>';
      }
      return;
    }

    const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
    const h = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');

    if (d !== prevVals.d) { flip(elDays, d); prevVals.d = d; }
    if (h !== prevVals.h) { flip(elHours, h); prevVals.h = h; }
    if (m !== prevVals.m) { flip(elMins, m); prevVals.m = m; }
    if (s !== prevVals.s) { flip(elSecs, s); prevVals.s = s; }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ------------------------------------------------------------------------
     5. INTERACTIVE ROSE PETALS & BLESSINGS SHOWER
     ------------------------------------------------------------------------ */
  const showerBtn = document.getElementById('btn-shower-blessings');
  const blessingCountElem = document.getElementById('blessing-count');
  const coupleContainer = document.querySelector('.couple-single-photo-wrap');

  let blessingCount = parseInt(localStorage.getItem('bhavana_ankit_blessings') || localStorage.getItem('bhavna_ankit_blessings') || localStorage.getItem('bhavya_sanyam_blessings') || '452', 10);
  if (blessingCountElem) {
    blessingCountElem.textContent = blessingCount.toLocaleString();
  }

  function triggerPetalShower(e) {
    blessingCount++;
    if (blessingCountElem) {
      blessingCountElem.textContent = blessingCount.toLocaleString();
    }
    localStorage.setItem('bhavana_ankit_blessings', blessingCount.toString());

    if (showerBtn) {
      showerBtn.style.transform = 'scale(0.96)';
      setTimeout(() => { showerBtn.style.transform = ''; }, 200);
    }

    // Spawn upward floating emojis
    const emojis = ['💖', '🌸', '✨', '🌹', '🕊️', '🤍', '💫', '💐'];
    const emojiCount = 10;
    const coupleRect = coupleContainer ? coupleContainer.getBoundingClientRect() : null;

    for (let j = 0; j < emojiCount; j++) {
      const emojiEl = document.createElement('div');
      emojiEl.className = 'floating-blessing-emoji';
      emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      let originX = window.innerWidth / 2;
      let originY = window.innerHeight * 0.65;

      if (coupleRect) {
        originX = coupleRect.left + Math.random() * coupleRect.width;
        originY = coupleRect.top + window.scrollY + Math.random() * (coupleRect.height * 0.7);
      }

      emojiEl.style.left = `${originX}px`;
      emojiEl.style.top = `${originY}px`;
      emojiEl.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 140}px`);
      emojiEl.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);

      document.body.appendChild(emojiEl);
      setTimeout(() => emojiEl.remove(), 2800);
    }

    // Spawn falling flower petals in soft pink & grey palette
    const petalColors = ['#D48296', '#EBB7C4', '#F4D6DE', '#C27285', '#FFFDF9', '#E8A598', '#D8CFD3'];
    const count = 34;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'falling-petal';

      const isCircle = Math.random() > 0.6;
      const size = Math.floor(Math.random() * 16) + 12;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const startX = Math.random() * window.innerWidth;
      const driftX = (Math.random() - 0.5) * 240 + 'px';
      const duration = (Math.random() * 2.5 + 2.8) + 's';
      const rot = (Math.random() * 720 - 360) + 'deg';

      petal.style.left = `${startX}px`;
      petal.style.top = '-20px';
      petal.style.width = `${size}px`;
      petal.style.height = `${isCircle ? size : size * 1.5}px`;
      petal.style.backgroundColor = color;
      petal.style.borderRadius = isCircle ? '50%' : '50% 0 50% 50%';
      petal.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.12)';
      petal.style.setProperty('--drift-x', driftX);
      petal.style.setProperty('--rot', rot);
      petal.style.animationDuration = duration;

      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 5500);
    }
  }

  if (showerBtn) showerBtn.addEventListener('click', triggerPetalShower);


  /* ------------------------------------------------------------------------
     6. MOVABLE ROSE / LOTUS FLOWER TIMELINE ENGINE (DUAL LOTUS FOR 2 DATES)
     (Smooth scroll-driven movement, click-to-glide, and touch/drag interactions)
     ------------------------------------------------------------------------ */
  const timelineContainer = document.getElementById('lotusTimeline');
  const scrollingLotus1   = document.getElementById('scrollingLotus1');
  const scrollingLotus2   = document.getElementById('scrollingLotus2');
  const fallbackLotus     = document.getElementById('scrollingLotus');
  const eventRows         = document.querySelectorAll('.lotus-event-row');

  if (timelineContainer && ((scrollingLotus1 && scrollingLotus2) || fallbackLotus) && eventRows.length > 0) {
    let ticking = false;

    function getNodeCenterY(node) {
      if (!node) return 0;
      const nodeRect = node.getBoundingClientRect();
      const contRect = timelineContainer.getBoundingClientRect();
      return (nodeRect.top + nodeRect.height / 2) - contRect.top;
    }

    const day1Rows = Array.from(document.querySelectorAll('.lotus-event-row:not(.event-date-26)'));
    const day2Rows = Array.from(document.querySelectorAll('.lotus-event-row.event-date-26'));

    function updateTrackLines() {
      const track1 = document.getElementById('timelineTrackLine1');
      const track2 = document.getElementById('timelineTrackLine2');

      if (!track1 && !track2) return;

      const day1Nodes = document.querySelectorAll('.lotus-event-row:not(.event-date-26) .event-timeline-node');
      const day2Nodes = document.querySelectorAll('.lotus-event-row.event-date-26 .event-timeline-node');

      if (track1 && day1Nodes.length > 0) {
        const top1 = getNodeCenterY(day1Nodes[0]);
        const bot1 = getNodeCenterY(day1Nodes[day1Nodes.length - 1]);
        track1.style.top = `${top1}px`;
        track1.style.height = `${Math.max(0, bot1 - top1)}px`;
      }

      if (track2 && day2Nodes.length > 0) {
        const top2 = getNodeCenterY(day2Nodes[0]);
        const bot2 = getNodeCenterY(day2Nodes[day2Nodes.length - 1]);
        track2.style.top = `${top2}px`;
        track2.style.height = `${Math.max(0, bot2 - top2)}px`;
      }
    }

    updateTrackLines();
    window.addEventListener('resize', updateTrackLines);
    window.addEventListener('load', updateTrackLines);

    // Track dragging states for both lotuses
    let isDraggingLotus1 = false;
    let dragStartY1 = 0;
    let lotusStartTop1 = 0;

    let isDraggingLotus2 = false;
    let dragStartY2 = 0;
    let lotusStartTop2 = 0;

    function updateLotusTrack(lotusEl, rows, targetProgress = null, smooth = false) {
      if (!lotusEl || rows.length === 0) return;

      const firstNode = rows[0].querySelector('.event-timeline-node');
      const lastNode  = rows[rows.length - 1].querySelector('.event-timeline-node');
      if (!firstNode || !lastNode) return;

      const topNodeY    = getNodeCenterY(firstNode);
      const bottomNodeY = getNodeCenterY(lastNode);
      const totalSpan   = bottomNodeY - topNodeY;

      let progress = 0;
      if (targetProgress !== null) {
        progress = Math.max(0, Math.min(1, targetProgress));
      } else {
        const windowHeight = window.innerHeight;
        const triggerY     = windowHeight * 0.52;
        const firstNodeScreenY = firstNode.getBoundingClientRect().top + firstNode.offsetHeight / 2;
        const lastNodeScreenY  = lastNode.getBoundingClientRect().top + lastNode.offsetHeight / 2;
        const screenSpan       = lastNodeScreenY - firstNodeScreenY;

        if (screenSpan > 0) {
          progress = (triggerY - firstNodeScreenY) / screenSpan;
        }
        progress = Math.max(0, Math.min(1, progress));
      }

      const currentY = topNodeY + progress * totalSpan;

      if (smooth) {
        lotusEl.style.transition = 'top 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
        setTimeout(() => {
          lotusEl.style.transition = '';
        }, 500);
      } else {
        lotusEl.style.transition = 'top 0.12s ease-out';
      }

      lotusEl.style.top = `${currentY}px`;

      // Activate rows in this day track
      let closestRow = null;
      let minDistance = Infinity;

      rows.forEach((row) => {
        const node = row.querySelector('.event-timeline-node');
        if (node) {
          const nodeY = getNodeCenterY(node);
          const dist = Math.abs(currentY - nodeY);

          if (dist < minDistance) {
            minDistance = dist;
            closestRow = row;
          }

          if (currentY >= nodeY - 20) {
            row.classList.add('active');
          } else {
            row.classList.remove('active');
          }
        }
      });

      if (closestRow && minDistance < 40) {
        rows.forEach(r => r.classList.remove('active-current'));
        closestRow.classList.add('active-current', 'active');
      }
    }

    function updateAllLotusPositions() {
      if (scrollingLotus1 && !isDraggingLotus1) {
        updateLotusTrack(scrollingLotus1, day1Rows);
      }
      if (scrollingLotus2 && !isDraggingLotus2) {
        updateLotusTrack(scrollingLotus2, day2Rows);
      }
      if (fallbackLotus && !isDraggingLotus1) {
        updateLotusTrack(fallbackLotus, Array.from(eventRows));
      }
    }

    function onScroll() {
      if (!ticking && !isDraggingLotus1 && !isDraggingLotus2) {
        requestAnimationFrame(() => {
          updateAllLotusPositions();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial positioning
    setTimeout(() => {
      updateTrackLines();
      updateAllLotusPositions();
    }, 250);

    // 1. Click/Tap on Any Event Row to Glide Respective Rose to that Event
    day1Rows.forEach((row, idx) => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        e.preventDefault();
        const total = day1Rows.length;
        const targetProgress = total > 1 ? idx / (total - 1) : 0;
        if (scrollingLotus1) {
          updateLotusTrack(scrollingLotus1, day1Rows, targetProgress, true);
        } else if (fallbackLotus) {
          updateLotusTrack(fallbackLotus, Array.from(eventRows), targetProgress, true);
        }
        day1Rows.forEach(r => r.classList.remove('active-current'));
        row.classList.add('active-current', 'active');
      });
    });

    day2Rows.forEach((row, idx) => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        e.preventDefault();
        const total = day2Rows.length;
        const targetProgress = total > 1 ? idx / (total - 1) : 0;
        if (scrollingLotus2) {
          updateLotusTrack(scrollingLotus2, day2Rows, targetProgress, true);
        } else if (fallbackLotus) {
          const overallIdx = day1Rows.length + idx;
          updateLotusTrack(fallbackLotus, Array.from(eventRows), overallIdx / (eventRows.length - 1), true);
        }
        day2Rows.forEach(r => r.classList.remove('active-current'));
        row.classList.add('active-current', 'active');
      });
    });

    // 2. Drag Setup Helper for a Lotus Element
    function setupLotusDrag(lotusEl, rows, getIsDragging, setIsDragging, getStartY, setStartY, getStartTop, setStartTop) {
      if (!lotusEl || rows.length === 0) return;

      lotusEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        lotusEl.classList.add('dragging');
        setStartY(e.clientY);
        setStartTop(parseFloat(lotusEl.style.top) || 0);
        lotusEl.setPointerCapture(e.pointerId);
      });

      window.addEventListener('pointermove', (e) => {
        if (!getIsDragging()) return;
        e.preventDefault();

        const firstNode = rows[0].querySelector('.event-timeline-node');
        const lastNode  = rows[rows.length - 1].querySelector('.event-timeline-node');
        if (!firstNode || !lastNode) return;

        const topNodeY    = getNodeCenterY(firstNode);
        const bottomNodeY = getNodeCenterY(lastNode);

        const deltaY = e.clientY - getStartY();
        let newTop = getStartTop() + deltaY;
        newTop = Math.max(topNodeY, Math.min(bottomNodeY, newTop));

        lotusEl.style.transition = 'none';
        lotusEl.style.top = `${newTop}px`;

        rows.forEach((row) => {
          const node = row.querySelector('.event-timeline-node');
          if (node) {
            const nodeY = getNodeCenterY(node);
            if (newTop >= nodeY - 20) {
              row.classList.add('active');
            } else {
              row.classList.remove('active');
            }
          }
        });
      });

      function endDrag() {
        if (!getIsDragging()) return;
        setIsDragging(false);
        lotusEl.classList.remove('dragging');
        lotusEl.style.transition = '';
      }

      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);
    }

    if (scrollingLotus1) {
      setupLotusDrag(
        scrollingLotus1,
        day1Rows,
        () => isDraggingLotus1,
        (val) => { isDraggingLotus1 = val; },
        () => dragStartY1,
        (val) => { dragStartY1 = val; },
        () => lotusStartTop1,
        (val) => { lotusStartTop1 = val; }
      );
    }

    if (scrollingLotus2) {
      setupLotusDrag(
        scrollingLotus2,
        day2Rows,
        () => isDraggingLotus2,
        (val) => { isDraggingLotus2 = val; },
        () => dragStartY2,
        (val) => { dragStartY2 = val; },
        () => lotusStartTop2,
        (val) => { lotusStartTop2 = val; }
      );
    }

    if (fallbackLotus) {
      setupLotusDrag(
        fallbackLotus,
        Array.from(eventRows),
        () => isDraggingLotus1,
        (val) => { isDraggingLotus1 = val; },
        () => dragStartY1,
        (val) => { dragStartY1 = val; },
        () => lotusStartTop1,
        (val) => { lotusStartTop1 = val; }
      );
    }
  }

});

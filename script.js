// script.js

// Document-level download prevention
const downloadPrevention = {
  init() {
    this.preventImageSaving();
    this.preventDragDrop();
    this.preventKeyboardShortcuts();
    this.preventCopyPaste();
  },
  
  preventImageSaving() {
    // Disable right-click on images
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item')) {
        e.preventDefault();
        return false;
      }
    });
  },
  
  preventDragDrop() {
    // Prevent dragging images
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
    
    // Prevent dropping images
    document.addEventListener('drop', (e) => {
      const dataTransfer = e.dataTransfer;
      if (dataTransfer && dataTransfer.types && dataTransfer.types.includes('Files')) {
        e.preventDefault();
        return false;
      }
    });
    
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
  },
  
  preventKeyboardShortcuts() {
    // Prevent Ctrl+S (Save)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+A (Select All)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        return false;
      }
    });
  },
  
  preventCopyPaste() {
    // Prevent copying images
    document.addEventListener('copy', (e) => {
      const selectedElement = document.activeElement;
      if (selectedElement && selectedElement.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
  }
};

// Screenshot Blocking for Mobile Devices (Android & iPhone)
const screenshotBlocker = {
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  
  init() {
    if (!this.isMobile) return;
    
    // Block screenshots and screen recording
    this.blockScreenshots();
    this.blockContextMenu();
    this.blockDevTools();
    this.blockTouchDownload();
    this.disablePrintScreen();
  },
  
  blockScreenshots() {
    // Block visibility change detection (when screenshot is taken)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.warn('Screenshot attempt detected');
      }
    });
    
    // Block screen capture API
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = function() {
        return Promise.reject(new Error('Screen capture is not allowed'));
      };
    }
  },
  
  blockContextMenu() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Disable long-press menu on mobile
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, false);
    
    document.addEventListener('touchend', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, false);
  },
  
  blockDevTools() {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.shiftKey && e.key === 'K') ||
        (e.ctrlKey && e.key === 'S')
      ) {
        e.preventDefault();
        return false;
      }
    });
  },
  
  blockTouchDownload() {
    // Disable image download on long press
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          setTimeout(() => {
            e.preventDefault();
          }, 500);
        }
      }, false);
      
      img.style.webkitUserSelect = 'none';
      img.style.userSelect = 'none';
      img.style.pointerEvents = 'auto';
      img.draggable = false;
    });
  },
  
  disablePrintScreen() {
    // Disable Print Screen key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        return false;
      }
    });
  }
};

// Music management
const musicManager = {
  currentAudio: null,
  isMuted: false,
  playlistAudio: null,
  playlistTracks: [],
  playlistIndex: 0,

  playSoundtrack(audioElementId, src) {
    const audio = document.getElementById(audioElementId);
    if (!audio) return;

    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
    }

    audio.volume = 1.0;
    audio.src = src;
    if (!this.isMuted) {
      audio.play().catch(err => console.log('Audio autoplay prevented:', err));
    }
    this.currentAudio = audio;
  },

  playPlaylist(audioElementId, tracks) {
    const audio = document.getElementById(audioElementId);
    if (!audio || !tracks.length) return;

    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
    }

    if (this.playlistAudio !== audio || this.playlistTracks.join('|') !== tracks.join('|')) {
      this.playlistAudio = audio;
      this.playlistTracks = tracks;
      this.playlistIndex = 0;
      audio.onended = () => {
        this.playlistIndex = (this.playlistIndex + 1) % this.playlistTracks.length;
        audio.src = this.playlistTracks[this.playlistIndex];
        if (!this.isMuted) {
          audio.play().catch(err => console.log('Audio play error:', err));
        }
      };
    }

    audio.loop = false;
    audio.volume = 1.0;
    this.currentAudio = audio;
    if (!this.isMuted && audio.paused) {
      audio.play().catch(err => console.log('Audio play error:', err));
    }
  },

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentAudio) {
      if (this.isMuted) {
        this.currentAudio.pause();
      } else {
        this.currentAudio.play().catch(err => console.log('Audio play error:', err));
      }
    }
    this.updateToggleButton();
  },

  updateToggleButton() {
    const btn = document.getElementById('music-toggle');
    if (btn) {
      btn.textContent = this.isMuted ? '🔇' : '🔊';
      btn.classList.toggle('muted', this.isMuted);
    }
  }
};

// Setup music toggle button
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all protection systems
  screenshotBlocker.init();
  downloadPrevention.init();
  
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', () => musicManager.toggleMute());
    musicManager.updateToggleButton();
  }
});

// Intro slideshow
if (document.getElementById('intro')) {
  let currentSlide = 0;
  const introImg = document.getElementById('intro-img');
  const enterBtn = document.getElementById('enter-btn');
  const introMusic = document.getElementById('intro-music');

  function updateImage() {
    if (images && images.length > 0) {
      introImg.src = images[currentSlide].path;
    }
  }

  function nextSlide() {
    if (!images || !images.length) return;
    currentSlide = (currentSlide + 1) % images.length;
    updateImage();
  }

  updateImage();
  
  // Start intro music
  if (introMusic) {
    musicManager.playSoundtrack('intro-music', 'music/intro-background.mp3');
  }

  setInterval(nextSlide, 3000);

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      window.location.href = 'gallery.html';
    });
  }

  // Auto enter after 8 seconds
  setTimeout(() => {
    window.location.href = 'gallery.html';
  }, 8000);
}

// Gallery functionality
if (document.getElementById('gallery-grid')) {
  const galleryGrid = document.getElementById('gallery-grid');
  const selectionCount = document.getElementById('selection-count');
  const viewSelectedBtn = document.getElementById('view-selected-btn');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalNumber = document.getElementById('modal-number');
  const close = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  let selected = JSON.parse(localStorage.getItem('selectedImages') || '[]');

  const selectionTracks = [
    'music/STUDIO%205D%20-FREEZE%20THE%20MOMENT.mp3',
    'music/STUDIO%205D%20-FREEZE%20THE%20MOMENT%20(1).mp3',
  ];

  // Start music as soon as the gallery opens; image interactions retry if autoplay is blocked.
  musicManager.playPlaylist('selection-music', selectionTracks);

  function updateSelectionCount() {
    selectionCount.textContent = selected.length;
  }

  function renderGallery() {
    galleryGrid.innerHTML = '';
    images.forEach(img => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${img.path}" alt="${img.name}" loading="lazy" oncontextmenu="return false" ondragstart="return false" style="user-select: none; -webkit-user-drag: none;">
        <div class="image-number">${img.number}</div>
        <button class="select-btn ${selected.includes(img.number) ? 'selected' : ''}" data-number="${img.number}">
          ${selected.includes(img.number) ? 'Selected' : 'Select'}
        </button>
        
      `;
      galleryGrid.appendChild(item);

      // Event listeners
      item.addEventListener('click', (event) => {
        if (event.target.closest('.select-btn')) return;
        musicManager.playPlaylist('selection-music', selectionTracks);
        modalImg.src = img.path;
        modalNumber.textContent = `Image #${img.number}`;
        modal.style.display = 'flex';
        
        // Protect modal image from downloads
        modalImg.oncontextmenu = () => false;
        modalImg.ondragstart = () => false;
        modalImg.style.userSelect = 'none';
        modalImg.style.webkitUserDrag = 'none';
        
      });

      item.querySelector('.select-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        musicManager.playPlaylist('selection-music', selectionTracks);
        const number = parseInt(e.target.dataset.number);
        if (selected.includes(number)) {
          selected = selected.filter(n => n !== number);
          e.target.classList.remove('selected');
          e.target.textContent = 'Select';
        } else {
          selected.push(number);
          e.target.classList.add('selected');
          e.target.textContent = 'Selected';
        }
        localStorage.setItem('selectedImages', JSON.stringify(selected));
        updateSelectionCount();
      });
    });
  }

  renderGallery();
  updateSelectionCount();

  viewSelectedBtn.addEventListener('click', () => {
    window.location.href = 'selected.html';
  });

  close.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modalBackdrop.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Selected images functionality
if (document.getElementById('selected-grid')) {
  const selectedGrid = document.getElementById('selected-grid');
  const selectedCount = document.getElementById('selected-count');
  const backBtn = document.getElementById('back-btn');
  const submitForm = document.getElementById('submit-form');

  const selectedNumbers = JSON.parse(localStorage.getItem('selectedImages') || '[]');
  const selectedImages = images.filter(img => selectedNumbers.includes(img.number));

  selectedCount.textContent = selectedImages.length;

  selectedImages.forEach(img => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${img.path}" alt="${img.name}">
      <div class="image-number">${img.number}</div>
    `;
    selectedGrid.appendChild(item);
  });

  backBtn.addEventListener('click', () => {
    window.location.href = 'gallery.html';
  });

  submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const selectedNumbers = selectedImages.map(img => img.number).join(', ');
    const formAction = submitForm.action || 'https://formspree.io/f/xkoarpkq';

    fetch(formAction, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        contact,
        selectedImages: selectedNumbers
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then(data => Promise.reject(data));
      })
      .then(() => {
        alert(`Thank you ${name}! Your selection has been submitted. We will contact you at ${contact}.`);
        localStorage.removeItem('selectedImages');
        window.location.href = 'gallery.html';
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        alert('There was an error sending your selection. Please try again.');
      });
  });
}
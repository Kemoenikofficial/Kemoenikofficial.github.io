/**
 * KEMOENIK - UTILITY FUNCTIONS
 * Helper functions untuk UI, DOM manipulation, dan app utilities
 * Version: 2.0 Modular
 */

// ============================================================
// 1. DOM UTILITIES
// ============================================================

/**
 * Safe DOM element selector dengan null check
 */
function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Safe innerHTML setter dengan XSS protection
 */
function setHTML(element, html) {
  if (!element) {
    console.warn('setHTML: element is null');
    return;
  }
  element.innerHTML = '';
  const temp = document.createElement('div');
  temp.innerHTML = html;
  while (temp.firstChild) {
    element.appendChild(temp.firstChild);
  }
}

/**
 * Safe textContent setter
 */
function setText(element, text) {
  if (!element) {
    console.warn('setText: element is null');
    return;
  }
  element.textContent = text;
}

/**
 * Toggle class pada element
 */
function toggleClass(element, className, force) {
  if (!element) return false;
  return element.classList.toggle(className, force);
}

/**
 * Add/remove class pada multiple elements
 */
function addClass(elements, className) {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el?.classList.add(className));
}

function removeClass(elements, className) {
  const els = Array.isArray(elements) ? elements : [elements];
  els.forEach(el => el?.classList.remove(className));
}

/**
 * Check apakah element memiliki class
 */
function hasClass(element, className) {
  return element?.classList.contains(className) || false;
}

/**
 * Create element dengan attributes dan children
 */
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class' || key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dKey, dVal]) => {
        el.dataset[dKey] = dVal;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  
  return el;
}

/**
 * Remove all children dari element
 */
function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Find closest ancestor dengan selector
 */
function closest(element, selector) {
  return element?.closest(selector) || null;
}

/**
 * Get/set data attribute
 */
function data(element, key, value) {
  if (!element) return null;
  if (value === undefined) {
    return element.dataset[key];
  }
  element.dataset[key] = value;
  return element;
}

// ============================================================
// 2. EVENT UTILITIES
// ============================================================

/**
 * Debounce function
 */
function debounce(func, wait = 300, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Once function - hanya jalankan sekali
 */
function once(func) {
  let ran = false;
  return function executedFunction(...args) {
    if (ran) return;
    ran = true;
    return func.apply(this, args);
  };
}

/**
 * Add event listener dengan auto-cleanup option
 */
function on(element, event, handler, options = {}) {
  if (!element) {
    console.warn('on: element is null');
    return () => {};
  }
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/**
 * Trigger custom event
 */
function trigger(element, eventName, detail = {}) {
  if (!element) return;
  const event = new CustomEvent(eventName, { detail, bubbles: true });
  element.dispatchEvent(event);
}

// ============================================================
// 3. ANIMATION UTILITIES
// ============================================================

/**
 * Animate CSS properties dengan requestAnimationFrame
 */
function animate(element, properties, duration = 300, easing = 'ease') {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }
    
    const start = {};
    const end = {};
    const unitRegex = /^[\d.]+([a-z%]*)$/i;
    
    Object.entries(properties).forEach(([prop, value]) => {
      const computed = getComputedStyle(element)[prop];
      start[prop] = parseFloat(computed) || 0;
      
      const match = String(value).match(unitRegex);
      end[prop] = {
        value: parseFloat(value),
        unit: match?.[1] || 'px'
      };
    });
    
    const startTime = performance.now();
    
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing functions
      const eased = easing === 'linear' ? progress :
        easing === 'ease-in' ? progress * progress :
        easing === 'ease-out' ? 1 - (1 - progress) * (1 - progress) :
        easing === 'ease-in-out' ? progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2 :
        progress; // default ease
      
      Object.entries(start).forEach(([prop, startVal]) => {
        const endVal = end[prop].value;
        const unit = end[prop].unit;
        const current = startVal + (endVal - startVal) * eased;
        element.style[prop] = current + unit;
      });
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(step);
  });
}

/**
 * Fade in/out
 */
function fadeIn(element, duration = 300) {
  if (!element) return Promise.resolve();
  element.style.opacity = '0';
  element.style.display = '';
  return animate(element, { opacity: 1 }, duration, 'ease-out');
}

function fadeOut(element, duration = 300) {
  if (!element) return Promise.resolve();
  return animate(element, { opacity: 0 }, duration, 'ease-in')
    .then(() => {
      element.style.display = 'none';
      element.style.opacity = '';
    });
}

/**
 * Slide up/down
 */
function slideDown(element, duration = 300) {
  if (!element) return Promise.resolve();
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.display = '';
  
  const targetHeight = element.scrollHeight;
  return animate(element, { height: targetHeight }, duration, 'ease-out')
    .then(() => {
      element.style.height = '';
      element.style.overflow = '';
    });
}

function slideUp(element, duration = 300) {
  if (!element) return Promise.resolve();
  const currentHeight = element.scrollHeight;
  element.style.height = currentHeight + 'px';
  element.style.overflow = 'hidden';
  
  return animate(element, { height: 0 }, duration, 'ease-in')
    .then(() => {
      element.style.display = 'none';
      element.style.height = '';
      element.style.overflow = '';
    });
}

/**
 * Shake animation untuk error feedback
 */
function shake(element, duration = 500) {
  if (!element) return Promise.resolve();
  
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' }
  ];
  
  return element.animate(keyframes, {
    duration,
    easing: 'ease-in-out'
  }).finished;
}

/**
 * Pulse animation
 */
function pulse(element, duration = 1000) {
  if (!element) return Promise.resolve();
  
  const keyframes = [
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' }
  ];
  
  return element.animate(keyframes, {
    duration,
    iterations: Infinity
  });
}

// ============================================================
// 4. SCROLL UTILITIES
// ============================================================

/**
 * Smooth scroll ke element
 */
function scrollTo(element, options = {}) {
  if (!element) return;
  
  const defaults = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    offset: 0
  };
  const config = { ...defaults, ...options };
  
  if (config.offset) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - config.offset;
    window.scrollTo({
      top: scrollTop,
      behavior: config.behavior
    });
  } else {
    element.scrollIntoView({
      behavior: config.behavior,
      block: config.block,
      inline: config.inline
    });
  }
}

/**
 * Scroll ke top dengan smooth behavior
 */
function scrollToTop(duration = 500) {
  const start = window.pageYOffset;
  const startTime = performance.now();
  
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    
    window.scrollTo(0, start * (1 - eased));
    
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  
  requestAnimationFrame(step);
}

/**
 * Lock/unlock body scroll (untuk modal)
 */
function lockScroll() {
  const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollBarCompensation + 'px';
}

function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Check apakah element in viewport
 */
function isInViewport(element, threshold = 0) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
    rect.bottom >= 0
  );
}

/**
 * Lazy load trigger dengan IntersectionObserver
 */
function onScrollIntoView(element, callback, options = {}) {
  if (!element || !window.IntersectionObserver) {
    // Fallback untuk browser tanpa IO
    const check = () => {
      if (isInViewport(element)) {
        callback();
        window.removeEventListener('scroll', check);
      }
    };
    window.addEventListener('scroll', throttle(check, 100));
    check();
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
        if (!options.repeat) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    root: options.root || null,
    rootMargin: options.rootMargin || '0px',
    threshold: options.threshold || 0
  });
  
  observer.observe(element);
  return () => observer.disconnect();
}

// ============================================================
// 5. STORAGE UTILITIES
// ============================================================

/**
 * Safe localStorage wrapper dengan JSON support
 */
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (e) {
      console.warn('Storage get error:', e);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      const val = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, val);
      return true;
    } catch (e) {
      console.warn('Storage set error:', e);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Storage remove error:', e);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('Storage clear error:', e);
      return false;
    }
  },
  
  has(key) {
    return localStorage.getItem(key) !== null;
  },
  
  // Session storage variants
  session: {
    get(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        if (!item) return defaultValue;
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      } catch (e) {
        console.warn('Session get error:', e);
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        const val = typeof value === 'object' ? JSON.stringify(value) : String(value);
        sessionStorage.setItem(key, val);
        return true;
      } catch (e) {
        console.warn('Session set error:', e);
        return false;
      }
    },
    
    remove(key) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('Session remove error:', e);
        return false;
      }
    }
  }
};

// ============================================================
// 6. FORM UTILITIES
// ============================================================

/**
 * Serialize form data ke object
 */
function serializeForm(form) {
  if (!form) return {};
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  
  return data;
}

/**
 * Validate form field
 */
function validateField(value, rules = {}) {
  const errors = [];
  
  if (rules.required && (!value || String(value).trim() === '')) {
    errors.push('Field wajib diisi');
  }
  
  if (value && rules.minLength && String(value).length < rules.minLength) {
    errors.push(`Minimal ${rules.minLength} karakter`);
  }
  
  if (value && rules.maxLength && String(value).length > rules.maxLength) {
    errors.push(`Maksimal ${rules.maxLength} karakter`);
  }
  
  if (value && rules.min && Number(value) < rules.min) {
    errors.push(`Minimal ${rules.min}`);
  }
  
  if (value && rules.max && Number(value) > rules.max) {
    errors.push(`Maksimal ${rules.max}`);
  }
  
  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Format tidak valid');
  }
  
  if (value && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push('Email tidak valid');
  }
  
  if (value && rules.phone && !/^[\d\s\-\+\(\)]+$/.test(value)) {
    errors.push('Nomor telepon tidak valid');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format input saat type (number, phone, etc)
 */
function formatInput(input, type) {
  if (!input) return;
  
  const formatters = {
    number: (val) => val.replace(/\D/g, ''),
    phone: (val) => {
      const num = val.replace(/\D/g, '');
      if (num.startsWith('0')) return '62' + num.slice(1);
      if (num.startsWith('8')) return '62' + num;
      return num;
    },
    decimal: (val) => {
      // Allow one decimal point
      let cleaned = val.replace(/[^\d.]/g, '');
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
      return cleaned;
    },
    currency: (val) => {
      const num = val.replace(/\D/g, '');
      return num ? Number(num).toLocaleString('id-ID') : '';
    }
  };
  
  const formatter = formatters[type];
  if (!formatter) return;
  
  input.addEventListener('input', (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const originalLength = e.target.value.length;
    
    e.target.value = formatter(e.target.value);
    
    // Restore cursor position
    const newLength = e.target.value.length;
    const diff = newLength - originalLength;
    e.target.setSelectionRange(start + diff, end + diff);
  });
}

/**
 * Auto-resize textarea
 */
function autoResizeTextarea(textarea, maxHeight = 300) {
  if (!textarea) return;
  
  function resize() {
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  }
  
  textarea.addEventListener('input', debounce(resize, 100));
  resize();
}

// ============================================================
// 7. NETWORK UTILITIES
// ============================================================

/**
 * Safe fetch dengan timeout dan retry
 */
async function fetchWithTimeout(url, options = {}, timeout = 10000, retries = 0) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(id);
    
    if (retries > 0 && error.name !== 'AbortError') {
      console.log(`Retrying fetch... (${retries} attempts left)`);
      await delay(1000);
      return fetchWithTimeout(url, options, timeout, retries - 1);
    }
    
    throw error;
  }
}

/**
 * Delay/promise wrapper untuk setTimeout
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check online status
 */
function isOnline() {
  return navigator.onLine;
}

/**
 * Listen online/offline events
 */
function onConnectionChange(onlineCallback, offlineCallback) {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
}

// ============================================================
// 8. DEVICE & BROWSER UTILITIES
// ============================================================

/**
 * Detect mobile device
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;
}

/**
 * Detect touch support
 */
function isTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device info
 */
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    pixelRatio: window.devicePixelRatio,
    touch: isTouch(),
    online: isOnline(),
    standalone: window.matchMedia('(display-mode: standalone)').matches
  };
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch (e) {
      console.warn('Copy failed:', e);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Share content (Web Share API dengan fallback)
 */
async function share(data) {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (err) {
      if (err.name === 'AbortError') return false;
      console.warn('Share failed:', err);
    }
  }
  
  // Fallback: copy link
  if (data.url) {
    const success = await copyToClipboard(data.url);
    return success ? 'copied' : false;
  }
  
  return false;
}

// ============================================================
// 9. DATE & TIME UTILITIES
// ============================================================

/**
 * Format relative time (e.g., "2 jam yang lalu")
 */
function timeAgo(date, locale = 'id-ID') {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
  const intervals = {
    tahun: 31536000,
    bulan: 2592000,
    minggu: 604800,
    hari: 86400,
    jam: 3600,
    menit: 60,
    detik: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? '' : ''} yang lalu`;
    }
  }
  
  return 'baru saja';
}

/**
 * Format duration (e.g., "1j 30m")
 */
function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
}

/**
 * Get week number
 */
function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Check if same day
 */
function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// ============================================================
// 10. MATH & NUMBER UTILITIES
// ============================================================

/**
 * Clamp number between min and max
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Round to decimal places
 */
function round(num, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Random integer between min and max (inclusive)
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random array element
 */
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffle(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Group array by key
 */
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Chunk array into smaller arrays
 */
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// ============================================================
// 11. STRING UTILITIES
// ============================================================

/**
 * Truncate string dengan ellipsis
 */
function truncate(str, maxLength, suffix = '...') {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word
 */
function titleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, txt => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Slugify string
 */
function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse query string ke object
 */
function parseQueryString(query = window.location.search) {
  const params = new URLSearchParams(query);
  const result = {};
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Build query string dari object
 */
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    }
  });
  return searchParams.toString();
}

// ============================================================
// 12. KEMOENIK SPECIFIC UTILITIES
// ============================================================

/**
 * Calculate progress percentage
 */
function calculateProgress(current, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}

/**
 * Calculate day number from start date
 */
function calculateDayNumber(startDateISO, targetDateISO = null) {
  const start = new Date(startDateISO + 'T00:00:00');
  const target = targetDateISO ? new Date(targetDateISO + 'T00:00:00') : new Date();
  
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  
  const diffDays = Math.floor((targetDay - startDay) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays) + 1; // Day 1 is the start day
}

/**
 * Format weight change dengan indicator
 */
function formatWeightChange(current, previous, decimals = 1) {
  if (!previous || current === previous) {
    return { text: '0 kg', color: 'neutral', icon: '➡️' };
  }
  
  const diff = current - previous;
  const absDiff = Math.abs(diff).toFixed(decimals);
  
  if (diff < 0) {
    return { 
      text: `-${absDiff} kg`, 
      color: 'success', 
      icon: '↓',
      raw: diff 
    };
  } else {
    return { 
      text: `+${absDiff} kg`, 
      color: 'warning', 
      icon: '↑',
      raw: diff 
    };
  }
}

/**
 * Get greeting based on time of day
 */
function getGreeting(name = '') {
  const hour = new Date().getHours();
  let greeting;
  
  if (hour < 11) greeting = 'Selamat pagi';
  else if (hour < 15) greeting = 'Selamat siang';
  else if (hour < 18) greeting = 'Selamat sore';
  else greeting = 'Selamat malam';
  
  return name ? `${greeting}, ${name}!` : greeting;
}

/**
 * Generate share text untuk hasil diet
 */
function generateShareText(data) {
  const { nama, beratAwal, beratAkhir, minggu, tipe } = data;
  const turun = (beratAwal - beratAkhir).toFixed(1);
  
  return `🎉 ${nama} berhasil turun ${turun} kg dalam ${minggu} minggu dengan KEMOENIK!

Tipe metabolisme: ${tipe}
Program: Defisit kalori + herbal alami

Yuk mulai perjalanan dietmu! 💪
${APP_CONFIG?.url || 'https://kemoenikofficial.github.io/aktivitas/'}`;
}

// ============================================================
// 13. ERROR HANDLING & DEBUGGING
// ============================================================

/**
 * Safe function execution dengan error handling
 */
function safeExec(fn, fallback = null, context = null, ...args) {
  try {
    return fn.apply(context, args);
  } catch (err) {
    console.error('safeExec error:', err);
    return typeof fallback === 'function' ? fallback(err) : fallback;
  }
}

/**
 * Create error object dengan context
 */
function createError(message, code = null, details = {}) {
  const error = new Error(message);
  error.code = code;
  error.details = details;
  error.timestamp = new Date().toISOString();
  return error;
}

/**
 * Log dengan level dan context
 */
function log(level, message, context = {}) {
  const timestamp = new Date().toLocaleTimeString('id-ID');
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  const logData = {
    timestamp,
    level,
    message,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  switch (level) {
    case 'debug':
      console.debug(prefix, message, context);
      break;
    case 'info':
      console.info(prefix, message, context);
      break;
    case 'warn':
      console.warn(prefix, message, context);
      break;
    case 'error':
      console.error(prefix, message, context);
      // Could send to error tracking service here
      break;
    default:
      console.log(prefix, message, context);
  }
  
  return logData;
}

// Debug logger shortcuts
const debug = (msg, ctx) => log('debug', msg, ctx);
const info = (msg, ctx) => log('info', msg, ctx);
const warn = (msg, ctx) => log('warn', msg, ctx);
const error = (msg, ctx) => log('error', msg, ctx);

// ============================================================
// 14. EXPORT / MODULE PATTERN
// ============================================================

// ES6 Module exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // DOM
    $, $$, setHTML, setText, toggleClass, addClass, removeClass, hasClass,
    createElement, clearElement, closest, data,
    
    // Events
    debounce, throttle, once, on, trigger,
    
    // Animation
    animate, fadeIn, fadeOut, slideDown, slideUp, shake, pulse,
    
    // Scroll
    scrollTo, scrollToTop, lockScroll, unlockScroll, isInViewport, onScrollIntoView,
    
    // Storage
    storage,
    
    // Form
    serializeForm, validateField, formatInput, autoResizeTextarea,
    
    // Network
    fetchWithTimeout, delay, isOnline, onConnectionChange,
    
    // Device
    isMobile, isTouch, getDeviceInfo, copyToClipboard, share,
    
    // Date/Time
    timeAgo, formatDuration, getWeekNumber, isSameDay,
    
    // Math
    clamp, round, randomInt, randomElement, shuffle, groupBy, chunk,
    
    // String
    truncate, capitalize, titleCase, slugify, parseQueryString, buildQueryString,
    
    // Kemoenik specific
    calculateProgress, calculateDayNumber, formatWeightChange, getGreeting, generateShareText,
    
    // Error/Debug
    safeExec, createError, log, debug, info, warn, error
  };
}

// Browser global
if (typeof window !== 'undefined') {
  window.KemoenikUtils = {
    // DOM
    $, $$, setHTML, setText, toggleClass, addClass, removeClass, hasClass,
    createElement, clearElement, closest, data,
    
    // Events
    debounce, throttle, once, on, trigger,
    
    // Animation
    animate, fadeIn, fadeOut, slideDown, slideUp, shake, pulse,
    
    // Scroll
    scrollTo, scrollToTop, lockScroll, unlockScroll, isInViewport, onScrollIntoView,
    
    // Storage
    storage,
    
    // Form
    serializeForm, validateField, formatInput, autoResizeTextarea,
    
    // Network
    fetchWithTimeout, delay, isOnline, onConnectionChange,
    
    // Device
    isMobile, isTouch, getDeviceInfo, copyToClipboard, share,
    
    // Date/Time
    timeAgo, formatDuration, getWeekNumber, isSameDay,
    
    // Math
    clamp, round, randomInt, randomElement, shuffle, groupBy, chunk,
    
    // String
    truncate, capitalize, titleCase, slugify, parseQueryString, buildQueryString,
    
    // Kemoenik specific
    calculateProgress, calculateDayNumber, formatWeightChange, getGreeting, generateShareText,
    
    // Error/Debug
    safeExec, createError, log, debug, info, warn, error
  };
}

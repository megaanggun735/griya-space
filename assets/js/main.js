/**
* Template Name: HomeSpace
* Template URL: https://bootstrapmade.com/homespace-bootstrap-real-estate-template/
* Updated: Jul 05 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";
  ''
  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  const pageId = window.location.pathname.split('/').pop() || 'blog-details';

  function getCommentId(contentNode) {
    const author = contentNode.querySelector('.user-info h4');
    const text = contentNode.querySelector('.comment-body p');
    const aText = author ? author.innerText.trim() : '';
    const tText = text ? text.innerText.trim() : '';
    let str = aText + "|" + tText;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return "cmt_" + hash;
  }

  function getLikesData() {
    try {
      return JSON.parse(localStorage.getItem('griyaspace_likes_' + pageId)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveLikesData(data) {
    localStorage.setItem('griyaspace_likes_' + pageId, JSON.stringify(data));
  }

  function restoreLikes(container) {
    const likesData = getLikesData();
    container.querySelectorAll('.comment-content').forEach(content => {
      const cId = getCommentId(content);
      if (likesData[cId] && likesData[cId].hasLiked) {
        const btn = content.querySelector('.like-btn');
        if (btn && !btn.classList.contains('active')) {
          btn.classList.add('active');
          const icon = btn.querySelector('i');
          const likesSpan = content.querySelector('.engagement .likes');

          if (icon) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
            icon.style.color = '#dc3545';
          }
          btn.style.color = '#dc3545';

          if (likesSpan) {
            let countText = likesSpan.innerText.trim();
            let count = parseInt(countText) || 0;
            likesSpan.innerHTML = `<i class="bi bi-heart-fill" style="color:#dc3545"></i> ${count + 1}`;
          }
        }
      }
    });
  }

  /**
   * Blog Comments Actions
   */
  function bindCommentActions(container) {
    container.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        const content = this.closest('.comment-content');

        if (content) {
          const likesSpan = content.querySelector('.engagement .likes');
          const cId = getCommentId(content);
          const likesData = getLikesData();
          let currentLikeData = likesData[cId] || { hasLiked: false };

          if (likesSpan) {
            let countText = likesSpan.innerText.trim();
            let count = parseInt(countText) || 0;

            if (this.classList.contains('active')) {
              if (icon) {
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                icon.style.color = '#dc3545';
              }
              this.style.color = '#dc3545';
              likesSpan.innerHTML = `<i class="bi bi-heart-fill" style="color:#dc3545"></i> ${count + 1}`;
              currentLikeData.hasLiked = true;
            } else {
              if (icon) {
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                icon.style.color = '';
              }
              this.style.color = '';
              likesSpan.innerHTML = `<i class="bi bi-heart"></i> ${count - 1}`;
              currentLikeData.hasLiked = false;
            }
          }

          likesData[cId] = currentLikeData;
          saveLikesData(likesData);
        }
      });
    });

    container.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const content = this.closest('.comment-content');
        if (content) {
          const authorEl = content.querySelector('.user-info h4');
          if (authorEl) {
            const author = authorEl.innerText;
            const commentInput = document.getElementById('comment');

            if (commentInput) {
              commentInput.value = `@${author} `;
              commentInput.focus();
              commentInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      });
    });

    container.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert("Tautan artikel berhasil disalin ke papan klip!");
        }).catch(() => {
          alert("Gagal menyalin tautan.");
        });
      });
    });
  }

  // Bind to existing comments
  bindCommentActions(document);

  function buildCommentHtml(name, text, dateStr, id, isUser) {
    const badge = isUser ? ` <span style="font-size:0.65rem; background:linear-gradient(135deg, #2980b9, #16a085); color:#fff; padding:2px 8px; border-radius:20px; margin-left:8px; vertical-align: middle;"><i class="bi bi-person-check-fill"></i> Komentar Saya</span>` : '';
    const deleteBtn = isUser ? `
                <div class="engagement">
                  <button class="action-btn delete-btn" data-id="${id}" aria-label="Hapus komentar" title="Hapus komentar ini" style="color:#e74c3c; background:rgba(231,76,60,0.08); border:1px solid rgba(231,76,60,0.3); border-radius:8px; padding:5px 12px; font-size:0.78rem; font-weight:600; cursor:pointer;">
                    <i class="bi bi-trash3"></i> <span>Hapus</span>
                  </button>
                </div>` : `
                <div class="engagement">
                  <span class="likes">
                    <i class="bi bi-heart"></i>
                    0
                  </span>
                </div>`;

    return `
      <div class="comment-thread" style="animation: fadeInCard .5s ease both" data-comment-id="${id}">
        <div class="comment-box">
          <div class="comment-wrapper">
            <div class="user-avatar" style="background:#e0e0e0; border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden;">
              <i class="bi bi-person-fill" style="font-size:2.5rem; color:#fff; transform:translateY(5px);"></i>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <div class="user-info">
                  <h4>${name}${badge}</h4>
                  <span class="time-badge">
                    <i class="bi bi-clock"></i>
                    ${dateStr}
                  </span>
                </div>
                ${deleteBtn}
              </div>
              <div class="comment-body">
                <p>${text}</p>
              </div>
              <div class="comment-actions">
                <button class="action-btn like-btn" aria-label="Like comment">
                  <i class="bi bi-heart"></i>
                  <span>Suka</span>
                </button>
                <button class="action-btn reply-btn" aria-label="Reply to comment">
                  <i class="bi bi-chat"></i>
                  <span>Balas</span>
                </button>
                <button class="action-btn share-btn" aria-label="Share comment">
                  <i class="bi bi-share"></i>
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function loadSavedComments() {
    const commentsContainer = document.querySelector('.comments-container');
    if (!commentsContainer) return;

    let savedComments = [];
    try {
      savedComments = JSON.parse(localStorage.getItem('griyaspace_comments_' + pageId)) || [];
    } catch (e) { }

    let updated = false;
    savedComments = savedComments.map(c => {
      if (!c.id) {
        c.id = 'c_' + Date.now() + Math.random().toString(36).substring(2, 9);
        updated = true;
      }
      return c;
    });
    if (updated) {
      localStorage.setItem('griyaspace_comments_' + pageId, JSON.stringify(savedComments));
    }

    savedComments.forEach(c => {
      const newCommentHtml = buildCommentHtml(c.name, c.text, c.date, c.id, true);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newCommentHtml;
      const commentNode = tempDiv.firstElementChild;

      commentsContainer.prepend(commentNode);
      bindCommentActions(commentNode);
    });
  }

  loadSavedComments();
  restoreLikes(document);

  // Global delete handler
  document.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      if (confirm('Hapus komentar ini secara permanen?')) {
        const commentId = deleteBtn.getAttribute('data-id');
        let savedComments = [];
        try { savedComments = JSON.parse(localStorage.getItem('griyaspace_comments_' + pageId)) || []; } catch(e) {}
        savedComments = savedComments.filter(c => c.id !== commentId);
        localStorage.setItem('griyaspace_comments_' + pageId, JSON.stringify(savedComments));
        
        const thread = deleteBtn.closest('.comment-thread');
        if (thread) {
          thread.style.transition = 'all 0.4s';
          thread.style.opacity = '0';
          thread.style.transform = 'translateX(20px)';
          setTimeout(() => thread.remove(), 400);
          
          // Update count
          const countEl = document.querySelector('.comments-stats .count');
          if (countEl) countEl.textContent = Math.max(0, (parseInt(countEl.textContent) || 0) - 1);
        }
      }
    }
  });

  // Intercept Comment Form Submission
  document.querySelectorAll('.blog-comment-form form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = this.querySelector('input[name="name"]');
      const textInput = this.querySelector('textarea[name="comment"]') || this.querySelector('textarea[id="comment"]');

      const name = nameInput ? nameInput.value.trim() : 'Anonim';
      const text = textInput ? textInput.value.trim() : '';

      if (!text) return;

      // Save to localStorage
      let savedComments = [];
      try {
        savedComments = JSON.parse(localStorage.getItem('griyaspace_comments_' + pageId)) || [];
      } catch (e) { }

      const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const id = 'c_' + Date.now() + Math.random().toString(36).substring(2, 9);
      savedComments.push({ id, name, text, date: dateStr });
      localStorage.setItem('griyaspace_comments_' + pageId, JSON.stringify(savedComments));

      const commentsContainer = document.querySelector('.comments-container');
      if (commentsContainer) {
        const newCommentHtml = buildCommentHtml(name, text, 'Baru saja', id, true);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newCommentHtml;
        const commentNode = tempDiv.firstElementChild;

        commentsContainer.prepend(commentNode);
        bindCommentActions(commentNode);

        setTimeout(() => {
          commentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // Update count
        const countEl = document.querySelector('.comments-stats .count');
        if (countEl) countEl.textContent = (parseInt(countEl.textContent) || 0) + 1;
      }

      this.reset();
    });
  });

})();
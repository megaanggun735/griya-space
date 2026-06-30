/**
 * Blog Comments & WhatsApp Floating Button
 * GriyaSpace - blog-comments.js
 */

(function () {
  'use strict';

  const PAGE_KEY = 'gs_comments_' + window.location.pathname.replace(/\//g, '_').replace(/\.html$/, '');

  function loadComments() {
    try { return JSON.parse(localStorage.getItem(PAGE_KEY)) || []; } catch (e) { return []; }
  }

  function saveComments(comments) {
    localStorage.setItem(PAGE_KEY, JSON.stringify(comments));
  }

  function timeAgo(dateStr) {
    const now = new Date(), then = new Date(dateStr), diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return Math.floor(diff / 60) + ' menit yang lalu';
    if (diff < 86400) return Math.floor(diff / 3600) + ' jam yang lalu';
    if (diff < 2592000) return Math.floor(diff / 86400) + ' hari yang lalu';
    return then.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function renderUserComment(comment) {
    const initials = comment.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const el = document.createElement('div');
    el.className = 'comment-thread user-comment-thread';
    el.dataset.commentId = comment.id;
    el.innerHTML = `
      <div class="comment-box">
        <div class="comment-wrapper">
          <div class="avatar-wrapper user-avatar-wrapper">
            <div class="user-avatar-initials">${initials}</div>
            <span class="status-indicator active-indicator"></span>
          </div>
          <div class="comment-content">
            <div class="comment-header">
              <div class="user-info">
                <h4>${escapeHtml(comment.name)} <span class="user-own-badge"><i class="bi bi-person-check-fill"></i> Komentar Saya</span></h4>
                <span class="time-badge"><i class="bi bi-clock"></i> ${timeAgo(comment.date)}</span>
              </div>
              <div class="engagement">
                <button class="action-btn delete-btn" data-id="${comment.id}" aria-label="Hapus komentar" title="Hapus komentar ini">
                  <i class="bi bi-trash3"></i>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
            <div class="comment-body"><p>${escapeHtml(comment.text)}</p></div>
            <div class="comment-actions">
              <button class="action-btn like-btn" aria-label="Like comment"><i class="bi bi-heart"></i><span>Suka</span></button>
              <button class="action-btn share-btn" aria-label="Share comment"><i class="bi bi-share"></i><span>Bagikan</span></button>
            </div>
          </div>
        </div>
      </div>`;
    el.querySelector('.delete-btn').addEventListener('click', function () { showDeleteConfirm(comment.id, el); });
    return el;
  }

  function showDeleteConfirm(commentId, el) {
    const overlay = document.createElement('div');
    overlay.className = 'gs-delete-overlay';
    overlay.innerHTML = `
      <div class="gs-delete-modal">
        <div class="gs-delete-icon"><i class="bi bi-trash3-fill"></i></div>
        <h4>Hapus Komentar?</h4>
        <p>Komentar ini akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
        <div class="gs-delete-actions">
          <button class="gs-btn-cancel" id="gs-cancel-delete">Batal</button>
          <button class="gs-btn-delete" id="gs-confirm-delete">Ya, Hapus</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    function closeModal() {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 300);
    }
    overlay.querySelector('#gs-cancel-delete').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    overlay.querySelector('#gs-confirm-delete').addEventListener('click', function () {
      deleteComment(commentId, el); closeModal();
    });
  }

  function deleteComment(commentId, el) {
    let comments = loadComments();
    comments = comments.filter(c => c.id !== commentId);
    saveComments(comments);
    el.style.transition = 'all 0.4s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    el.style.maxHeight = el.offsetHeight + 'px';
    setTimeout(() => {
      el.style.maxHeight = '0'; el.style.overflow = 'hidden';
      el.style.padding = '0'; el.style.margin = '0';
      setTimeout(() => el.remove(), 400);
    }, 400);
    updateCommentCount(-1);
    showToast('Komentar berhasil dihapus.', 'success');
  }

  function updateCommentCount(delta) {
    const countEl = document.querySelector('.comments-stats .count');
    if (countEl) countEl.textContent = Math.max(0, (parseInt(countEl.textContent) || 0) + delta);
  }

  function showToast(message, type) {
    const existing = document.querySelector('.gs-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `gs-toast gs-toast-${type}`;
    toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => { toast.classList.remove('visible'); setTimeout(() => toast.remove(), 400); }, 3000);
  }

  function renderAllUserComments() {
    const container = document.querySelector('.comments-container');
    if (!container) return;
    container.querySelectorAll('.user-comment-thread, .user-comments-divider').forEach(el => el.remove());
    const comments = loadComments();
    if (comments.length === 0) return;
    const divider = document.createElement('div');
    divider.className = 'user-comments-divider';
    divider.innerHTML = '<span><i class="bi bi-person-fill"></i> Komentar Saya</span>';
    container.appendChild(divider);
    comments.forEach(comment => container.appendChild(renderUserComment(comment)));
  }

  function initCommentForm() {
    const form = document.querySelector('#blog-comment-form form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const nameEl = form.querySelector('#name'), emailEl = form.querySelector('#email'), commentEl = form.querySelector('#comment');
      const name = nameEl ? nameEl.value.trim() : '', text = commentEl ? commentEl.value.trim() : '';
      if (!name || !text) { showToast('Harap isi nama dan komentar terlebih dahulu.', 'error'); return; }
      const newComment = {
        id: 'uc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name, email: emailEl ? emailEl.value.trim() : '', text, date: new Date().toISOString()
      };
      const comments = loadComments();
      comments.unshift(newComment);
      saveComments(comments);
      form.reset();
      renderAllUserComments();
      updateCommentCount(1);
      const newEl = document.querySelector('[data-comment-id="' + newComment.id + '"]');
      if (newEl) {
        newEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        newEl.classList.add('comment-highlight');
        setTimeout(() => newEl.classList.remove('comment-highlight'), 2000);
      }
      showToast('Komentar Anda berhasil ditambahkan!', 'success');
    });
  }

  function initLikeButtons() {
    document.addEventListener('click', function (e) {
      const likeBtn = e.target.closest('.like-btn');
      if (!likeBtn) return;
      likeBtn.classList.toggle('liked');
      const icon = likeBtn.querySelector('i');
      if (icon) { icon.classList.toggle('bi-heart'); icon.classList.toggle('bi-heart-fill'); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAllUserComments();
    initCommentForm();
    initLikeButtons();
  });

})();

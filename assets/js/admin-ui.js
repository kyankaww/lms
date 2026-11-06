(function () {
  'use strict';

  if (window.Auth) {
    window.Auth.requireAdmin();
  }
  function injectAdminLogout() {
    if (!window.Auth) return;
    const actions = document.querySelector('.admin-header-actions');
    if (!actions) return;
    if (actions.querySelector('[data-admin-logout]')) return;

    const link = document.createElement('a');
    link.href = 'login.html';
    link.className = 'btn-admin btn-admin-outline btn-admin-sm';
    link.setAttribute('data-admin-logout', 'true');
    link.textContent = 'Keluar';
    link.addEventListener('click', function () {
      window.Auth.logoutAdmin();
    });
    actions.appendChild(link);
  }
  injectAdminLogout();

  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle  = document.getElementById('sidebarToggle');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  const currentPage = location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.AdminUI = window.AdminUI || {};
  AdminUI.showAlert = function (message, type, container) {
    type = type || 'info';
    container = container || document.getElementById('alertContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'admin-alert admin-alert-' + type;
    div.innerHTML = message;

    const close = document.createElement('button');
    close.innerHTML = '&times;';
    close.style.cssText = 'background:none;border:none;font-size:1rem;cursor:pointer;margin-left:auto;color:inherit;opacity:0.6;';
    close.onclick = function () { div.remove(); };
    div.appendChild(close);

    container.prepend(div);
    setTimeout(function () {
      if (div.parentNode) div.remove();
    }, 5000);
  };
  AdminUI.confirm = function (message) {
    return window.confirm(message);
  };

  AdminUI.formatDate = function (value) {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  AdminUI.formatDateTime = function (value) {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  AdminUI.formatCurrency = function (amount) {
    if (amount == null) return '-';
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  };
  AdminUI.escapeHTML = function (str) {
    return String(str ?? '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c];
    });
  };

  AdminUI.el = function (tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  AdminUI.statusBadge = function (status) {
    const map = {
      'Menunggu verifikasi': 'badge-pending',
      'Diproses':            'badge-process',
      'Diterima':            'badge-approved',
      'Ditolak':             'badge-rejected',
      'Perlu koreksi':       'badge-correction',
      'Belum dibayar':       'badge-unpaid',
      'Menunggu konfirmasi': 'badge-pending',
      'Lunas':               'badge-verified',
      'Aktif':               'badge-active',
      'Tidak Aktif':         'badge-inactive',
      'ACTIVE':              'badge-active',
      'INACTIVE':            'badge-inactive',
    };
    const cls = map[status] || 'badge-pending';
    return '<span class="badge-status ' + cls + '"><span class="badge-dot"></span>' + AdminUI.escapeHTML(status) + '</span>';
  };
  /* ============================================================
     PAGINATION HELPER
     ============================================================ */
  AdminUI.paginate = function (items, page, perPage) {
    perPage = perPage || 10;
    page = Math.max(1, page || 1);
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    page = Math.min(page, totalPages);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      items: items.slice(start, end),
      page: page,
      perPage: perPage,
      total: total,
      totalPages: totalPages,
      start: start + 1,
      end: Math.min(end, total)
    };
  };
  AdminUI.renderPagination = function (container, paginationData, onPageChange) {
    if (!container) return;
    container.innerHTML = '';
    const info = AdminUI.el('span', 'admin-pagination-info',
      'Menampilkan ' + paginationData.start + '–' + paginationData.end + ' dari ' + paginationData.total
    );
    const btns = AdminUI.el('div', 'admin-pagination-btns');
    const prev = AdminUI.el('button', '', '← Prev');
    prev.disabled = paginationData.page <= 1;
    prev.onclick = function () { onPageChange(paginationData.page - 1); };
    btns.appendChild(prev);

    const maxButtons = 5;
    let startPage = Math.max(1, paginationData.page - Math.floor(maxButtons / 2));
    let endPage = Math.min(paginationData.totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      const btn = AdminUI.el('button', i === paginationData.page ? 'active' : '', String(i));
      btn.onclick = (function (p) { return function () { onPageChange(p); }; })(i);
      btns.appendChild(btn);
    }
    const next = AdminUI.el('button', '', 'Next →');
    next.disabled = paginationData.page >= paginationData.totalPages;
    next.onclick = function () { onPageChange(paginationData.page + 1); };
    btns.appendChild(next);

    container.appendChild(info);
    container.appendChild(btns);
  };
})();

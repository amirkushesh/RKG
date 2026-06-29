
// ===== Smooth Scroll =====
function goTo(id) {
    var el = document.getElementById(id);
    if (el) {
        var top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }
    return false;
}

// ===== Navbar =====
var navbar = document.getElementById('navbar');
var navLinks = ['home', 'services', 'projects', 'equipment', 'about', 'contact'];

function updateNavbar() {
    var scrolled = window.scrollY > 60;
    navbar.className = 'navbar ' + (scrolled ? 'navbar-solid' : 'navbar-glass');

    var current = 'home';
    navLinks.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
    });
    navLinks.forEach(function (id) {
        var el = document.getElementById('nl-' + id);
        if (el) el.className = 'nav-link' + (id === current ? ' active' : '');
    });
    // drawer links
    document.querySelectorAll('.navbar-drawer-link').forEach(function (a) {
        var href = a.getAttribute('href').replace('#', '');
        a.className = 'navbar-drawer-link' + (href === current ? ' active' : '');
    });
}

// ===== Mobile Menu =====
var mobileOpen = false;
function toggleMobile() {
    mobileOpen = !mobileOpen;
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    var overlay = document.getElementById('navOverlay');
    toggle.className = 'navbar-toggle' + (mobileOpen ? ' open' : '');
    toggle.setAttribute('aria-expanded', mobileOpen);
    drawer.className = 'navbar-drawer' + (mobileOpen ? ' open' : '');
    drawer.setAttribute('aria-hidden', !mobileOpen);
    overlay.className = 'navbar-overlay' + (mobileOpen ? ' open' : '');
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
}
function closeMobile() {
    if (mobileOpen) toggleMobile();
}
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMobile();
});

// ===== Scroll Progress =====
var progressBar = document.getElementById('scrollProgress');
var backToTop = document.getElementById('backToTop');

function onScroll() {
    updateNavbar();
    var scrollTop = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var prog = docH > 0 ? scrollTop / docH : 0;
    progressBar.style.transform = 'scaleX(' + prog + ')';
    backToTop.className = 'back-to-top' + (scrollTop > 400 ? ' visible' : '');
    checkStats();
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Reveal Animations =====
var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function initReveal() {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(function (el) {
        revealObserver.observe(el);
    });
}
initReveal();

// ===== Particles =====
var pContainer = document.getElementById('heroParticles');
for (var i = 0; i < 18; i++) {
    var p = document.createElement('div');
    p.className = 'particle';
    var size = Math.random() * 6 + 3;
    var x = Math.random() * 100;
    var dur = Math.random() * 12 + 8;
    var delay = Math.random() * 8;
    p.style.cssText = 'width:' + size + 'px;height:' + size + 'px;right:' + x + '%;bottom:-10px;animation-duration:' + dur + 's;animation-delay:' + delay + 's;background:rgba(232,160,32,' + (Math.random() * 0.4 + 0.1) + ');';
    pContainer.appendChild(p);
}

// ===== Stats Counter =====
var statTargets = [20, 500, 180, 30];
var statSuffixes = ['+', '+', '+', '+'];
var statsStarted = false;

function checkStats() {
    if (statsStarted) return;
    var el = document.getElementById('statsSection');
    if (!el) return;
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.7) {
        statsStarted = true;
        statTargets.forEach(function (target, i) {
            animateCount('stat' + i, target, statSuffixes[i]);
        });
    }
}

function animateCount(id, target, suffix) {
    var el = document.getElementById(id);
    if (!el) return;
    var start = 0;
    var duration = 2000;
    var step = target / (duration / 16);
    var timer = setInterval(function () {
        start += step;
        if (start >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start) + suffix;
        }
    }, 16);
}

// ===== Project Filter =====
function filterProjects(cat, btn) {
    document.querySelectorAll('.project-filter-btn').forEach(function (b) { b.className = 'project-filter-btn'; });
    btn.className = 'project-filter-btn active';
    document.querySelectorAll('#projectsGrid .project-card').forEach(function (card) {
        if (cat === 'همه' || card.getAttribute('data-cat') === cat) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Contact Form =====
document.getElementById('fmessage') && document.getElementById('fmessage').addEventListener('input', function () {
    document.getElementById('charCount').textContent = this.value.length + '/۱۰۰۰';
});

function submitForm() {
    var name = document.getElementById('fname').value.trim();
    var phone = document.getElementById('fphone').value.trim();
    var email = document.getElementById('femail').value.trim();
    var subject = document.getElementById('fsubject').value;
    var message = document.getElementById('fmessage').value.trim();
    var valid = true;

    function showErr(id, msg) { var el = document.getElementById(id); el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
    function clearErr(id) { showErr(id, ''); }

    clearErr('fnameErr'); clearErr('fphoneErr'); clearErr('femailErr'); clearErr('fsubjectErr'); clearErr('fmessageErr');

    if (!name || name.length < 2) { showErr('fnameErr', 'نام الزامی است (حداقل ۲ کاراکتر)'); document.getElementById('fname').classList.add('error'); valid = false; }
    else document.getElementById('fname').classList.remove('error');

    if (!phone) { showErr('fphoneErr', 'شماره تماس الزامی است'); document.getElementById('fphone').classList.add('error'); valid = false; }
    else document.getElementById('fphone').classList.remove('error');

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('femailErr', 'آدرس ایمیل معتبر نیست'); document.getElementById('femail').classList.add('error'); valid = false; }
    else document.getElementById('femail').classList.remove('error');

    if (!subject) { showErr('fsubjectErr', 'موضوع الزامی است'); document.getElementById('fsubject').classList.add('error'); valid = false; }
    else document.getElementById('fsubject').classList.remove('error');

    if (!message || message.length < 10) { showErr('fmessageErr', 'پیام الزامی است (حداقل ۱۰ کاراکتر)'); document.getElementById('fmessage').classList.add('error'); valid = false; }
    else document.getElementById('fmessage').classList.remove('error');

    if (!valid) return;

    var btn = document.getElementById('formSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '⏳ در حال ارسال...';

    setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = '📤 ارسال پیام';
        document.getElementById('fname').value = '';
        document.getElementById('fphone').value = '';
        document.getElementById('femail').value = '';
        document.getElementById('fsubject').value = '';
        document.getElementById('fmessage').value = '';
        document.getElementById('charCount').textContent = '0/۱۰۰۰';
        var suc = document.getElementById('formSuccess');
        suc.className = 'form-success show';
        setTimeout(function () { suc.className = 'form-success'; }, 5000);
    }, 1500);
}

// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

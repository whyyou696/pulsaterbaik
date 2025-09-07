 // ====== Countdown logic (bulan, hari, jam, menit, detik) ======
      //  sesuaikan tanggal peluncuran di sini (format: ISO string w/ offset) -- saat ini: 1 Des 2025 00:00 WIB
      const launchDate = new Date("2025-12-01T00:00:00+07:00");


      // Loader hilang setelah halaman siap
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hide");
  }, 800); // delay sedikit biar smooth
});


      function computeMonthsDays(now, target) {
        // months = full month differences
        let months =
          (target.getFullYear() - now.getFullYear()) * 12 +
          (target.getMonth() - now.getMonth());
        // create candidate date by adding months to now
        const candidate = new Date(now.getTime());
        candidate.setMonth(candidate.getMonth() + months);
        // adjust if candidate > target (went too far)
        while (candidate > target) {
          months -= 1;
          candidate.setMonth(candidate.getMonth() - 1);
        }
        // compute remaining ms after removing months
        let remaining = target - candidate;
        if (remaining < 0) {
          remaining = 0;
        }
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        remaining -= days * (1000 * 60 * 60 * 24);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        remaining -= hours * (1000 * 60 * 60);
        const minutes = Math.floor(remaining / (1000 * 60));
        remaining -= minutes * (1000 * 60);
        const seconds = Math.floor(remaining / 1000);
        return { months, days, hours, minutes, seconds };
      }

      function pad(n) {
        return String(n).padStart(2, "0");
      }

      function updateCountdown() {
        const now = new Date();
        if (now >= launchDate) {
          document
            .getElementById("months")
            .querySelector(".value").textContent = "0";
          document.getElementById("days").querySelector(".value").textContent =
            "0";
          document.getElementById("hours").querySelector(".value").textContent =
            "00";
          document
            .getElementById("minutes")
            .querySelector(".value").textContent = "00";
          document
            .getElementById("seconds")
            .querySelector(".value").textContent = "00";
          return;
        }
        const parts = computeMonthsDays(now, launchDate);
        document.getElementById("months").querySelector(".value").textContent =
          parts.months;
        document.getElementById("days").querySelector(".value").textContent =
          parts.days;
        document.getElementById("hours").querySelector(".value").textContent =
          pad(parts.hours);
        document.getElementById("minutes").querySelector(".value").textContent =
          pad(parts.minutes);
        document.getElementById("seconds").querySelector(".value").textContent =
          pad(parts.seconds);
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);

      // Simple Parallax (keeps previous parallax behavior)
      const layers = document.querySelectorAll(".layer");
      const lerp = (a, b, t) => a + (b - a) * t;
      const state = new Map();
      function applyParallax() {
        layers.forEach((el) => {
          const depth = parseFloat(el.dataset.depth || 0);
          const target = state.get(el) || { x: 0, y: 0, sY: 0 };
          const cur = el._cur || { x: 0, y: 0, sY: 0 };
          cur.x = lerp(cur.x, target.x * depth, 0.08);
          cur.y = lerp(cur.y, target.y * depth, 0.08);
          cur.sY = lerp(cur.sY, (window.scrollY || 0) * depth * 0.03, 0.08);
          el.style.transform = `translate3d(${cur.x}px, ${
            cur.y + cur.sY
          }px, 0)`;
          el._cur = cur;
        });
        requestAnimationFrame(applyParallax);
      }
      window.addEventListener(
        "mousemove",
        (e) => {
          const cx = window.innerWidth / 2,
            cy = window.innerHeight / 2;
          const dx = (e.clientX - cx) / cx;
          const dy = (e.clientY - cy) / cy;
          layers.forEach((el) =>
            state.set(el, { x: dx * 20, y: dy * 12, sY: window.scrollY || 0 })
          );
        },
        { passive: true }
      );
      window.addEventListener(
        "scroll",
        () => {
          layers.forEach((el) => {
            const t = state.get(el) || { x: 0, y: 0, sY: 0 };
            state.set(el, { ...t, sY: window.scrollY || 0 });
          });
        },
        { passive: true }
      );
      requestAnimationFrame(applyParallax);

      // Toast
      document.getElementById("notifyBtn").addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById("toastInner");
        el.style.display = "inline-block";
        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => {
          el.style.display = "none";
        }, 4000);
      });
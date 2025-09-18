const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "fas fa-tachometer-alt",
    href: "index.html",
    paths: ["index.html", "/", ""],
  },
  {
    id: "history",
    label: "Equipment History",
    icon: "fas fa-history",
    href: "history.html",
    paths: ["history.html", "pages/history.html"],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "fas fa-calendar-alt",
    href: "calendar.html",
    paths: ["calendar.html", "pages/calendar.html"],
  },
];

const navbarContainerEle = document.getElementById("app-navbar");

function navbar() {
  const path = window.location.pathname;
  const isRootLevel =
    path.includes("index") || path === "/" || path.endsWith("/");

  //Getting the Active Link
  const activeItem =
    navItems.find((item) => path.includes(item.id)) || navItems[0]; // Default to dashboard

  // Generate nav items HTML
  const navItemsHTML = navItems
    .map((item) => {
      const isActive = item.id === activeItem.id;
      const href = isRootLevel
        ? item.href === "index.html"
          ? item.href
          : `pages/${item.href}`
        : item.href === "index.html"
        ? `../${item.href}`
        : `./${item.href}`;

      return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? "active" : ""}" href="${href}">
          <i class="${item.icon} me-1"></i>${item.label}
        </a>
      </li>
    `;
    })
    .join("");

  // Brand href logic
  const brandHref = isRootLevel ? "index.html" : "../index.html";

  const navbarEle = document.createElement("section");
  navbarEle.classList.add("container-fluid");
  navbarEle.innerHTML = `
    <a class="navbar-brand fw-bold" href="${brandHref}">
      <i class="fas fa-hard-hat me-2"></i>SWES
    </a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <section class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto">
        ${navItemsHTML}
      </ul>
    </section>
  `;

  navbarContainerEle.appendChild(navbarEle);
}

navbar();
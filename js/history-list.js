/* 
2. List View: Equipment Overview & History (UC-R5)
Display the employee’s equipment and reservation history as a responsive table.
Include visual status indicators per row (e.g., Returned, Pending).
Add full table interactivity with the following UI components:
Filter Components
--
Date Range Picker – filter from Start Date to End Date .
Item Type Dropdown – filter by item category (e.g., Boots, Vest, Helmet).
Status Selector – checkbox group (Returned, Pending, Overdue).
Search Input – full-text search using the employee name or item ID.
--
Paging and Sorting
Pagination Controls – with selectable page size (10/25/50 rows).
Sortable Headers – for each column: Date, Item Name, Status, Return Date.
--
UX Enhancements
Sticky Header for table navigation.
Responsive Design – collapses into cards on mobile.
Loading Spinner during data fetch.
Empty State message when no data is found.


*/

const sampleData = [
  {
    date: "2024-09-15",
    employee: "John Smith",
    itemId: "EQ-001",
    itemName: "Safety Helmet Pro",
    type: "Helmet",
    status: "Returned",
    returnDate: "2024-09-20",
  },
  {
    date: "2024-09-14",
    employee: "Sarah Johnson",
    itemId: "EQ-002",
    itemName: "Steel Toe Boots",
    type: "Boots",
    status: "Pending",
    returnDate: "2024-09-25",
  },
  {
    date: "2024-09-13",
    employee: "Mike Davis",
    itemId: "EQ-003",
    itemName: "High-Vis Vest",
    type: "Vest",
    status: "Overdue",
    returnDate: "2024-09-18",
  },
  {
    date: "2024-09-12",
    employee: "Lisa Wong",
    itemId: "EQ-004",
    itemName: "Work Gloves Heavy Duty",
    type: "Gloves",
    status: "Returned",
    returnDate: "2024-09-17",
  },
  {
    date: "2024-09-11",
    employee: "Robert Brown",
    itemId: "EQ-005",
    itemName: "Safety Goggles",
    type: "Goggles",
    status: "Pending",
    returnDate: "2024-09-22",
  },
  {
    date: "2024-09-10",
    employee: "Emma Wilson",
    itemId: "EQ-006",
    itemName: "Construction Helmet",
    type: "Helmet",
    status: "Returned",
    returnDate: "2024-09-16",
  },
  {
    date: "2024-09-09",
    employee: "James Taylor",
    itemId: "EQ-007",
    itemName: "Leather Work Boots",
    type: "Boots",
    status: "Overdue",
    returnDate: "2024-09-15",
  },
  {
    date: "2024-09-08",
    employee: "Maria Garcia",
    itemId: "EQ-008",
    itemName: "Reflective Vest",
    type: "Vest",
    status: "Pending",
    returnDate: "2024-09-24",
  },
  {
    date: "2024-09-07",
    employee: "David Miller",
    itemId: "EQ-009",
    itemName: "Cut-Resistant Gloves",
    type: "Gloves",
    status: "Returned",
    returnDate: "2024-09-14",
  },
  {
    date: "2024-09-06",
    employee: "Jennifer Lee",
    itemId: "EQ-010",
    itemName: "Welding Helmet",
    type: "Helmet",
    status: "Pending",
    returnDate: "2024-09-21",
  },
  {
    date: "2024-09-05",
    employee: "Thomas Anderson",
    itemId: "EQ-011",
    itemName: "Composite Toe Boots",
    type: "Boots",
    status: "Returned",
    returnDate: "2024-09-12",
  },
  {
    date: "2024-09-04",
    employee: "Jessica Chen",
    itemId: "EQ-012",
    itemName: "Cooling Vest",
    type: "Vest",
    status: "Overdue",
    returnDate: "2024-09-10",
  },
  {
    date: "2024-09-03",
    employee: "Michael Johnson",
    itemId: "EQ-013",
    itemName: "Chemical-Resistant Gloves",
    type: "Gloves",
    status: "Returned",
    returnDate: "2024-09-08",
  },
  {
    date: "2024-09-02",
    employee: "Ashley White",
    itemId: "EQ-014",
    itemName: "Anti-Fog Goggles",
    type: "Goggles",
    status: "Pending",
    returnDate: "2024-09-23",
  },
  {
    date: "2024-09-01",
    employee: "Christopher Davis",
    itemId: "EQ-015",
    itemName: "Bump Cap",
    type: "Helmet",
    status: "Returned",
    returnDate: "2024-09-07",
  },
];

// Application state
let filteredData = [...sampleData];
let currentPage = 1;
let pageSize = 10;
let sortColumn = "date";
let sortDirection = "desc";

// DOM elements
const tableBody = document.getElementById("tableBody");
const mobileCards = document.getElementById("mobileCards");
const pagination = document.getElementById("pagination");
const paginationInfo = document.getElementById("paginationInfo");
const loadingSpinner = document.querySelector(".loading-spinner");
const emptyState = document.querySelector(".empty-state");

// Filter elements
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const itemTypeFilter = document.getElementById("itemTypeFilter");
const searchInput = document.getElementById("searchInput");
const pageSelector = document.getElementById("pageSize");
const statusCheckboxes = document.querySelectorAll(
  'input[type="checkbox"][id^="status"]'
);

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  showLoading();
  setTimeout(() => {
    hideLoading();
    applyFilters();
  }, 1000);
});

// Event listeners
startDate.addEventListener("change", applyFilters);
endDate.addEventListener("change", applyFilters);
itemTypeFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", debounce(applyFilters, 300));
pageSelector.addEventListener("change", (e) => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  applyFilters();
});

statusCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", applyFilters);
});

document.getElementById("clearFilters").addEventListener("click", clearFilters);

// Sortable headers
document.querySelectorAll(".sortable-header").forEach((header) => {
  header.addEventListener("click", (e) => {
    const column = e.currentTarget.getAttribute("data-sort");
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
    updateSortIcons();
    applyFilters();
  });
});

function showLoading() {
  loadingSpinner.style.display = "block";
  document.querySelector(".table-responsive-stack").style.display = "none";
  mobileCards.style.display = "none";
  emptyState.style.display = "none";
}

function hideLoading() {
  loadingSpinner.style.display = "none";
}

function showEmptyState() {
  emptyState.style.display = "block";
  document.querySelector(".table-responsive-stack").style.display = "none";
  mobileCards.style.display = "none";
}

function hideEmptyState() {
  emptyState.style.display = "none";
  document.querySelector(".table-responsive-stack").style.display = "block";
  if (window.innerWidth <= 768) {
    mobileCards.style.display = "block";
    document.querySelector(".table-responsive-stack").style.display = "none";
  }
}

function applyFilters() {
  const startDateValue = startDate.value;
  const endDateValue = endDate.value;
  const itemType = itemTypeFilter.value;
  const searchTerm = searchInput.value.toLowerCase();
  const selectedStatuses = Array.from(statusCheckboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  filteredData = sampleData.filter((item) => {
    // Date range filter
    if (startDateValue && item.date < startDateValue) return false;
    if (endDateValue && item.date > endDateValue) return false;

    // Item type filter
    if (itemType && item.type !== itemType) return false;

    // Status filter
    if (!selectedStatuses.includes(item.status)) return false;

    // Search filter
    if (
      searchTerm &&
      !item.employee.toLowerCase().includes(searchTerm) &&
      !item.itemId.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }

    return true;
  });

  // Sort data
  sortData();

  // Reset to first page
  currentPage = 1;

  if (filteredData.length === 0) {
    showEmptyState();
  } else {
    hideEmptyState();
    renderTable();
    renderMobileCards();
    renderPagination();
  }
}

function sortData() {
  filteredData.sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    // Convert dates to Date objects for proper sorting
    if (sortColumn === "date" || sortColumn === "returnDate") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

function updateSortIcons() {
  document.querySelectorAll(".sort-icon").forEach((icon) => {
    icon.className = "fas fa-sort sort-icon";
  });

  const activeHeader = document.querySelector(
    `[data-sort="${sortColumn}"] .sort-icon`
  );
  if (activeHeader) {
    activeHeader.className = `fas fa-sort-${
      sortDirection === "asc" ? "up" : "down"
    } sort-icon active`;
  }
}

function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredData.slice(start, end);

  tableBody.innerHTML = pageData
    .map((item) => {
      const statusClass = `status-${item.status.toLowerCase()}`;
      const isOverdue = item.status === "Overdue";
      const statusIcon =
        item.status === "Returned"
          ? "fa-check-circle"
          : item.status === "Pending"
          ? "fa-clock"
          : "fa-exclamation-triangle";

      return `
                    <tr>
                        <td>${formatDate(item.date)}</td>
                        <td><strong>${item.employee}</strong></td>
                        <td><code>${item.itemId}</code></td>
                        <td>${item.itemName}</td>
                        <td><span class="badge bg-secondary">${
                          item.type
                        }</span></td>
                        <td>
                            <span class="status-badge ${statusClass}">
                                <i class="fas ${statusIcon} me-1"></i>
                                ${item.status}
                            </span>
                        </td>
                        <td>${formatDate(item.returnDate)} ${
        isOverdue
          ? '<i class="fas fa-exclamation-triangle text-danger ms-1"></i>'
          : ""
      }</td>
                    </tr>
                `;
    })
    .join("");
}

function renderMobileCards() {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredData.slice(start, end);

  mobileCards.innerHTML = pageData
    .map((item) => {
      const statusClass = `status-${item.status.toLowerCase()}`;
      const isOverdue = item.status === "Overdue";
      const statusIcon =
        item.status === "Returned"
          ? "fa-check-circle"
          : item.status === "Pending"
          ? "fa-clock"
          : "fa-exclamation-triangle";

      return `
                    <div class="equipment-card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <span><strong>${item.employee}</strong></span>
                                <span class="status-badge ${statusClass}">
                                    <i class="fas ${statusIcon} me-1"></i>
                                    ${item.status}
                                </span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="card-row">
                                <span class="card-label">Item ID:</span>
                                <span><code>${item.itemId}</code></span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Item Name:</span>
                                <span>${item.itemName}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Type:</span>
                                <span><span class="badge bg-secondary">${
                                  item.type
                                }</span></span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Date:</span>
                                <span>${formatDate(item.date)}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Return Date:</span>
                                <span>${formatDate(item.returnDate)} ${
        isOverdue
          ? '<i class="fas fa-exclamation-triangle text-danger ms-1"></i>'
          : ""
      }</span>
                            </div>
                        </div>
                    </div>
                `;
    })
    .join("");
}

function renderPagination() {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(start + pageSize - 1, filteredData.length);

  // Update pagination info
  paginationInfo.textContent = `Showing ${start}-${end} of ${filteredData.length} results`;

  // Generate pagination buttons
  let paginationHTML = "";

  // Previous button
  paginationHTML += `
                <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="changePage(${
                      currentPage - 1
                    })">
                        <i class="fas fa-chevron-left"></i>
                    </a>
                </li>
            `;

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
    if (startPage > 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
                    <li class="page-item ${i === currentPage ? "active" : ""}">
                        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                    </li>
                `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
  }

  // Next button
  paginationHTML += `
                <li class="page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }">
                    <a class="page-link" href="#" onclick="changePage(${
                      currentPage + 1
                    })">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;

  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / pageSize);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    renderTable();
    renderMobileCards();
    renderPagination();
  }
}

function clearFilters() {
  startDate.value = "";
  endDate.value = "";
  itemTypeFilter.value = "";
  searchInput.value = "";
  pageSelector.value = "10";
  pageSize = 10;

  statusCheckboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  applyFilters();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  if (filteredData.length > 0) {
    hideEmptyState();
  }
});

// Initialize sort icons
updateSortIcons();

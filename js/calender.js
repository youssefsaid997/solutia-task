console.log("calender");

/*
3. Calendar View: Available Dates (UC-R12)
Display a monthly calendar UI.
Highlight available and unavailable days.
Support click to "pre-fill" the reservation form.

*/

// Calendar Application
class CalendarApp {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.availabilityData = new Map();
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.generateAvailabilityData();
    this.renderCalendar();
  }

  bindEvents() {
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    document.getElementById("preFlillFormBtn").addEventListener("click", () => {
      this.preFillReservationForm();
    });
  }

  generateAvailabilityData() {
    // Generate mock availability data for the current month and surrounding months
    const startDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    const endDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 2,
      0
    );

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = this.formatDateKey(d);
      const random = Math.random();

      // Past dates are unavailable
      if (d < new Date().setHours(0, 0, 0, 0)) {
        this.availabilityData.set(dateKey, {
          status: "unavailable",
          equipment: 0,
        });
      } else {
        // Future dates have random availability
        if (random < 0.6) {
          this.availabilityData.set(dateKey, {
            status: "available",
            equipment: Math.floor(Math.random() * 10) + 5,
          });
        } else if (random < 0.8) {
          this.availabilityData.set(dateKey, {
            status: "partial",
            equipment: Math.floor(Math.random() * 3) + 1,
          });
        } else {
          this.availabilityData.set(dateKey, {
            status: "unavailable",
            equipment: 0,
          });
        }
      }
    }
  }

  formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  }

  renderCalendar() {
    this.showLoading();

    // Simulate API call delay
    setTimeout(() => {
      this.updateCalendarHeader();
      this.generateCalendarDays();
      this.hideLoading();
    }, 500);
  }

  showLoading() {
    document.getElementById("loadingOverlay").classList.remove("d-none");
  }

  hideLoading() {
    document.getElementById("loadingOverlay").classList.add("d-none");
  }

  updateCalendarHeader() {
    const monthTitle = document.getElementById("monthTitle");
    monthTitle.textContent = `${
      this.monthNames[this.currentDate.getMonth()]
    } ${this.currentDate.getFullYear()}`;
  }

  generateCalendarDays() {
    const calendarBody = document.getElementById("calendarBody");
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get today for comparison
    const today = new Date();
    const todayKey = this.formatDateKey(today);

    let calendarHTML = "";
    let dayCount = 1;

    // Generate calendar rows (6 weeks maximum)
    for (let week = 0; week < 6; week++) {
      calendarHTML += "<tr>";

      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (week === 0 && dayOfWeek < startingDayOfWeek) {
          // Empty cells before first day of month
          calendarHTML += '<td class="day-disabled"></td>';
        } else if (dayCount > daysInMonth) {
          // Empty cells after last day of month
          calendarHTML += '<td class="day-disabled"></td>';
        } else {
          // Actual calendar day
          const currentDay = new Date(year, month, dayCount);
          const dateKey = this.formatDateKey(currentDay);
          const availability = this.availabilityData.get(dateKey) || {
            status: "unavailable",
            equipment: 0,
          };

          let dayClass = "";
          let statusText = "";

          if (dateKey === todayKey) {
            dayClass = "day-today";
            statusText = "Today";
          } else {
            switch (availability.status) {
              case "available":
                dayClass = "day-available";
                statusText = `${availability.equipment} available`;
                break;
              case "partial":
                dayClass = "day-partial";
                statusText = `${availability.equipment} left`;
                break;
              case "unavailable":
                dayClass = "day-unavailable";
                statusText = "Full";
                break;
            }
          }

          calendarHTML += `
                  <td class="${dayClass}" data-date="${dateKey}" onclick="calendar.selectDate('${dateKey}')">
                    <div class="day-number">${dayCount}</div>
                    <div class="day-status">${statusText}</div>
                  </td>
                `;

          dayCount++;
        }
      }

      calendarHTML += "</tr>";

      // Break if we've shown all days
      if (dayCount > daysInMonth) break;
    }

    calendarBody.innerHTML = calendarHTML;
  }

  selectDate(dateKey) {
    // Remove previous selection
    document.querySelectorAll(".calendar-table td").forEach((td) => {
      td.classList.remove("selected");
    });

    // Add selection to clicked date
    const selectedTd = document.querySelector(`[data-date="${dateKey}"]`);
    if (selectedTd && !selectedTd.classList.contains("day-disabled")) {
      selectedTd.style.background = "#007bff";
      selectedTd.style.color = "white";
      this.selectedDate = dateKey;
      this.showSelectedDateInfo(dateKey);
    }
  }

  showSelectedDateInfo(dateKey) {
    const selectedDateInfo = document.getElementById("selectedDateInfo");
    const selectedDateText = document.getElementById("selectedDateText");
    const availabilityText = document.getElementById("availabilityText");

    const date = new Date(dateKey);
    const availability = this.availabilityData.get(dateKey);

    selectedDateText.textContent = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let statusMessage = "";
    let buttonDisabled = false;

    switch (availability.status) {
      case "available":
        statusMessage = `✅ Equipment available: ${availability.equipment} items in stock`;
        break;
      case "partial":
        statusMessage = `⚠️ Limited availability: ${availability.equipment} items remaining`;
        break;
      case "unavailable":
        statusMessage = "❌ No equipment available for this date";
        buttonDisabled = true;
        break;
    }

    availabilityText.textContent = statusMessage;

    const button = document.getElementById("preFlillFormBtn");
    button.disabled = buttonDisabled;

    selectedDateInfo.classList.remove("d-none");
  }

  preFillReservationForm() {
    if (this.selectedDate) {
      // Navigate to form page with pre-filled date
      const url = window.location.pathname.includes("pages/")
        ? "../index.html"
        : "index.html";

      // Store selected date in localStorage for form pre-filling
      localStorage.setItem("prefilledDate", this.selectedDate);
      window.location.href = `${url}?date=${this.selectedDate}`;
    }
  }
}

// Initialize calendar
const calendar = new CalendarApp();

// import "./form.js"
console.log("hello from main");

const activityItemsRef = document.getElementById("activity-items");
let isActivitiesLoading = false;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    isActivitiesLoading = true;
    activityItemsRef.innerHTML = `<h3>Loading .... </h3>`;
    const data = await getActivities();

    activityItemsRef.innerHTML = `${data.map((item) => {
      return `<article class="activity-item d-flex mb-2">
          <figure class="activity-icon me-2">
            <span class="badge ${item.badge}">
              <i class="${item.icon}"></i>
            </span>
          </figure>
          <section class="activity-content mx-2">
            <time class="text-muted small">${item.time}</time>
            <p class="mb-0">${item.text}</p>
          </section>
        </article>`;
    })}`;
  } catch (error) {
    console.error(error);
  } finally {
    isActivitiesLoading = false;
  }
});

function initMiniCalendar() {
  const calendarEl = document.getElementById("miniCalendar");
  const currentMonthEl = document.getElementById("currentMonth");

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Set current month text
  const monthNames = [
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
  currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // Generate calendar HTML
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  let calendarHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
            `;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    calendarHTML += '<td class="disabled"></td>';
  }

  // Add cells for each day of the month
  let dayCount = startingDay;
  for (let day = 1; day <= daysInMonth; day++) {
    if (dayCount % 7 === 0 && day !== 1) {
      calendarHTML += "</tr><tr>";
    }

    // Randomly assign availability status for demo purposes
    const status = Math.random();
    let statusClass = "";

    if (day === today.getDate() && currentMonth === today.getMonth()) {
      statusClass = "today";
    } else if (status < 0.6) {
      statusClass = "available";
    } else if (status < 0.8) {
      statusClass = "partial";
    } else {
      statusClass = "unavailable";
    }

    calendarHTML += `<td class="${statusClass}">${day}</td>`;
    dayCount++;
  }

  // Add empty cells for remaining days in the last week
  while (dayCount % 7 !== 0) {
    calendarHTML += '<td class="disabled"></td>';
    dayCount++;
  }

  calendarHTML += `
                    </tr>
                </tbody>
            </table>
            `;

  calendarEl.innerHTML = calendarHTML;
}

function addRecentActivity(equipmentName) {
  const activityFeed = document.querySelector(
    ".card-body .activity-item:first-child"
  ).parentNode;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newActivity = document.createElement("article");
  newActivity.className = "activity-item d-flex mb-2";
  newActivity.innerHTML = `
                <figure class="activity-icon me-3">
                    <span class="badge bg-success rounded-circle">
                        <i class="fas fa-plus"></i>
                    </span>
                </figure>
                <section class="activity-content">
                    <time class="text-muted small">${timeString}</time>
                    <p class="mb-0">Reservation created for ${equipmentName}</p>
                </section>
            `;

  activityFeed.insertBefore(newActivity, activityFeed.firstChild);

  // If there are more than 4 activities, remove the last one
  if (activityFeed.children.length > 4) {
    activityFeed.removeChild(activityFeed.lastChild);
  }
}

/* 

// we will extract data from there 
              
<article class="activity-item d-flex mb-2">
                <figure class="activity-icon me-3">
                  <span class="badge bg-success rounded-circle">
                    <i class="fas fa-plus"></i>
                  </span>
                </figure>
                <section class="activity-content">
                  <time class="text-muted small">10:30 AM</time>
                  <p class="mb-0">Reservation created for Safety Boots</p>
                </section>
              </article>

*/

// here we will have the main page component for the syste, we will make a nav-bar with bootstrap
// then we will make the navigation to detect the url to get the active state for the nav-bar
// then we will build the form and its loading and (success and error) systems
// then we will add the functionality of submission using fetch() post== use prevent
//

const mockActivities = [
  {
    time: "10:30 AM",
    text: "Reservation created for Safety Boots",
    icon: "fas fa-plus",
    badge: "bg-success",
  },
  {
    time: "09:45 AM",
    text: "Equipment returned - Hard Hat",
    icon: "fas fa-edit",
    badge: "bg-warning",
  },
  {
    time: "Yesterday, 3:22 PM",
    text: "Reservation canceled - Safety Vest",
    icon: "fas fa-times",
    badge: "bg-danger",
  },
  {
    time: "Yesterday, 10:15 AM",
    text: "Equipment maintenance scheduled",
    icon: "fas fa-sync",
    badge: "bg-primary",
  },
];

async function getActivities() {
  try {
    const activities = await mockRequest(mockActivities, 1500);

    return activities;
  } catch (error) {
    console.error(error);
  }
}

function mockRequest(data, delay = 1000, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Mock request failed"));
      } else {
        resolve(data);
      }
    }, delay);
  });
}

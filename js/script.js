/* 

Create Reservation Form (UC-R1)

Employee ID input field
Equipment dropdown (Boots, Vest, Helmet, Gloves, Glasses, Coveralls)
Date picker for reservation date
Client-side validation (required fields, future date only)
Submit button that calls POST /api/reservations


Mini Calendar Widget

Current month view in grid format
Available dates (green), unavailable (red), today (blue)
Click on date auto-fills the reservation form date picker
Previous/Next month navigation


Recent Activity Feed

Last 5-10 recent reservations/returns
Time stamps and activity descriptions


Quick Stats Cards

Active Reservations count
Pending Returns count
Available Items count


/// component tree
Dashboard
├── Header
│   ├── Navigation
│   │   ├── Brand Logo
│   │   ├── NavMenu
│   │   │   ├── Dashboard Link (active)
│   │   │   ├── Equipment History Link
│   │   │   └── Calendar Link
│   └── MobileToggle
├── Main Content
│   ├── LeftColumn
│   │   ├── CreateReservationCard
│   │   │   ├── CardHeader (title + icon)
│   │   │   └── ReservationForm
│   │   │       ├── EmployeeIdField
│   │   │       ├── EquipmentDropdown
│   │   │       ├── DatePicker
│   │   │       ├── NotesTextarea
│   │   │       └── SubmitButton
│   │   └── RecentActivityCard
│   │       ├── CardHeader
│   │       └── ActivityList
│   │           ├── ActivityItem (timestamp + description)
│   │           └── ActivityItem (...)
│   └── RightColumn
│       ├── MiniCalendarCard
│       │   ├── CalendarHeader
│       │   │   ├── MonthTitle
│       │   │   └── NavigationButtons (prev/next)
│       │   ├── CalendarGrid
│       │   │   ├── WeekdayHeaders
│       │   │   └── DateCells (with availability colors)
│       │   └── CalendarLegend
│       └── QuickStatsRow
│           ├── ActiveReservationsCard
│           ├── PendingReturnsCard
│           └── AvailableItemsCard
└── ToastNotifications
    ├── SuccessToast
    └── ErrorToast

*/
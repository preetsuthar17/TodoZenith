// const reminderDialog = document.getElementById("reminderDialog");
// const openReminderBtn = document.getElementById("openReminderDialog");
// const cancelReminderBtn = document.getElementById("cancelReminderBtn");
// const saveReminderBtn = document.getElementById("saveReminderBtn");
// const reminderList = document.getElementById("reminderList");

// const reminderFormWarning1 = document.getElementById("reminder-form-warning1");
// const reminderFormWarning2 = document.getElementById("reminder-form-warning2");

// let reminders = [];

// function updateReminderList() {
//   reminderList.innerHTML = "";
//   for (let i = 0; i < reminders.length; i++) {
//     const reminder = reminders[i];
//     const formattedReminderTime = formatReminderTime(reminder.time);
//     const listItem = `
//       <li class="reminder-card w-full p-4 mb-2 flex justify-between flex-col items-left rounded-lg mt-5">
//         <div>
//           <p class="text-xl h-color">${reminder.name}</p>
//           <p class="text-base p-color">${formattedReminderTime}</p>
//         </div>
//         <div>
//           <button class="btn edit-reminder text-base" data-index="${i}">Edit</button>
//           <button class="delete-btn font-normal ml-2 text-base delete-reminder" data-index="${i}">Delete</button>
//         </div>
//       </li>
//     `;
//     reminderList.insertAdjacentHTML("beforeend", listItem);
//   }
// }

// function formatReminderTime(time) {
//   const date = new Date(time);
//   const formattedDate = `${padWithZero(date.getDate())}/${padWithZero(
//     date.getMonth() + 1
//   )}/${date.getFullYear()}`;
//   const formattedTime = formatTimeWithAmPm(date.getHours(), date.getMinutes());
//   return `${formattedDate} - ${formattedTime}`;
// }

// function formatTimeWithAmPm(hours, minutes) {
//   const amPm = hours >= 12 ? "PM" : "AM";
//   const formattedHours = padWithZero(hours % 12 || 12);
//   const formattedMinutes = padWithZero(minutes);
//   return `${formattedHours}:${formattedMinutes} ${amPm}`;
// }

// function padWithZero(number) {
//   return number.toString().padStart(2, "0");
// }

// function editReminder(index) {
//   const reminder = reminders[index];
//   reminderName.value = reminder.name;
//   reminderTime.value = new Date(reminder.time).toISOString().slice(0, -1);
//   reminders.splice(index, 1);
//   updateReminderList();
//   reminderDialog.classList.remove("hidden");
// }

// function deleteReminder(index) {
//   reminders.splice(index, 1);
//   updateReminderList();
//   saveRemindersToLocalStorage();
// }

// function scheduleNotifications() {
//   const currentTime = new Date().getTime();

//   for (const reminder of reminders) {
//     const timeUntilReminder = reminder.time - currentTime;
//     const timeUntilReminderMinusHour = timeUntilReminder - 3600000;
//     const timeUntilReminderMinusTenMinutes = timeUntilReminder - 600000;
//     const timeUntilReminderMinusFiveMinutes = timeUntilReminder - 300000;

//     if (timeUntilReminderMinusHour > 0) {
//       setTimeout(() => {
//         sendPushNotification(`Reminder: ${reminder.name} - 1 hour before`);
//       }, timeUntilReminderMinusHour);
//     }

//     if (timeUntilReminderMinusTenMinutes > 0) {
//       setTimeout(() => {
//         sendPushNotification(
//           `10 Minutes left for your reminder: ${reminder.name} `
//         );
//       }, timeUntilReminderMinusTenMinutes);
//     }

//     if (timeUntilReminderMinusFiveMinutes > 0) {
//       setTimeout(() => {
//         sendPushNotification(
//           `5 Minutes left for your reminder: ${reminder.name}`
//         );
//       }, timeUntilReminderMinusFiveMinutes);
//     }

//     if (timeUntilReminder > 0) {
//       setTimeout(() => {
//         sendPushNotification(`It's time! ${reminder.name}`);
//       }, timeUntilReminder);
//     }
//   }
// }

// function showReminderNotification(message) {
//   const options = {
//     body: message,
//   };

//   new Notification("Ding dong! 🔔", options);
// }

// function sendPushNotification(message) {
//   if ("serviceWorker" in navigator && "PushManager" in window) {
//     navigator.serviceWorker.ready.then((registration) => {
//       registration.pushManager.getSubscription().then((subscription) => {
//         if (subscription) {
//           fetch("/send-push-notification", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               subscription: subscription,
//               message: message,
//             }),
//           });
//         }
//       });
//     });
//   }
// }

// function saveRemindersToLocalStorage() {
//   localStorage.setItem("reminders", JSON.stringify(reminders));
// }

// function loadRemindersFromLocalStorage() {
//   const storedReminders = localStorage.getItem("reminders");
//   if (storedReminders) {
//     reminders = JSON.parse(storedReminders);
//     updateReminderList();
//   }
// }

// // Events
// openReminderBtn.addEventListener("click", () => {
//   reminderDialog.classList.remove("hidden");
//   resetReminderForm();
// });

// cancelReminderBtn.addEventListener("click", () => {
//   reminderDialog.classList.add("hidden");
//   resetReminderForm();
// });

// saveReminderBtn.addEventListener("click", () => {
//   const name = reminderName.value;
//   const time = new Date(reminderTime.value).getTime();

//   if (!name) {
//     reminderFormWarning1.classList.remove("hidden");
//     reminderFormWarning2.classList.add("hidden");
//     return;
//   } else if (!time) {
//     reminderFormWarning1.classList.add("hidden");
//     reminderFormWarning2.classList.remove("hidden");
//     return;
//   }

//   const reminder = {
//     name: name,
//     time: time,
//   };

//   reminders.push(reminder);
//   saveRemindersToLocalStorage();
//   updateReminderList();
//   scheduleNotifications();

//   reminderFormWarning1.classList.add("hidden");
//   reminderFormWarning2.classList.add("hidden");

//   reminderDialog.classList.add("hidden");
//   resetReminderForm();
// });

// reminderList.addEventListener("click", (event) => {
//   const target = event.target;
//   if (target.classList.contains("edit-reminder")) {
//     const index = parseInt(target.dataset.index);
//     editReminder(index);
//   } else if (target.classList.contains("delete-reminder")) {
//     const index = parseInt(target.dataset.index);
//     deleteReminder(index);
//   }
// });

// function resetReminderForm() {
//   reminderName.value = "";
//   reminderTime.value = "";
// }

// function editReminder(index) {
//   const reminder = reminders[index];
//   reminderName.value = reminder.name;
//   reminderTime.value = new Date(reminder.time).toISOString().slice(0, -1);
//   reminders.splice(index, 1);
//   updateReminderList();
//   reminderDialog.classList.remove("hidden");
// }

// loadRemindersFromLocalStorage();
// scheduleNotifications();

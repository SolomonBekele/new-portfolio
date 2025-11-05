class DatePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentDate = new Date();
    this.selectedDate = null;
    this.open = false;
    this.render();
  }

  render() {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: relative;
        display: inline-block;
        font-family: Arial, sans-serif;
      }

      .input-group {
        display: flex;
        align-items: center;
      }

      input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px 0 0 4px;
        outline: none;
      }

      button {
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-left: none;
        background: #f4f4f4;
        cursor: pointer;
        border-radius: 0 4px 4px 0;
      }

      button:hover {
        background: #e0e0e0;
      }

      .calendar {
        position: absolute;
        top: 110%;
        left: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        padding: 10px;
        z-index: 10;
        display: none;
      }

      .calendar.open {
        display: block;
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .calendar-header span {
        font-weight: bold;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }

      .day {
        text-align: center;
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
      }

      .day:hover {
        background-color: #007bff;
        color: white;
      }

      .selected {
        background-color: #007bff;
        color: white;
      }

      .weekday {
        font-weight: bold;
        text-align: center;
      }
    `;

    this.shadowRoot.innerHTML = "";
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="input-group">
        <input type="text" id="date-input" placeholder="Select expiration date" readonly />
        <button id="toggle-btn" title="Open calendar">📅</button>
      </div>
      <div class="calendar">
        <div class="calendar-header">
          <button id="prev">&lt;</button>
          <span>${this.currentDate.toLocaleString("default", { month: "long" })} ${this.currentDate.getFullYear()}</span>
          <button id="next">&gt;</button>
        </div>
        <div class="calendar-grid">
          ${["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => `<div class="weekday">${d}</div>`).join("")}
        </div>
      </div>
    `;
    
    this.shadowRoot.append(style, container);
    this.renderDays();

    this.shadowRoot.getElementById("toggle-btn").addEventListener("click", () => this.toggleCalendar());
    this.shadowRoot.getElementById("prev").addEventListener("click", () => this.changeMonth(-1));
    this.shadowRoot.getElementById("next").addEventListener("click", () => this.changeMonth(1));

    // Close calendar when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        this.closeCalendar();
      }
    });
  }

  renderDays() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = this.shadowRoot.querySelector(".calendar-grid");
    grid.innerHTML = ["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => `<div class="weekday">${d}</div>`).join("");

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div");
      day.textContent = i;
      day.classList.add("day");
      if (
        this.selectedDate &&
        this.selectedDate.getDate() === i &&
        this.selectedDate.getMonth() === month &&
        this.selectedDate.getFullYear() === year
      ) {
        day.classList.add("selected");
      }
      day.addEventListener("click", () => this.selectDate(i));
      grid.appendChild(day);
    }
  }

  toggleCalendar() {
    this.open = !this.open;
    const calendar = this.shadowRoot.querySelector(".calendar");
    calendar.classList.toggle("open", this.open);
  }

  closeCalendar() {
    this.open = false;
    this.shadowRoot.querySelector(".calendar").classList.remove("open");
  }

  changeMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.renderDays();
    this.shadowRoot.querySelector(".calendar-header span").textContent =
      `${this.currentDate.toLocaleString("default", { month: "long" })} ${this.currentDate.getFullYear()}`;
  }

  selectDate(day) {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    const formatted = this.selectedDate.toISOString().split("T")[0];
    this.shadowRoot.getElementById("date-input").value = formatted;
    this.dispatchEvent(new CustomEvent("date-selected", {
      detail: this.selectedDate,
      bubbles: true,
      composed: true
    }));
    this.closeCalendar();
    this.renderDays();
  }
}

customElements.define("date-picker", DatePicker);

document.querySelector("date-picker#expiry-date").addEventListener("date-selected", (e) => {
  const selectedDate = e.detail.toISOString().split("T")[0];
//   console.log("Selected Expiration Date:", selectedDate);

  // Store in a hidden field for form submission
  let hiddenInput = document.getElementById("expiryDateHidden");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "expiryDate";
    hiddenInput.id = "expiryDateHidden";
    document.getElementById("editForm").appendChild(hiddenInput);
  }
  hiddenInput.value = selectedDate;
});



// class DatePicker extends HTMLElement {
//   constructor() {
//     super();

//     // Create shadow root (isolates each instance)
//     const shadow = this.attachShadow({ mode: "open" });

//     // Create wrapper and inner HTML
//     const wrapper = document.createElement("div");
//     wrapper.innerHTML = `
//       <style>
//         .calendar-container {
//           position: relative;
//           display: inline-block;
//           width: 100%;
//         }

//         input[type="date"] {
//           padding: 8px;
//           width: 100%;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//           font-size: 14px;
//         }

//         input[type="date"]:focus {
//           outline: none;
//           border-color: #007bff;
//           box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
//         }
//       </style>

//       <div class="calendar-container">
//         <input type="date" id="dateInput" />
//       </div>
//     `;

//     shadow.appendChild(wrapper);

//     // Store selected date
//     const dateInput = shadow.querySelector("#dateInput");
//     dateInput.addEventListener("change", (e) => {
//       this.value = e.target.value; // store in element property
//     });
//   }

//   // Allow external code to get or set value
//   get value() {
//     return this.getAttribute("value");
//   }

//   set value(val) {
//     this.setAttribute("value", val);
//     const input = this.shadowRoot.querySelector("#dateInput");
//     if (input && input.value !== val) input.value = val;
//   }
// }

// customElements.define("date-picker", DatePicker);

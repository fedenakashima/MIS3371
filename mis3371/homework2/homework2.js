// homework2.js
// MIS3371 Homework 2 - Review panel + dynamic date

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "";
}

function formatName(first, middle, last) {
  const mi = (middle || "").trim();
  const midPart = mi ? mi + "." : "";
  return `${(first || "").trim()} ${midPart} ${(last || "").trim()}`.replace(/\s+/g, " ").trim();
}

function showReview() {
  const form = document.getElementById("patientForm");
  const panel = document.getElementById("review-panel");
  if (!form || !panel) return;

  const firstName = form.elements["firstName"]?.value || "";
  const middleInit = form.elements["middleInit"]?.value || "";
  const lastName = form.elements["lastName"]?.value || "";
  const dob = form.elements["dob"]?.value || "";
  const email = form.elements["email"]?.value || "";
  const phone = form.elements["phone"]?.value || "";
  const address1 = form.elements["address1"]?.value || "";
  const address2 = form.elements["address2"]?.value || "";
  const zip = form.elements["zip"]?.value || "";
  const userID = form.elements["userID"]?.value || "";

  // NOTE: both patient and emergency state selects currently use name="emgState"
  // so we use the first one in document order (patient state).
  const stateSelects = form.querySelectorAll('select[name="emgState"]');
  const state = stateSelects && stateSelects.length > 0 ? stateSelects[0].value : "";

  setText("rv-name", formatName(firstName, middleInit, lastName));
  setText("rv-dob", dob);
  setText("rv-email", email);
  setText("rv-phone", phone);

  const fullAddress = (address1 || "").trim() + (address2 ? " " + address2.trim() : "");
  setText("rv-address", fullAddress.trim());

  setText("rv-state", state);
  setText("rv-zip", zip);
  setText("rv-userid", userID);

  panel.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  // Dynamic "today" date
  const d = new Date();
  const today = document.getElementById("todayDate");
  if (today) today.innerHTML = d.toDateString();

  const reviewBtn = document.getElementById("reviewBtn");
  const clearBtn = document.getElementById("clearBtn");

  if (reviewBtn) reviewBtn.addEventListener("click", showReview);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const panel = document.getElementById("review-panel");
      if (panel) panel.style.display = "none";
    });
  }
});

// homework2.js
// MIS3371 Homework 2 - dynamic date, review panel, insurance provider logic

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "";
}

function formatName(first, middle, last) {
  const mi = (middle || "").trim();
  const midPart = mi ? mi + "." : "";
  return `${(first || "").trim()} ${midPart} ${(last || "").trim()}`
    .replace(/\s+/g, " ")
    .trim();
}

function getSelectedRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

/* ---------- Insurance logic ---------- */
function updateInsuranceFields() {
  const selectedInsurance = document.querySelector('input[name="insurance"]:checked');
  const provider = document.getElementById("insuranceProvider");
  const otherWrap = document.getElementById("otherProviderWrap");
  const otherInput = document.getElementById("otherProvider");

  if (!provider || !otherWrap || !otherInput) return;

  const hasInsurance = selectedInsurance && selectedInsurance.value === "Yes";

  provider.disabled = !hasInsurance;
  provider.required = hasInsurance;

  if (!hasInsurance) {
    provider.value = "";
    otherWrap.style.display = "none";
    otherInput.value = "";
    otherInput.required = false;
    return;
  }

  updateOtherProviderField();
}

function updateOtherProviderField() {
  const provider = document.getElementById("insuranceProvider");
  const otherWrap = document.getElementById("otherProviderWrap");
  const otherInput = document.getElementById("otherProvider");

  if (!provider || !otherWrap || !otherInput) return;

  const isOther = provider.value === "Other";
  otherWrap.style.display = isOther ? "flex" : "none";
  otherInput.required = isOther;

  if (!isOther) {
    otherInput.value = "";
  }
}

/* ---------- Review panel ---------- */
function showReview() {
  const form = document.getElementById("patientForm");
  const panel = document.getElementById("review-panel");
  if (!form || !panel) return;

  // basic identity/contact
  const firstName = form.elements["firstName"]?.value || "";
  const middleInit = form.elements["middleInit"]?.value || "";
  const lastName = form.elements["lastName"]?.value || "";
  const dob = form.elements["dob"]?.value || "";
  const email = form.elements["email"]?.value || "";
  const phone = form.elements["phone"]?.value || "";
  const address1 = form.elements["address1"]?.value || "";
  const address2 = form.elements["address2"]?.value || "";
  const city = form.elements["city"]?.value || "";
  const state = form.elements["state"]?.value || "";
  const zip = form.elements["zip"]?.value || "";
  const userID = form.elements["userID"]?.value || "";

  // insurance
  const insurance = getSelectedRadioValue("insurance");
  const providerSelect = document.getElementById("insuranceProvider");
  const providerOther = document.getElementById("otherProvider");
  let provider = providerSelect ? providerSelect.value : "";

  if (provider === "Other") {
    provider = providerOther?.value?.trim() || "Other";
  }

  // format full address line
  const addrLine = [address1, address2].filter(Boolean).join(" ").trim();
  const cityStateZip = [city, state, zip].filter(Boolean).join(" ").trim();
  const fullAddress = [addrLine, cityStateZip].filter(Boolean).join(", ");

  setText("rv-name", formatName(firstName, middleInit, lastName));
  setText("rv-dob", dob);
  setText("rv-email", email);
  setText("rv-phone", phone);
  setText("rv-address", fullAddress);
  setText("rv-state", state);
  setText("rv-zip", zip);
  setText("rv-insurance", insurance || "Not selected");
  setText("rv-provider", insurance === "Yes" ? (provider || "Not selected") : "N/A");
  setText("rv-userid", userID);

  panel.style.display = "block";
}

/* ---------- Init ---------- */
(function init() {
  // dynamic date in header
  const d = new Date();
  const today = document.getElementById("todayDate");
  if (today) today.innerHTML = d.toDateString();

  // pain slider output (if present)
  const painLevel = document.getElementById("painLevel");
  const painOutput = document.getElementById("painOutput");
  if (painLevel && painOutput) {
    painOutput.value = painLevel.value;
    painLevel.addEventListener("input", () => {
      painOutput.value = painLevel.value;
    });
  }

  // review + clear buttons
  const reviewBtn = document.getElementById("reviewBtn");
  const clearBtn = document.getElementById("clearBtn");

  if (reviewBtn) {
    reviewBtn.addEventListener("click", showReview);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const panel = document.getElementById("review-panel");
      if (panel) panel.style.display = "none";

      // reset insurance/provider UI
      setTimeout(() => {
        updateInsuranceFields();
      }, 0);
    });
  }

  // insurance events
  const insuranceRadios = document.querySelectorAll('input[name="insurance"]');
  const insuranceProvider = document.getElementById("insuranceProvider");

  insuranceRadios.forEach((radio) => {
    radio.addEventListener("change", updateInsuranceFields);
  });

  if (insuranceProvider) {
    insuranceProvider.addEventListener("change", updateOtherProviderField);
  }

  // initialize UI state
  updateInsuranceFields();
})();

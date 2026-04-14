// homework2.js — MIS3371 Homework 2

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function formatName(first, middle, last) {
  const mi = (middle || "").trim();
  const midPart = mi ? mi + "." : "";
  return `${(first || "").trim()} ${midPart} ${(last || "").trim()}`.replace(/\s+/g, " ").trim();
}

function getInsuranceRadios() {
  return document.querySelectorAll('#patientForm input[name="insurance"]');
}

function updateInsuranceFields() {
  const form = document.getElementById("patientForm");
  const provider = document.getElementById("insuranceProvider");
  const otherWrap = document.getElementById("otherProviderWrap");
  const otherInput = document.getElementById("otherProvider");

  if (!form || !provider || !otherWrap || !otherInput) return;

  const selected = form.querySelector('input[name="insurance"]:checked');
  const hasInsurance = selected && selected.value === "Yes";

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
  if (!isOther) otherInput.value = "";
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
  const city = form.elements["city"]?.value || "";
  const state = form.elements["state"]?.value || "";
  const zip = form.elements["zip"]?.value || "";
  const userID = form.elements["userID"]?.value || "";

  const ins = form.querySelector('input[name="insurance"]:checked');
  const insurance = ins ? ins.value : "";

  const providerSel = document.getElementById("insuranceProvider");
  const otherProv = document.getElementById("otherProvider");
  let providerText = "";
  if (insurance === "Yes" && providerSel) {
    if (providerSel.value === "Other") {
      providerText = (otherProv && otherProv.value.trim()) ? otherProv.value.trim() : "Other (not specified)";
    } else {
      providerText = providerSel.value || "";
    }
  } else {
    providerText = "N/A";
  }

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
  setText("rv-provider", insurance === "Yes" ? providerText : "N/A");
  setText("rv-userid", userID);

  panel.style.display = "block";
}

function wireInsurance() {
  const form = document.getElementById("patientForm");
  const radios = getInsuranceRadios();
  const provider = document.getElementById("insuranceProvider");

  radios.forEach((r) => {
    r.addEventListener("change", updateInsuranceFields);
  });

  if (provider) {
    provider.addEventListener("change", updateOtherProviderField);
  }

  if (form) {
    form.addEventListener("reset", () => {
      window.setTimeout(updateInsuranceFields, 0);
    });
  }

  updateInsuranceFields();
}

document.addEventListener("DOMContentLoaded", () => {
  const today = document.getElementById("todayDate");
  if (today) today.textContent = new Date().toDateString();

  const painLevel = document.getElementById("painLevel");
  const painOutput = document.getElementById("painOutput");
  if (painLevel && painOutput) {
    painOutput.value = painLevel.value;
    painLevel.addEventListener("input", () => { painOutput.value = painLevel.value; });
  }

  document.getElementById("reviewBtn")?.addEventListener("click", showReview);

  document.getElementById("clearBtn")?.addEventListener("click", () => {
    window.setTimeout(() => {
      document.getElementById("review-panel").style.display = "none";
      updateInsuranceFields();
    }, 0);
  });

  wireInsurance();
});

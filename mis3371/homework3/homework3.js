// homework3.js — MIS 3371 Homework 3 (End Result 1 through Step 5)
// On-the-fly validation + persistent inline messages until corrected.

const NAME_RE = /^[A-Za-z'\-]{1,30}$/;
const ADDRESS_RE = /^[\s\S]{2,30}$/; // HW3: don't over-restrict; length is the main rule

function $(id) {
  return document.getElementById(id);
}

function setMsg(errId, message) {
  const el = $(errId);
  if (!el) return;
  el.textContent = message || "";
}

function setInvalid(input, isInvalid) {
  if (!input) return;
  input.classList.toggle("field-invalid", Boolean(isInvalid));
}

function digitsOnly(s) {
  return (s || "").replace(/\D/g, "");
}

function formatMoney(n) {
  return "$" + Number(n).toLocaleString("en-US") + " / year";
}

function validateFirstLast(input, errId, label) {
  const v = (input.value || "").trim();
  if (!v) {
    setMsg(errId, `${label} is required.`);
    setInvalid(input, true);
    return;
  }
  if (v.length < 1 || v.length > 30 || !NAME_RE.test(v)) {
    setMsg(errId, `${label}: use letters, apostrophes, and dashes only (1–30).`);
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateMiddle(input, errId) {
  const v = (input.value || "").trim();
  if (!v) {
    setMsg(errId, "");
    setInvalid(input, false);
    return;
  }
  if (!/^[A-Za-z]$/.test(v)) {
    setMsg(errId, "Middle initial must be one letter.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function parseMMDDYYYY(s) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((s || "").trim());
  if (!m) return null;
  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);
  if (mm < 1 || mm > 12) return null;
  const dt = new Date(yyyy, mm - 1, dd);
  if (dt.getFullYear() !== yyyy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return null;
  return dt;
}

function validateDOB(input, errId) {
  const raw = (input.value || "").trim();
  if (!raw) {
    setMsg(errId, "Date of birth is required.");
    setInvalid(input, true);
    return;
  }
  const dt = parseMMDDYYYY(raw);
  if (!dt) {
    setMsg(errId, "Use MM/DD/YYYY with a real calendar date.");
    setInvalid(input, true);
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dob = new Date(dt);
  dob.setHours(0, 0, 0, 0);

  if (dob > today) {
    setMsg(errId, "Birthday cannot be in the future.");
    setInvalid(input, true);
    return;
  }

  const oldest = new Date(today);
  oldest.setFullYear(oldest.getFullYear() - 120);
  if (dob < oldest) {
    setMsg(errId, "Birthday cannot be more than 120 years ago.");
    setInvalid(input, true);
    return;
  }

  setMsg(errId, "");
  setInvalid(input, false);
}

function formatSSNWhileTyping(input) {
  let d = digitsOnly(input.value).slice(0, 9);
  let out = "";
  if (d.length >= 1) out = d.slice(0, 3);
  if (d.length >= 4) out += "-" + d.slice(3, 5);
  if (d.length >= 6) out += "-" + d.slice(5, 9);
  input.value = out;
}

function validateSSN(input, errId) {
  const d = digitsOnly(input.value);
  if (d.length !== 9) {
    setMsg(errId, "SSN must be exactly 9 digits (do not use a real SSN).");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateAddressLine(input, errId, requiredLabel, required) {
  const v = (input.value || "").trim();
  if (!v) {
    if (required) {
      setMsg(errId, `${requiredLabel} is required.`);
      setInvalid(input, true);
    } else {
      setMsg(errId, "");
      setInvalid(input, false);
    }
    return;
  }
  if (v.length < 2 || v.length > 30 || !ADDRESS_RE.test(v)) {
    setMsg(errId, "Must be 2–30 characters.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateCity(input, errId) {
  const v = (input.value || "").trim();
  if (!v) {
    setMsg(errId, "City is required.");
    setInvalid(input, true);
    return;
  }
  if (v.length < 2 || v.length > 30) {
    setMsg(errId, "City must be 2–30 characters.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateState(select, errId) {
  if (!select.value) {
    setMsg(errId, "Please select a state.");
    setInvalid(select, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(select, false);
}

function validateZip5(input, errId, required) {
  const v = (input.value || "").trim();
  if (!v) {
    if (required) {
      setMsg(errId, "ZIP is required.");
      setInvalid(input, true);
    } else {
      setMsg(errId, "");
      setInvalid(input, false);
    }
    return;
  }
  if (!/^\d{5}$/.test(v)) {
    setMsg(errId, "ZIP must be exactly 5 digits.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateEmailLike(input, errId, forceLowercase) {
  let v = (input.value || "").trim();
  if (forceLowercase) {
    v = v.toLowerCase();
    input.value = v;
  }
  if (!v) {
    setMsg(errId, "Email is required.");
    setInvalid(input, true);
    return;
  }
  // Practical name@domain.tld check (HW3)
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  if (!ok) {
    setMsg(errId, "Email must look like name@domain.tld");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validatePhone10(input, errId, required) {
  const v = (input.value || "").trim();
  if (!v) {
    if (required) {
      setMsg(errId, "Phone is required.");
      setInvalid(input, true);
    } else {
      setMsg(errId, "");
      setInvalid(input, false);
    }
    return;
  }
  if (!/^\d{3}-\d{3}-\d{4}$/.test(v)) {
    setMsg(errId, "Phone must be 000-000-0000");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function normalizePhoneAsYouType(input) {
  let d = digitsOnly(input.value).slice(0, 10);
  if (d.length <= 3) input.value = d;
  else if (d.length <= 6) input.value = d.slice(0, 3) + "-" + d.slice(3);
  else input.value = d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
}

function validateSymptoms(textarea, errId) {
  const v = textarea.value || "";
  if (!v.trim()) {
    setMsg(errId, "");
    setInvalid(textarea, false);
    return;
  }
  if (v.includes('"')) {
    setMsg(errId, 'Please avoid double quotes (") in this field.');
    setInvalid(textarea, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(textarea, false);
}

function validateRadioGroup(name, errId) {
  const form = document.getElementById("patientForm");
  const picked = form.querySelector(`input[name="${name}"]:checked`);
  if (!picked) {
    setMsg(errId, "Please make a selection.");
    return false;
  }
  setMsg(errId, "");
  return true;
}

function wireRadioGroupLiveValidation(name, errId) {
  const form = document.getElementById("patientForm");
  form.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
    r.addEventListener("change", () => validateRadioGroup(name, errId));
  });
}

function updateInsuranceFields() {
  const form = document.getElementById("patientForm");
  const provider = $("insuranceProvider");
  const otherWrap = $("otherProviderWrap");
  const otherInput = $("otherProvider");

  const selected = form.querySelector('input[name="insurance"]:checked');
  const hasInsurance = selected && selected.value === "Yes";

  provider.disabled = !hasInsurance;

  if (!hasInsurance) {
    provider.value = "";
    otherWrap.style.display = "none";
    otherInput.value = "";
    setMsg("err-insuranceProvider", "");
    setMsg("err-otherProvider", "");
    setInvalid(provider, false);
    setInvalid(otherInput, false);
    validateRadioGroup("insurance", "err-insurance");
    return;
  }

  validateRadioGroup("insurance", "err-insurance");
  updateOtherProviderField();
  validateInsuranceProvider();
}

function updateOtherProviderField() {
  const provider = $("insuranceProvider");
  const otherWrap = $("otherProviderWrap");
  const otherInput = $("otherProvider");

  const isOther = provider.value === "Other";
  otherWrap.style.display = isOther ? "flex" : "none";
  if (!isOther) {
    otherInput.value = "";
    setMsg("err-otherProvider", "");
    setInvalid(otherInput, false);
  }
  validateInsuranceProvider();
}

function validateInsuranceProvider() {
  const form = document.getElementById("patientForm");
  const selected = form.querySelector('input[name="insurance"]:checked');
  const hasInsurance = selected && selected.value === "Yes";
  const provider = $("insuranceProvider");
  const otherInput = $("otherProvider");

  if (!hasInsurance) {
    setMsg("err-insuranceProvider", "");
    setInvalid(provider, false);
    return;
  }
  if (!provider.value) {
    setMsg("err-insuranceProvider", "Select a provider.");
    setInvalid(provider, true);
    return;
  }
  if (provider.value === "Other") {
    const t = (otherInput.value || "").trim();
    if (t.length < 1 || t.length > 30) {
      setMsg("err-otherProvider", "Other provider must be 1–30 characters.");
      setInvalid(otherInput, true);
      return;
    }
    setMsg("err-otherProvider", "");
    setInvalid(otherInput, false);
  } else {
    setMsg("err-otherProvider", "");
    setInvalid(otherInput, false);
  }

  setMsg("err-insuranceProvider", "");
  setInvalid(provider, false);
}

function validateUserID(input, errId) {
  let v = (input.value || "").trim().toLowerCase();
  input.value = v;

  if (!v) {
    setMsg(errId, "User ID is required.");
    setInvalid(input, true);
    return;
  }
  if (v.length < 5 || v.length > 20) {
    setMsg(errId, "User ID must be 5–20 characters.");
    setInvalid(input, true);
    return;
  }
  if (/^\d/.test(v)) {
    setMsg(errId, "User ID cannot start with a number.");
    setInvalid(input, true);
    return;
  }
  if (!/^[a-z0-9_-]+$/.test(v)) {
    setMsg(errId, "Only letters, numbers, underscore, and dash. No spaces.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validatePassword(input, errId) {
  const pw = input.value || "";
  const uid = ($("userID")?.value || "").trim().toLowerCase();

  if (!pw) {
    setMsg(errId, "Password is required.");
    setInvalid(input, true);
    return;
  }
  if (pw.length < 8) {
    setMsg(errId, "Password must be at least 8 characters.");
    setInvalid(input, true);
    return;
  }
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/\d/.test(pw)) {
    setMsg(errId, "Password needs at least 1 uppercase, 1 lowercase, and 1 digit.");
    setInvalid(input, true);
    return;
  }
  if (uid && pw.toLowerCase() === uid) {
    setMsg(errId, "Password cannot equal your User ID.");
    setInvalid(input, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(input, false);
}

function validateConfirmPassword(p1, p2, errId) {
  if (!p2.value) {
    setMsg(errId, "Please re-enter your password.");
    setInvalid(p2, true);
    return;
  }
  if (p1.value !== p2.value) {
    setMsg(errId, "Passwords do not match.");
    setInvalid(p2, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(p2, false);
}

function validateSalaryRange(range, out, errId) {
  const n = Number(range.value);
  out.textContent = formatMoney(n);
  if (!Number.isFinite(n) || n < 20000 || n > 200000) {
    setMsg(errId, "Salary must be between $20,000 and $200,000.");
    setInvalid(range, true);
    return;
  }
  setMsg(errId, "");
  setInvalid(range, false);
}

function showReview() {
  const form = document.getElementById("patientForm");
  const panel = $("review-panel");
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

  const providerSel = $("insuranceProvider");
  const otherProv = $("otherProvider");
  let providerText = "";
  if (insurance === "Yes" && providerSel) {
    providerText = providerSel.value === "Other"
      ? ((otherProv && otherProv.value.trim()) ? otherProv.value.trim() : "Other")
      : (providerSel.value || "");
  } else {
    providerText = "N/A";
  }

  const addrLine = [address1, address2].filter(Boolean).join(" ").trim();
  const cityStateZip = [city, state, zip].filter(Boolean).join(" ").trim();
  const fullAddress = [addrLine, cityStateZip].filter(Boolean).join(", ");

  const mi = (middleInit || "").trim();
  const midPart = mi ? mi + "." : "";
  const fullName = `${(firstName || "").trim()} ${midPart} ${(lastName || "").trim()}`.replace(/\s+/g, " ").trim();

  $("rv-name").textContent = fullName;
  $("rv-dob").textContent = dob;
  $("rv-email").textContent = email;
  $("rv-phone").textContent = phone;
  $("rv-address").textContent = fullAddress;
  $("rv-state").textContent = state;
  $("rv-zip").textContent = zip;
  $("rv-insurance").textContent = insurance || "Not selected";
  $("rv-provider").textContent = insurance === "Yes" ? (providerText || "Not selected") : "N/A";
  $("rv-userid").textContent = userID;

  panel.style.display = "block";
}

function wireInsurance() {
  const form = document.getElementById("patientForm");
  const radios = form.querySelectorAll('input[name="insurance"]');
  const provider = $("insuranceProvider");

  radios.forEach((r) => r.addEventListener("change", updateInsuranceFields));
  if (provider) provider.addEventListener("change", updateOtherProviderField);

  $("otherProvider")?.addEventListener("input", validateInsuranceProvider);
  $("otherProvider")?.addEventListener("blur", validateInsuranceProvider);

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      document.querySelectorAll(".field-invalid").forEach((el) => el.classList.remove("field-invalid"));
      document.querySelectorAll(".field-msg").forEach((el) => (el.textContent = ""));
      $("review-panel").style.display = "none";
      updateInsuranceFields();
      const salaryRange = $("salaryRange");
      const salaryOutput = $("salaryOutput");
      if (salaryRange && salaryOutput) salaryOutput.textContent = formatMoney(salaryRange.value);
    }, 0);
  });

  updateInsuranceFields();
}

document.addEventListener("DOMContentLoaded", () => {
  const today = $("todayDate");
  if (today) today.textContent = new Date().toDateString();

  // Patient fields
  const firstName = $("firstName");
  const middleInit = $("middleInit");
  const lastName = $("lastName");
  const dob = $("dob");
  const ssn = $("ssn");
  const address1 = $("address1");
  const address2 = $("address2");
  const city = $("city");
  const state = $("state");
  const zip = $("zip");
  const email = $("email");
  const phone = $("phone");
  const symptoms = $("symptoms");

  firstName.addEventListener("input", () => validateFirstLast(firstName, "err-firstName", "First name"));
  firstName.addEventListener("blur", () => validateFirstLast(firstName, "err-firstName", "First name"));

  middleInit.addEventListener("input", () => validateMiddle(middleInit, "err-middleInit"));
  middleInit.addEventListener("blur", () => validateMiddle(middleInit, "err-middleInit"));

  lastName.addEventListener("input", () => validateFirstLast(lastName, "err-lastName", "Last name"));
  lastName.addEventListener("blur", () => validateFirstLast(lastName, "err-lastName", "Last name"));

  dob.addEventListener("input", () => validateDOB(dob, "err-dob"));
  dob.addEventListener("blur", () => validateDOB(dob, "err-dob"));

  ssn.addEventListener("input", () => {
    formatSSNWhileTyping(ssn);
    validateSSN(ssn, "err-ssn");
  });
  ssn.addEventListener("blur", () => validateSSN(ssn, "err-ssn"));

  address1.addEventListener("input", () => validateAddressLine(address1, "err-address1", "Address line 1", true));
  address1.addEventListener("blur", () => validateAddressLine(address1, "err-address1", "Address line 1", true));

  address2.addEventListener("input", () => validateAddressLine(address2, "err-address2", "Address line 2", false));
  address2.addEventListener("blur", () => validateAddressLine(address2, "err-address2", "Address line 2", false));

  city.addEventListener("input", () => validateCity(city, "err-city"));
  city.addEventListener("blur", () => validateCity(city, "err-city"));

  state.addEventListener("change", () => validateState(state, "err-state"));
  state.addEventListener("blur", () => validateState(state, "err-state"));

  zip.addEventListener("input", () => validateZip5(zip, "err-zip", true));
  zip.addEventListener("blur", () => validateZip5(zip, "err-zip", true));

  email.addEventListener("input", () => validateEmailLike(email, "err-email", true));
  email.addEventListener("blur", () => validateEmailLike(email, "err-email", true));

  phone.addEventListener("input", () => {
    normalizePhoneAsYouType(phone);
    validatePhone10(phone, "err-phone", true);
  });
  phone.addEventListener("blur", () => validatePhone10(phone, "err-phone", true));

  symptoms.addEventListener("input", () => validateSymptoms(symptoms, "err-symptoms"));
  symptoms.addEventListener("blur", () => validateSymptoms(symptoms, "err-symptoms"));

  // Radios
  wireRadioGroupLiveValidation("sex", "err-sex");
  wireRadioGroupLiveValidation("ethnicity", "err-ethnicity");
  wireRadioGroupLiveValidation("insurance", "err-insurance");
  wireRadioGroupLiveValidation("chestPain", "err-chestPain");
  wireRadioGroupLiveValidation("vaccinated", "err-vaccinated");
  wireRadioGroupLiveValidation("housing", "err-housing");

  // Salary slider
  const salaryRange = $("salaryRange");
  const salaryOutput = $("salaryOutput");
  salaryRange.addEventListener("input", () => validateSalaryRange(salaryRange, salaryOutput, "err-salaryRange"));
  validateSalaryRange(salaryRange, salaryOutput, "err-salaryRange");

  // Emergency contact
  const emgFirstName = $("emgFirstName");
  const emgMiddleInit = $("emgMiddleInit");
  const emgLastName = $("emgLastName");
  const relationship = $("relationship");
  const emgAddress1 = $("emgAddress1");
  const emgAddress2 = $("emgAddress2");
  const emgCity = $("emgCity");
  const emgState = $("emgState");
  const emgZip = $("emgZip");
  const emgEmail = $("emgEmail");
  const emgPhone = $("emgPhone");

  emgFirstName.addEventListener("input", () => validateFirstLast(emgFirstName, "err-emgFirstName", "First name"));
  emgFirstName.addEventListener("blur", () => validateFirstLast(emgFirstName, "err-emgFirstName", "First name"));

  emgMiddleInit.addEventListener("input", () => validateMiddle(emgMiddleInit, "err-emgMiddleInit"));
  emgMiddleInit.addEventListener("blur", () => validateMiddle(emgMiddleInit, "err-emgMiddleInit"));

  emgLastName.addEventListener("input", () => validateFirstLast(emgLastName, "err-emgLastName", "Last name"));
  emgLastName.addEventListener("blur", () => validateFirstLast(emgLastName, "err-emgLastName", "Last name"));

  relationship.addEventListener("change", () => {
    if (!relationship.value) {
      setMsg("err-relationship", "Select a relationship.");
      setInvalid(relationship, true);
    } else {
      setMsg("err-relationship", "");
      setInvalid(relationship, false);
    }
  });

  emgAddress1.addEventListener("input", () => validateAddressLine(emgAddress1, "err-emgAddress1", "Address line 1", true));
  emgAddress1.addEventListener("blur", () => validateAddressLine(emgAddress1, "err-emgAddress1", "Address line 1", true));

  emgAddress2.addEventListener("input", () => validateAddressLine(emgAddress2, "err-emgAddress2", "Address line 2", false));
  emgAddress2.addEventListener("blur", () => validateAddressLine(emgAddress2, "err-emgAddress2", "Address line 2", false));

  emgCity.addEventListener("input", () => {
    const v = (emgCity.value || "").trim();
    if (!v) {
      setMsg("err-emgCity", "");
      setInvalid(emgCity, false);
      return;
    }
    validateCity(emgCity, "err-emgCity");
  });
  emgCity.addEventListener("blur", () => {
    const v = (emgCity.value || "").trim();
    if (!v) {
      setMsg("err-emgCity", "");
      setInvalid(emgCity, false);
      return;
    }
    validateCity(emgCity, "err-emgCity");
  });

  emgState.addEventListener("change", () => validateState(emgState, "err-emgState"));
  emgZip.addEventListener("input", () => validateZip5(emgZip, "err-emgZip", false));
  emgZip.addEventListener("blur", () => validateZip5(emgZip, "err-emgZip", false));

  emgEmail.addEventListener("input", () => {
    const v = (emgEmail.value || "").trim();
    if (!v) {
      setMsg("err-emgEmail", "");
      setInvalid(emgEmail, false);
      return;
    }
    validateEmailLike(emgEmail, "err-emgEmail", true);
  });
  emgEmail.addEventListener("blur", () => {
    const v = (emgEmail.value || "").trim();
    if (!v) {
      setMsg("err-emgEmail", "");
      setInvalid(emgEmail, false);
      return;
    }
    validateEmailLike(emgEmail, "err-emgEmail", true);
  });

  emgPhone.addEventListener("input", () => {
    normalizePhoneAsYouType(emgPhone);
    validatePhone10(emgPhone, "err-emgPhone", false);
  });
  emgPhone.addEventListener("blur", () => validatePhone10(emgPhone, "err-emgPhone", false));

  // Account
  const userID = $("userID");
  const portalEmail = $("portalEmail");
  const password = $("password");
  const confirmPassword = $("confirmPassword");

  userID.addEventListener("input", () => {
    validateUserID(userID, "err-userID");
    validatePassword(password, "err-password");
    validateConfirmPassword(password, confirmPassword, "err-confirmPassword");
  });
  userID.addEventListener("blur", () => {
    validateUserID(userID, "err-userID");
    validatePassword(password, "err-password");
  });

  portalEmail.addEventListener("input", () => validateEmailLike(portalEmail, "err-portalEmail", true));
  portalEmail.addEventListener("blur", () => validateEmailLike(portalEmail, "err-portalEmail", true));

  password.addEventListener("input", () => {
    validatePassword(password, "err-password");
    validateConfirmPassword(password, confirmPassword, "err-confirmPassword");
  });
  password.addEventListener("blur", () => {
    validatePassword(password, "err-password");
    validateConfirmPassword(password, confirmPassword, "err-confirmPassword");
  });

  confirmPassword.addEventListener("input", () => validateConfirmPassword(password, confirmPassword, "err-confirmPassword"));
  confirmPassword.addEventListener("blur", () => validateConfirmPassword(password, confirmPassword, "err-confirmPassword"));

  // Review + insurance wiring
  $("reviewBtn")?.addEventListener("click", showReview);
  $("clearBtn")?.addEventListener("click", () => {
    window.setTimeout(() => $("review-panel").style.display = "none", 0);
  });

  wireInsurance();
});

// ===== CONFIGURATION =====
const API_URL = "https://emergency-contact-naresh.onrender.com/api/contacts";

// ===== DOM ELEMENTS =====
const contactForm = document.getElementById("contact-form");
const formTitle = document.getElementById("form-title");
const contactIdInput = document.getElementById("contact-id");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const contactsList = document.getElementById("contacts-list");
const contactCount = document.getElementById("contact-count");
const notification = document.getElementById("notification");
const loadingDiv = document.getElementById("loading");
const noContactsDiv = document.getElementById("no-contacts");
const searchInput = document.getElementById("search-input");
const filterRelationship = document.getElementById("filter-relationship");
const filterPriority = document.getElementById("filter-priority");

// Delete Modal
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const deleteContactName = document.getElementById("delete-contact-name");

let deleteTargetId = null;

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  fetchContacts();
  setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  contactForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", resetForm);
  confirmDeleteBtn.addEventListener("click", confirmDelete);
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // Search & Filter with debounce
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchContacts, 400);
  });

  filterRelationship.addEventListener("change", fetchContacts);
  filterPriority.addEventListener("change", fetchContacts);
}

// ===== FETCH ALL CONTACTS =====
async function fetchContacts() {
  try {
    loadingDiv.classList.remove("hidden");
    contactsList.innerHTML = "";
    noContactsDiv.classList.add("hidden");

    // Build query string
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.append("search", searchInput.value.trim());
    if (filterRelationship.value) params.append("relationship", filterRelationship.value);
    if (filterPriority.value) params.append("priority", filterPriority.value);

    const url = params.toString() ? `${API_URL}?${params}` : API_URL;

    const response = await fetch(url);
    const result = await response.json();

    loadingDiv.classList.add("hidden");

    if (result.success && result.data.length > 0) {
      contactCount.textContent = `${result.count} contact${result.count !== 1 ? "s" : ""}`;
      result.data.forEach((contact) => {
        contactsList.appendChild(createContactCard(contact));
      });
    } else {
      contactCount.textContent = "0 contacts";
      noContactsDiv.classList.remove("hidden");
    }
  } catch (error) {
    loadingDiv.classList.add("hidden");
    showNotification("Failed to load contacts. Is the server running?", "error");
    console.error("Fetch error:", error);
  }
}

// ===== CREATE CONTACT CARD =====
function createContactCard(contact) {
  const card = document.createElement("div");
  card.className = `contact-card priority-${contact.priority.toLowerCase()}`;

  const badgeClass = `badge-${contact.priority.toLowerCase()}`;
  const categoryIcons = {
    Family: "👨‍👩‍👧‍👦",
    Friend: "🤝",
    Doctor: "🏥",
    Police: "👮",
    "Fire Department": "🚒",
    Ambulance: "🚑",
    Neighbor: "🏠",
    Workplace: "💼",
    Other: "📋",
  };

  const icon = categoryIcons[contact.relationship] || "📋";

  card.innerHTML = `
    <div class="card-header">
      <span class="card-name">${escapeHtml(contact.name)}</span>
      <span class="card-badge ${badgeClass}">${contact.priority}</span>
    </div>
    <div class="card-details">
      <div class="card-detail">
        <span class="icon">📞</span>
        <a href="tel:${contact.phone}" style="color:#1976d2; text-decoration:none; font-weight:600;">
          ${escapeHtml(contact.phone)}
        </a>
      </div>
      ${
        contact.email
          ? `<div class="card-detail">
              <span class="icon">📧</span>
              <span>${escapeHtml(contact.email)}</span>
            </div>`
          : ""
      }
      <div class="card-detail">
        <span class="icon">${icon}</span>
        <span>${contact.relationship}</span>
      </div>
      ${
        contact.address
          ? `<div class="card-detail">
              <span class="icon">📍</span>
              <span>${escapeHtml(contact.address)}</span>
            </div>`
          : ""
      }
    </div>
    ${
      contact.notes
        ? `<div class="card-notes">📝 ${escapeHtml(contact.notes)}</div>`
        : ""
    }
    <div class="card-actions">
      <button class="btn btn-edit" onclick="editContact('${contact._id}')">✏️ Edit</button>
      <button class="btn btn-delete" onclick="openDeleteModal('${contact._id}', '${escapeHtml(contact.name)}')">🗑 Delete</button>
    </div>
  `;

  return card;
}

// ===== HANDLE FORM SUBMIT (CREATE / UPDATE) =====
async function handleFormSubmit(e) {
  e.preventDefault();

  const contactData = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    relationship: document.getElementById("relationship").value,
    priority: document.getElementById("priority").value,
    address: document.getElementById("address").value.trim(),
    notes: document.getElementById("notes").value.trim(),
  };

  const contactId = contactIdInput.value;
  const isEditing = Boolean(contactId);

  try {
    const url = isEditing ? `${API_URL}/${contactId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });

    const result = await response.json();

    if (result.success) {
      showNotification(
        isEditing
          ? "Contact updated successfully! ✅"
          : "Contact added successfully! ✅",
        "success"
      );
      resetForm();
      fetchContacts();
    } else {
      showNotification(result.message || "Something went wrong", "error");
    }
  } catch (error) {
    showNotification("Failed to save contact. Check your connection.", "error");
    console.error("Save error:", error);
  }
}

// ===== EDIT CONTACT =====
async function editContact(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();

    if (result.success) {
      const contact = result.data;

      contactIdInput.value = contact._id;
      document.getElementById("name").value = contact.name;
      document.getElementById("phone").value = contact.phone;
      document.getElementById("email").value = contact.email || "";
      document.getElementById("relationship").value = contact.relationship;
      document.getElementById("priority").value = contact.priority;
      document.getElementById("address").value = contact.address || "";
      document.getElementById("notes").value = contact.notes || "";

      formTitle.textContent = "✏️ Edit Contact";
      submitBtn.textContent = "💾 Update Contact";
      cancelBtn.classList.remove("hidden");

      // Scroll to form
      document.querySelector(".form-section").scrollIntoView({
        behavior: "smooth",
      });
    }
  } catch (error) {
    showNotification("Failed to load contact details.", "error");
    console.error("Edit error:", error);
  }
}

// ===== DELETE CONTACT =====
function openDeleteModal(id, name) {
  deleteTargetId = id;
  deleteContactName.textContent = name;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  deleteTargetId = null;
  deleteModal.classList.add("hidden");
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const response = await fetch(`${API_URL}/${deleteTargetId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Contact deleted successfully! 🗑", "success");
      fetchContacts();
    } else {
      showNotification(result.message || "Failed to delete", "error");
    }
  } catch (error) {
    showNotification("Failed to delete contact.", "error");
    console.error("Delete error:", error);
  }

  closeDeleteModal();
}

// ===== RESET FORM =====
function resetForm() {
  contactForm.reset();
  contactIdInput.value = "";
  formTitle.textContent = "➕ Add New Contact";
  submitBtn.textContent = "➕ Add Contact";
  cancelBtn.classList.add("hidden");
  document.getElementById("priority").value = "Medium";
}

// ===== NOTIFICATION =====
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3500);
}

// ===== UTILITY: Escape HTML =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/contacts.json");

function readContacts() {
  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeContacts(contacts) {
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// GET ALL
router.get("/", (req, res) => {
  try {
    let contacts = readContacts();
    const { search, relationship, priority } = req.query;

    if (search) {
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (relationship) {
      contacts = contacts.filter((c) => c.relationship === relationship);
    }

    if (priority) {
      contacts = contacts.filter((c) => c.priority === priority);
    }

    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    contacts.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET SINGLE
router.get("/:id", (req, res) => {
  try {
    const contacts = readContacts();
    const contact = contacts.find((c) => c._id === req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// CREATE
router.post("/", (req, res) => {
  try {
    const { name, phone, email, relationship, priority, address, notes } =
      req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone and Relationship are required",
      });
    }

    const contacts = readContacts();

    const newContact = {
      _id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      relationship,
      priority: priority || "Medium",
      address: address ? address.trim() : "",
      notes: notes ? notes.trim() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contacts.push(newContact);
    writeContacts(contacts);

    res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// UPDATE
router.put("/:id", (req, res) => {
  try {
    const contacts = readContacts();
    const index = contacts.findIndex((c) => c._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const { name, phone, email, relationship, priority, address, notes } =
      req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone and Relationship are required",
      });
    }

    contacts[index] = {
      ...contacts[index],
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : "",
      relationship,
      priority: priority || "Medium",
      address: address ? address.trim() : "",
      notes: notes ? notes.trim() : "",
      updatedAt: new Date().toISOString(),
    };

    writeContacts(contacts);

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contacts[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", (req, res) => {
  try {
    const contacts = readContacts();
    const index = contacts.findIndex((c) => c._id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contacts.splice(index, 1);
    writeContacts(contacts);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
const CONTACT_URL = 'https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users/';

const DELETE_BTN_CLASS = 'delete-btn';
const CONTACT_ITEM_SELECTOR = 'contact-item';
const CONTACT_ID_ATTRIBUTE_NAME = 'data-contact-id';
 
const contactTemplate = document.getElementById('newContactTemplate').innerHTML;
const contactsListEl = document.getElementById('contactsList');
const nameInputEl = document.getElementById('nameInput');
const phoneInputEl = document.getElementById('phoneInput');
const emailInputEl = document.getElementById('emailInput');
const addContactFormEl = document.getElementById('addContactBtn');

addContactFormEl.addEventListener('click', addContactFormSubmit);
contactsListEl.addEventListener('click', onContactsListClick);

let contactsList = [];

init();

function addContactFormSubmit(event) {
  event.preventDefault();

  submitForm();
}
 
function onContactsListClick(e) {
  if (e.target.classList.contains(DELETE_BTN_CLASS)) {
    const contactId = getContactId(e.target);

    deleteContact(contactId);
  }
}

function init() {
  getContacts()
}

function getContactId(el) { 
  return el.closest('.' + CONTACT_ITEM_SELECTOR).dataset.contactId;
}

function getContacts() {
   fetch(CONTACT_URL)
    .then((resp) => resp.json())
    .then(setContacts)
    .then(renderList)
}

function setContacts(data) {
  return (contactsList = data);
}

function renderList(list) {
  contactsListEl.innerHTML = list.map(getContactRowHtml).join('');
}

function getContactRowHtml({name, phone, email, id}) {
  return contactTemplate
    .replace('{{name}}', name)
    .replace('{{phone}}', phone)
    .replace('{{email}}', email)
    .replace('{{id}}', id);
}

function submitForm() {
  const newContact = getFormData();

  if (isInputValid()) {
    return;
  }
  createContact(newContact);
  resetForm();
}

function getFormData() {
  return {
    name: nameInputEl.value,
    phone: phoneInputEl.value,
    email: emailInputEl.value,
  };
}

function resetForm() {
  nameInputEl.value = '';
  phoneInputEl.value = '';
  emailInputEl.value = '';
}

function isInputValid() {
  return (
    nameInputEl.value === '' ||
    phoneInputEl.value === '' ||
    emailInputEl.value === ''
  );
}


function createContact(newContact) {
   fetch(CONTACT_URL, {
    method: 'POST',
    body: JSON.stringify(newContact),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(resp => resp.json())
    .then(addContact)
}

function addContact(contact) {
  contactsList.push(contact);
  renderList(contactsList);
}

function deleteContact(id) {
   fetch(CONTACT_URL + id, {
    method: 'DELETE',
  }).then(() => {
      contactsList = contactsList.filter((item) => item.id !== id);
      renderList(contactsList);
  })
}
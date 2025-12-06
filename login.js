const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginform = document.getElementById('loginform');
const registerform = document.getElementById('registerform');
const formTitle = document.getElementById('form-title');

loginBtn.onclick = () => {
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
  loginform.classList.remove("hidden");
  registerform.classList.add("hidden");
  formTitle.textContent = "Login";
};

registerBtn.onclick = () => {
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
  registerform.classList.remove("hidden");
  loginform.classList.add("hidden");
  formTitle.textContent = "Register";
};

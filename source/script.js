(function() {
  const login = document.getElementById('login');
  const avatar = document.getElementById('loginAvatar');
  const reader = new FileReader();

  login.addEventListener('change', (e) => {
    e.preventDefault();
    reader.readAsDataURL(e.srcElement.files[0]);
  });

  reader.addEventListener('load', () => {
    avatar.style.background = `url(${reader.result}) center center`;
  });

  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const base64 = avatar.style.backgroundImage;
    const username = document.getElementById('username').value;
    localStorage.setItem('userInfo', JSON.stringify({
      avatar: base64.slice(5, base64.length - 2),
      username
    }));

    document.getElementById('loginPage').classList.add('login--hidden');
  });

})();
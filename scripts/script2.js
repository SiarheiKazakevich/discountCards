//function for  menu burger
function toggleMenu() {
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('overlay');
  const header = document.querySelector('header')
  menu.classList.toggle('active');
  burger.classList.toggle('active');
  overlay.classList.toggle('active');
  header.classList.toggle('active');
}
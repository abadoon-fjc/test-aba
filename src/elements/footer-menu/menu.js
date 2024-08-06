function loadFooterMenu() {
    const footerMenuHtml = '<nav class="footer-menu"><ul><li><a href="../../pages/farm/farm.html">FARM</a></li><li><a href="../../pages/tasks/tasks.html">TASKS</a></li><li><a href="../../pages/wallet/wallet.html">WALLET</a></li><!-- Add more menu items here --></ul></nav>';
    const footerMenuContainer = document.createElement('div');
    footerMenuContainer.innerHTML = footerMenuHtml;
    document.body.appendChild(footerMenuContainer);
    footerMenuContainer.classList.add('footer-menu-container');
}
  
document.addEventListener('DOMContentLoaded', loadFooterMenu);
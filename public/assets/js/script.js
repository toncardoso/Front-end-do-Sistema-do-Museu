function menuShow() {
    let menuMobile = document.querySelector('.menu-mobile');
    let body = document.querySelector('body');
    
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        body.classList.remove('menu-open');
    } else {
        menuMobile.classList.add('open');
        body.classList.add('menu-open');
    }
}
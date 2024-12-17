document.addEventListener('DOMContentLoaded', function() {
    // Funkcia na overenie stavu prihlásenia zo servera
    function checkLoginStatus() {
        fetch('/login/status', {
            method: 'GET',   // Získanie stavu prihlásenia
            credentials: 'include' // Zabezpečte, že súčasťou požiadavky bude autentifikácia, ak je nastavená
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Ak je používateľ prihlásený, zobrazíme informácie o používateľovi
                console.log('Používateľ je prihlásený:', data.user.username);
                // Môžete pridať ďalšie kroky ako zobrazenie profilu
            } else {
                // Ak používateľ nie je prihlásený, presmerujeme ho na stránku neprihlaseny.html
                window.location.href = 'neprihlaseny.html';
            }
        })
        .catch(error => {
            console.error('Chyba pri overovaní stavu prihlásenia:', error);
            // Môžete pridať ďalšie spracovanie chýb, napr. presmerovanie na stránku s chybou
            window.location.href = 'neprihlaseny.html'; // Ak nastane chyba, presmerujte na neprihlaseny.html
        });
    }

    // Overenie stavu prihlásenia pri načítaní stránky
    checkLoginStatus();
});

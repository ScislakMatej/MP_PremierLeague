
        document.addEventListener('DOMContentLoaded', () => {
            // Načítanie užívateľského mena a ďalšie úpravy
            const username = localStorage.getItem('username');
            console.log('Loaded username from localStorage:', username); // Výpis užívateľského mena
            window.username = username;
    
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.innerText = username || 'Neprihlášený';
            }
    
            const inputs = document.querySelectorAll('input[type="text"]');
            inputs.forEach(input => {
                const inputId = input.id;
                const inputText = localStorage.getItem(`${username}-${inputId}-value`);
                const buttonState = localStorage.getItem(`${username}-${inputId}-state`);
                console.log(`Loaded data for ${inputId}:`, { inputText, buttonState }); // Výpis načítaných údajov
    
                if (inputText) {
                    input.placeholder = inputText;
                }
    
                if (buttonState === 'saved') {
                    const button = document.querySelector(`#${inputId}_B`);
                    if (button) {
                        button.classList.add('btn-natipovane');
                        button.innerText = 'Natipované!';
                    }
                }
            });
    
            // Pridanie udalosť na kliknutie pre tlačidlo načítania súboru
            const loadFileBtn = document.getElementById('load-file-btn');
            const fileContent = document.getElementById('file-content');
            const sourceFileInput = document.getElementById('source-file');
    
            if (loadFileBtn && fileContent && sourceFileInput) {
                loadFileBtn.addEventListener('click', () => {
                    const sourceFile = sourceFileInput.value;
                    if (!sourceFile) {
                        console.error('Source file identifier is missing');
                        return;
                    }
                    console.log('Source file identifier:', sourceFile);
    
                    const url = `/file/${sourceFile}.txt`; // URL pre načítanie súboru
                    console.log('Fetching from URL:', url);
    
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(text => {
                            fileContent.value = text; // Zobrazenie obsahu v textarea
                        })
                        .catch(error => {
                            console.error('Error fetching file:', error);
                        });
                });
            }
        });
    
        function submitRow(inputId, button) {
            if (!window.username) {
                alert('Musíte sa prihlásiť, abyste mohli tipovať!');
                return;
            }
    
            console.log('Submitting data for:', window.username); // Výpis užívateľského mena pri odosielaní údajov
    
            const input = document.getElementById(inputId);
            const text = input.value;
            const sourceFile = document.getElementById('source-file').value;
    
            if (!text) {
                alert('Dačo si tipni aspoň, prázdne pole je nuda!');
                return;
            }
    
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const formattedDateTime = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
    
            const data = {
                user: window.username,
                id: inputId,
                text: text,
                timestamp: formattedDateTime,
                sourceFile: sourceFile
            };
    
            console.log('Data to be sent:', data); // Výpis údajov, ktoré budú odoslané
    
            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([data])
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Data submitted successfully from ' + inputId);
                button.classList.add('btn-natipovane');
                button.innerText = 'Natipované!';
                input.placeholder = text;
                input.value = '';
    
                localStorage.setItem(`${window.username}-${inputId}-value`, text);
                localStorage.setItem(`${window.username}-${button.id}-state`, 'saved');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

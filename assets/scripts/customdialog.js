export function alertDialog(message) {
    let alertDialog = document.createElement('dialog');
    alertDialog.innerHTML = `
        ${message}
        <br>
        <br>
        <button id="closeDialog">OK</button>
    `;

    alertDialog.style.textAlign = 'center';

    document.body.appendChild(alertDialog);
    alertDialog.showModal();

    let closeDialog = document.getElementById('closeDialog');
    closeDialog.addEventListener("click", () => {
        alertDialog.close();
        document.body.removeChild(alertDialog);
    });
}

export function confirmDialog(message) {
    let confirmDialog = document.createElement('dialog');
    confirmDialog.innerHTML = `
        ${message}
        <br>
        <br>
        <button id="closeDialogTrue">OK</button>
        <button id="closeDialogFalse">Cancel</button>
    `;

    confirmDialog.style.textAlign = 'center';

    document.body.appendChild(confirmDialog);
    
    confirmDialog.showModal();

    document.getElementById('output');

    let ok = document.getElementById('closeDialogTrue');
    ok.addEventListener("click", () => {
        output.innerHTML = `The value returned by the custom confirm method is: "<strong>Confirmed</strong>!"`;
        confirmDialog.close();
        document.body.removeChild(confirmDialog);
    });

    let cancel = document.getElementById('closeDialogFalse');
    cancel.addEventListener("click", () => {
        output.innerHTML = `The value returned by the custom confirm method is: "<strong>Not confirmed</strong>!"`;
        confirmDialog.close();
        document.body.removeChild(confirmDialog);
    });
}

export function promptDialog(message) {
    let promptDialog = document.createElement('dialog');
    promptDialog.innerHTML = `
        ${message}
        <br>
        <br>
        <input type="text" id="userInput" name="userInput">
        <br>
        <br>
        <button id="closeDialogTrue">OK</button>
        <button id="closeDialogFalse">Cancel</button>
    `;

    promptDialog.style.textAlign = 'center';

    document.body.appendChild(promptDialog);

    document.getElementById('output');

    promptDialog.showModal();

    let ok = document.getElementById('closeDialogTrue');
    ok.addEventListener("click", () => {
        let userInput = document.getElementById('userInput');

        if(userInput.value !== "") {        
            userInput = DOMPurify.sanitize(userInput.value);
            output.innerHTML = `You would like to say: ${userInput}`;
        }
        else {
            output.innerHTML = `The user did not enter a message...`;
        }

        promptDialog.close();
        document.body.removeChild(promptDialog);
    });

    let cancel = document.getElementById('closeDialogFalse');
    cancel.addEventListener("click", () => {
        output.innerHTML = `The user did not enter a message...`;
        promptDialog.close();
        document.body.removeChild(promptDialog);
    });
}
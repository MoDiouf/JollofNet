
  document.getElementById('wifiForm').addEventListener('submit', function (event) {
    // Empêche l'envoi si des erreurs sont détectées
    let errors = [];
    const password = document.getElementById('newpasseword').value;
    const macInputs = document.querySelectorAll('.mac');
    const prixInput = document.getElementById('prix');
    const paymentSelect = document.getElementById('network-payment-select').value;

    // Vérification du mot de passe
    if (!validator.isLength(password, { min: 8 })) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères.");
    }

    // Vérification de l'adresse MAC
    let macAddress = "";
    macInputs.forEach(input => macAddress += input.value);
    if (!validator.isMACAddress(macAddress)) {
      errors.push("L'adresse MAC est invalide.");
    }

   

    // Affiche les erreurs
    if (errors.length > 0) {
      event.preventDefault(); // Bloque l'envoi du formulaire
      alert(errors.join("\n"));
    }
  });

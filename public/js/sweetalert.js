
function refreshModem() {
  fetch('/app/manage/refresh', { method: 'POST' })
    .then(response => {
      if (response.redirected) {
        // Si le serveur redirige, changer l'URL du navigateur
        window.location.href = response.url;
      } else {
        // Sinon, gérer la réponse comme vous le souhaitez
        return response.json(); // Si vous attendez un JSON
      }
    })
    .catch(error => {
      console.error('Erreur lors de la requête de rafraîchissement du modem :', error);
    });
}


  function confirmDeleteModem() {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer le modem ?',
      text: "Cette action est irréversible. ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/app/manage/DeleteModem', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              Swal.fire('Supprimé!', 'Le modem a été supprimé.', 'success');
              // Reload the page or update the UI accordingly
            } else {
              Swal.fire('Erreur!', data.message || 'Une erreur est survenue.', 'error');
            }
          })
          .catch(error => {
            Swal.fire('Erreur!', 'Impossible de supprimer le modem.', 'error');
          });
      }
    });
  }

  function CreateQrCodes() {
    Swal.fire({
      title: 'Voulez-vous generer les Qr Codes ?',
      text: "Veuillez les enregistrer pour eviter de le faire a chaque fois",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, Génerer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/modem/reset', { method: 'POST' })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              Swal.fire('Réinitialisé!', 'Le modem a été réinitialisé.', 'success');
              // Reload the page or update the UI accordingly
            } else {
              Swal.fire('Erreur!', data.message || 'Une erreur est survenue.', 'error');
            }
          })
          .catch(error => {
            Swal.fire('Erreur!', 'Impossible de réinitialiser le modem.', 'error');
          });
      }
    });
  }

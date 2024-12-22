
function refreshModem() {
  fetch('/app/manage/refresh', { method: 'POST' })
    .then(response => {
      if (response.redirected) {
        // Si le serveur redirige, changer l'URL du navigateur
        window.location.href = response.url;
      } else {
        
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
      title: 'Voulez-vous générer les QR Codes ?',
      text: "Tous vos utilisateurs risquent d'être déconnectés",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, Générer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Envoi de la requête POST pour générer les QR codes
        fetch('/app/manage/generate', { 
          method: 'POST' 
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire('Succès!', 'Les QR codes ont été générés avec succès.', 'success').then(() => {
              // Recharger la page après le succès
              location.reload();
            });
          } else {
            Swal.fire('Erreur!', 'Une erreur est survenue lors de la génération des QR codes.', 'error');
          }
        })
        .catch(error => {
          console.error('Erreur:', error);
          Swal.fire('Erreur!', 'Une erreur est survenue.', 'error');
        });
      }
    });
  }
  

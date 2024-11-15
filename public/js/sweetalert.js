
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
        fetch('/api/modem/delete', { method: 'POST' })
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

  function confirmResetModem() {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir réinitialiser le modem ?',
      text: "Toutes les configurations seront perdues.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, réinitialiser',
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

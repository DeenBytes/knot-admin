import Swal from 'sweetalert2';

const Popup = (type, title, text) => {
  // This function must return the Swal.fire promise
  return Swal.fire({
    title: title,
    text: text,
    icon: type,
    showCancelButton: type === 'warning',  // Show cancel button only for warnings
    confirmButtonColor: '#C5A572',
    cancelButtonColor: '#676767',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      popup: 'custom-swal-popup',
    },
  });
};

export default Popup;

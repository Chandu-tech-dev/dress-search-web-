(() => {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const previewImage = document.getElementById('preview-image');
  const searchButton = document.getElementById('search-button');
  const resultsDiv = document.getElementById('results');
  const video = document.getElementById('video');
  const switchCameraButton = document.getElementById('switch-camera');
  const capturePhotoButton = document.getElementById('capture-photo');

  let uploadedFile = null;
  let currentStream = null;
  let useFrontCamera = true;

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.remove('dragover');
    }, false);
  });

  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });

  uploadArea.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
    };
    reader.readAsDataURL(file);
    searchButton.disabled = false;
    resultsDiv.innerHTML = '';
  }

  function simulateSearch(imageFile) {
    resultsDiv.innerHTML = '';
    searchButton.disabled = true;

    const loadingMsg = document.createElement('p');
    loadingMsg.textContent = 'Searching products across popular shopping sites...';
    loadingMsg.style.fontStyle = 'italic';
    resultsDiv.appendChild(loadingMsg);

    setTimeout(() => {
      resultsDiv.innerHTML = '';

      const products = [
        {
          name: "Elegant Floral Summer Dress",
          price: "$49.99",
          image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=80&q=80",
          link: "https://www.zara.com/us/en/floral-summer-dress-p08043243.html",
          site: "Zara"
        },
        {
          name: "Casual Midi Dress with Belt",
          price: "$39.90",
          image: "https://images.unsplash.com/photo-1520975691322-519606f7b0bd?auto=format&fit=crop&w=80&q=80",
          link: "https://www.hm.com/us/product/midi-dress-belted",
          site: "H&M"
        },
        {
          name: "Chiffon A-Line Maxi Dress",
          price: "$89.99",
          image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=80&q=80",
          link: "https://www.asos.com/asos-design/chiffon-maxi-dress/prd/11223344",
          site: "ASOS"
        },
        {
          name: "Black Wrap Around Dress",
          price: "$69.95",
          image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80",
          link: "https://www.nordstrom.com/s/black-wrap-dress",
          site: "Nordstrom"
        }
      ];

      products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = prod.image;
        img.alt = `Image of ${prod.name}`;

        const info = document.createElement('div');
        info.className = 'product-info';

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = prod.name;

        const price = document.createElement('div');
        price.className = 'product-price';
        price.textContent = prod.price;

        const link = document.createElement('a');
        link.className = 'product-link';
        link.href = prod.link;
        link.textContent = `View on ${prod.site}`;
        link.target = '_blank';
        link.rel = 'noopener';

        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(link);

        card.appendChild(img);
        card.appendChild(info);

        resultsDiv.appendChild(card);
      });

      searchButton.disabled = false;
    }, 2000);
  }

  async function startCamera() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    const constraints = {
      video: {
        facingMode: useFrontCamera ? 'user' : 'environment'
      }
    };
    try {
      currentStream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = currentStream;
    } catch (err) {
      alert('Error accessing camera: ' + err.message);
    }
  }

  switchCameraButton.addEventListener('click', () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
  });

  capturePhotoButton.addEventListener('click', () => {
    if (!currentStream) {
      alert('Camera not started');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], 'captured-photo.png', { type: 'image/png' });
        handleFile(file);
      }
    }, 'image/png');
  });

  searchButton.addEventListener('click', () => {
    if (uploadedFile) {
      simulateSearch(uploadedFile);
    }
  });

  // Start camera on page load
  startCamera();

})();

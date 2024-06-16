(() => {
  const global = window;
  let paymentUrl = "";
  let modalWidth = "80%";
  let modalHeight = "70%";
  let defaultAmount = "";
  let defaultReference = "";
  let buttonColor = "#007bff";
  let buttonName = "Pay Now";
  let successUrl = "";
  let failedUrl = "";
  let channelID = "";
  let phone = "";

  const PayHero = {
    init(options) {
      if (options?.paymentUrl) {
        paymentUrl = options.paymentUrl;
      } else {
        console.error("Payment URL is required to initialize the SDK");
        return;
      }

      if (options?.width) {
        modalWidth = options.width;
      }

      if (options?.height) {
        modalHeight = options.height;
      }

      if (options?.amount) {
        defaultAmount = options.amount;
      }

      if (options?.reference) {
        defaultReference = options.reference;
      }

      if (options?.buttonColor) {
        buttonColor = options.buttonColor;
      }

      if (options?.buttonName) {
        buttonName = options.buttonName;
      }

      if (options?.successUrl) {
        successUrl = options.successUrl;
      }

      if (options?.failedUrl) {
        failedUrl = options.failedUrl;
      }

      if (options?.channelID) {
        channelID = options.channelID;
      }

      if (options?.phone) {
        phone = options.phone;
      }

      if (options?.containerId) {
        this.createButton(options.containerId);
        this.createModal();
      } else {
        console.error("Container ID is required to initialize the SDK");
      }
    },

    createButton(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
      }

      const button = document.createElement("button");
      button.id = "paymentButton";
      button.innerText = buttonName; // Updated button text
      button.style.backgroundColor = buttonColor; // user provided color or default color
      button.style.color = "#fff";
      button.style.padding = "12px 24px";
      button.style.fontSize = "16px"; // Slightly smaller font size
      button.style.fontWeight = "bold"; // Bold text
      button.style.border = "none";
      button.style.borderRadius = "4px"; // Less rounded corners
      button.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.1)"; // Lighter shadow
      button.style.cursor = "pointer";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.onclick = this.openPaymentForm.bind(this);
      container.appendChild(button);
    },

    createModal() {
      const modal = document.createElement("div");
      modal.id = "paymentModal";
      modal.className = "modal";

      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";
      modalContent.style.width = modalWidth;
      modalContent.style.height = modalHeight;

      const closeButton = document.createElement("span");
      closeButton.className = "close";
      closeButton.innerHTML = "&times;";
      closeButton.onclick = this.closeModal.bind(this);
      modalContent.appendChild(closeButton);

      const iframeWrapper = document.createElement("div");
      iframeWrapper.style.width = "100%";
      iframeWrapper.style.height = "calc(100% - 40px)";
      iframeWrapper.style.overflow = "hidden";

      const iframe = document.createElement("iframe");
      iframe.id = "paymentFrame";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";

      iframeWrapper.appendChild(iframe);
      modalContent.appendChild(iframeWrapper);

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      this.injectStyles();
    },

    openPaymentForm() {
      const modal = document.getElementById("paymentModal");
      const iframe = document.getElementById("paymentFrame");

      let urlWithParams = this.constructPaymentUrl(
        paymentUrl,
        defaultAmount,
        defaultReference
      );

      if (successUrl) {
        urlWithParams += `&success_url=${encodeURIComponent(successUrl)}`;
      }
      if (failedUrl) {
        urlWithParams += `&failed_url=${encodeURIComponent(failedUrl)}`;
      }
      if (channelID) {
        urlWithParams += `&channel_id=${channelID}`;
      }
      if (phone) {
        urlWithParams += `&phone=${phone}`;
      }

      // Create loader element dynamically
      const loader = document.createElement("div");
      loader.id = "loader";
      loader.style.position = "absolute";
      loader.style.top = "50%";
      loader.style.left = "50%";
      loader.style.transform = "translate(-50%, -50%)";
      loader.style.zIndex = "1000";
      loader.innerHTML = '<img src="preloader.gif" alt="Loading...">'; // Adjust the path to your loader gif

      // Append loader to modal
      modal.appendChild(loader);

      // Show loader and hide iframe initially
      loader.style.display = "block";
      iframe.style.display = "none";

      iframe.src = urlWithParams;

      // Add event listener for iframe load
      iframe.addEventListener("load", () => {
        loader.style.display = "none"; // Hide loader
        iframe.style.display = "block"; // Show iframe
        modal.removeChild(loader); // Remove loader from DOM
      });

      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    },

    constructPaymentUrl(baseUrl, amount, reference) {
      const urlParams = new URLSearchParams(baseUrl.search);
      urlParams.set("amount", amount);
      urlParams.set("reference", reference);

      return `${baseUrl}?${urlParams.toString()}`;
    },

    closeModal() {
      const modal = document.getElementById("paymentModal");
      const iframe = document.getElementById("paymentFrame");
      modal.style.display = "none";
      iframe.src = "";
      document.body.style.overflow = "auto";
    },

    injectStyles() {
      const styles = `
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black backdrop */
                }
                .modal-content {
                    background-color: #fff;
                    margin: auto;
                    padding: 0;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    margin: 10px;
                    cursor: pointer;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                }
            `;

      const styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    },
  };

  global.PayHero = PayHero;
})();

(() => {
  const global = window;
  // Configuration defaults
  const config = {
    paymentUrl: "",
    modalWidth: "80%",
    modalHeight: "70%",
    defaultAmount: "",
    defaultReference: "",
    buttonColor: "#007bff",
    buttonName: "Pay Now",
    successUrl: "",
    failedUrl: "",
    channelID: "",
    phone: "",
    containerId: null
  };

  // Loading indicator states
  let isLoading = false;
  
  const PayHero = {
    init(options = {}) {
      // Validate required parameters
      if (!options.paymentUrl) {
        console.error("Payment URL is required to initialize the SDK");
        return this;
      }
      
      if (!options.containerId) {
        console.error("Container ID is required to initialize the SDK");
        return this;
      }
      
      // Update configuration with user options
      Object.keys(options).forEach(key => {
        if (config.hasOwnProperty(key)) {
          config[key] = options[key];
        }
      });
      
      // Initialize the UI components
      this.createButton(config.containerId);
      this.createModal();
      
      // Setup event listeners
      this.setupEventListeners();
      
      return this;
    },

    createButton(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
      }

      const button = document.createElement("button");
      button.id = "paymentButton";
      button.innerText = config.buttonName;
      button.classList.add("payhero-button");
      container.appendChild(button);
    },

    createModal() {
      // Create modal container if it doesn't already exist
      if (document.getElementById("paymentModal")) {
        return;
      }
      
      const modal = document.createElement("div");
      modal.id = "paymentModal";
      modal.className = "payhero-modal";

      const modalContent = document.createElement("div");
      modalContent.className = "payhero-modal-content";
      modalContent.style.width = config.modalWidth;
      modalContent.style.height = config.modalHeight;

      const modalHeader = document.createElement("div");
      modalHeader.className = "payhero-modal-header";
      
      const title = document.createElement("h3");
      title.innerText = "Secure Payment";
      title.className = "payhero-modal-title";
      
      const closeButton = document.createElement("button");
      closeButton.className = "payhero-close-button";
      closeButton.innerHTML = "&times;";
      closeButton.setAttribute("aria-label", "Close payment form");
      
      modalHeader.appendChild(title);
      modalHeader.appendChild(closeButton);
      modalContent.appendChild(modalHeader);

      // Create loading spinner
      const spinner = document.createElement("div");
      spinner.className = "payhero-spinner";
      spinner.id = "paymentSpinner";
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.className = "payhero-spinner-dot";
        spinner.appendChild(dot);
      }
      modalContent.appendChild(spinner);

      // Create iframe container
      const iframeWrapper = document.createElement("div");
      iframeWrapper.className = "payhero-iframe-wrapper";

      const iframe = document.createElement("iframe");
      iframe.id = "paymentFrame";
      iframe.setAttribute("title", "Payment Form");
      iframe.setAttribute("sandbox", "allow-forms allow-scripts allow-same-origin allow-top-navigation");

      iframeWrapper.appendChild(iframe);
      modalContent.appendChild(iframeWrapper);

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      this.injectStyles();
    },
    
    setupEventListeners() {
      // Add payment button click event
      const button = document.getElementById("paymentButton");
      if (button) {
        button.addEventListener("click", this.openPaymentForm.bind(this));
      }
      
      // Add close button click event
      const closeButton = document.querySelector(".payhero-close-button");
      if (closeButton) {
        closeButton.addEventListener("click", this.closeModal.bind(this));
      }
      
      // Add click outside modal to close
      const modal = document.getElementById("paymentModal");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            this.closeModal();
          }
        });
      }
      
      // Add escape key listener
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
          this.closeModal();
        }
      });
      
      // Handle browser back button
      window.addEventListener("popstate", () => {
        if (modal.style.display === "block") {
          this.closeModal();
          history.pushState(null, document.title, window.location.href);
        }
      });
    },

    openPaymentForm() {
      const modal = document.getElementById("paymentModal");
      const iframe = document.getElementById("paymentFrame");
      const spinner = document.getElementById("paymentSpinner");
      
      if (!modal || !iframe || !spinner) {
        console.error("Required elements not found");
        return;
      }
      
      // Show loading state
      isLoading = true;
      spinner.style.display = "flex";
      iframe.style.display = "none";
      
      // Build payment URL with parameters
      let urlWithParams = this.constructPaymentUrl();
      
      // Set iframe source
      iframe.src = urlWithParams;
      
      // Add load event for iframe
      iframe.onload = () => {
        if (isLoading) {
          setTimeout(() => {
            spinner.style.display = "none";
            iframe.style.display = "block";
            isLoading = false;
          }, 300); // Small delay for smoother transition
        }
      };
      
      // Handle iframe loading error
      iframe.onerror = () => {
        console.error("Failed to load payment form");
        spinner.style.display = "none";
        isLoading = false;
      };
      
      // Show modal
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      
      // Add history entry for back button support
      history.pushState({ modal: "open" }, document.title, window.location.href);
    },

    constructPaymentUrl() {
      // Parse the base URL
      let url;
      try {
        url = new URL(config.paymentUrl);
      } catch (e) {
        console.error("Invalid payment URL", e);
        return config.paymentUrl;
      }
      
      // Add all parameters to URL
      const params = {
        amount: config.defaultAmount,
        reference: config.defaultReference,
        success_url: config.successUrl,
        failed_url: config.failedUrl,
        channel_id: config.channelID,
        phone: config.phone
      };
      
      // Add non-empty parameters
      Object.keys(params).forEach(key => {
        if (params[key]) {
          url.searchParams.set(key, params[key]);
        }
      });
      
      return url.toString();
    },

    closeModal() {
      const modal = document.getElementById("paymentModal");
      const iframe = document.getElementById("paymentFrame");
      const spinner = document.getElementById("paymentSpinner");
      
      if (!modal || !iframe) return;
      
      // Reset modal state
      iframe.src = "";
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      
      if (spinner) {
        spinner.style.display = "none";
      }
      
      isLoading = false;
      
      // Dispatch close event
      window.dispatchEvent(new CustomEvent("payheroclosed"));
    },

    injectStyles() {
      // Avoid duplicate styles
      if (document.getElementById("payhero-styles")) return;
      
      const styles = `
        .payhero-button {
          background-color: ${config.buttonColor};
          color: #fff;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          outline: none;
        }
        
        .payhero-button:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .payhero-button:active {
          transform: translateY(0);
          filter: brightness(0.95);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        }
        
        .payhero-modal {
          display: none;
          position: fixed;
          z-index: 9999;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: rgba(0, 0, 0, 0.7);
          animation: payheroFadeIn 0.3s ease;
          backdrop-filter: blur(3px);
        }
        
        .payhero-modal-content {
          background-color: #fff;
          margin: 2vh auto;
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          max-width: 1200px;
          max-height: 90%;
          animation: payheroSlideIn 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .payhero-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #eaeaea;
        }
        
        .payhero-modal-title {
          margin: 0;
          font-size: 18px;
          color: #333;
          font-weight: 600;
        }
        
        .payhero-close-button {
          background: none;
          border: none;
          font-size: 24px;
          line-height: 1;
          color: #999;
          cursor: pointer;
          padding: 0 8px;
          transition: color 0.2s;
        }
        
        .payhero-close-button:hover {
          color: #333;
        }
        
        .payhero-iframe-wrapper {
          flex: 1;
          width: 100%;
          height: calc(100% - 53px);
          overflow: hidden;
        }
        
        #paymentFrame {
          width: 100%;
          height: 100%;
          border: none;
          display: none;
        }
        
        .payhero-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100% - 53px);
          flex-shrink: 0;
        }
        
        .payhero-spinner-dot {
          width: 12px;
          height: 12px;
          margin: 0 4px;
          background-color: ${config.buttonColor};
          border-radius: 50%;
          display: inline-block;
          animation: payheroBounceDot 1.4s infinite ease-in-out both;
        }
        
        .payhero-spinner-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .payhero-spinner-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes payheroBounceDot {
          0%, 80%, 100% { 
            transform: scale(0);
          } 40% { 
            transform: scale(1.0);
          }
        }
        
        @keyframes payheroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes payheroSlideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .payhero-modal-content {
            width: 95% !important;
            height: 85% !important;
            margin: 5vh auto;
          }
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.id = "payhero-styles";
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
    },
    
    // New public methods for more control
    
    /**
     * Update button appearance
     * @param {Object} options Button styling options
     */
    updateButton(options = {}) {
      const button = document.getElementById("paymentButton");
      if (!button) return;
      
      if (options.name) {
        button.innerText = options.name;
        config.buttonName = options.name;
      }
      
      if (options.color) {
        button.style.backgroundColor = options.color;
        config.buttonColor = options.color;
        this.injectStyles(); // Refresh styles to update spinner color
      }
    },
    
    /**
     * Update payment parameters
     * @param {Object} params Payment parameters
     */
    updatePaymentParams(params = {}) {
      Object.keys(params).forEach(key => {
        if (config.hasOwnProperty(key)) {
          config[key] = params[key];
        }
      });
    },
    
    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
      return { ...config };
    }
  };

  global.PayHero = PayHero;
})();

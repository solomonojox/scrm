import { useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import WaitingLoader from './WaitingLoader';
import { AppContext } from './AppContext';

const createStorage = () => ({
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  },
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
});

const ContextProvider = (props) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState("");

  const showOverlay = useCallback((color = "primary") => {
    setOverlayColor(color);
    setIsOverlayVisible(true);
  }, []);
  const hideOverlay = useCallback(() => setIsOverlayVisible(false), []);

  // Number formatting functions
  function formatNumberWithCommas(number) {
    number = Number(number);
    return number.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  const formatAmount = (amt) =>
    amt
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatCurrency = (number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(number);

  // String Manipulation
  const capitalizeText = (text) => {
    const spacedText = text.replace(/([a-z])([A-Z])/g, "$1 $2");
    return spacedText
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const removeSpecialChars = (text) => {
    return text.replace(/[^a-zA-Z0-9 ]/g, '');
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  function getInitials(phrase) {
    return phrase
      .split(' ') // Split the phrase into words
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
      .join(''); // Join the initials together
  }

  // Date & Time Utilities
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
      (day % 10 === 2 && day !== 12) ? 'nd' :
        (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    return `${day}${suffix} ${month} ${year}`;
  }

  function formatTimeTo12Hour(timeString) {
    const date = new Date(`1970-01-01T${timeString}Z`); // Use a dummy date to parse the time

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes to always be two digits
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'just now';
  };

  const formatTimeRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`;
  };

  // Validation Utilities
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{4})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]}` : number;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        length: password.length < minLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        number: !hasNumbers,
        specialChar: !hasSpecialChar
      }
    };
  };

  // File Handling
  const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Notifications
  const notifySuccess = (message, options = {}) => toast.success(message, options);
  const notifyError = (message, options = {}) => toast.error(message, options);
  const notifyInfo = (message, options = {}) => toast.info(message, options);
  const notifyWarn = (message, options = {}) => toast.warn(message, options);

  // Utility Functions
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const storage = useMemo(() => createStorage(), []);

  const contextValue = useMemo(() => ({
    // Overlay Management
    showOverlay,
    hideOverlay,
    isOverlayVisible,
    overlayColor,

    // Number Formatting
    formatNumberWithCommas,
    formatAmount,
    formatCurrency,

    // String Manipulation
    capitalizeText,
    truncateText,
    removeSpecialChars,
    slugify,
    getInitials,

    // Date & Time
    formatDate,
    formatTimeTo12Hour,
    getTimeAgo,
    formatTimeRange,

    // Validation
    isValidEmail,
    formatPhoneNumber,
    validatePassword,

    // File Handling
    getFileExtension,
    formatFileSize,

    // Notifications
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarn,

    // Storage
    storage,

    // Utils
    debounce
  }), [
    hideOverlay,
    showOverlay,
    isOverlayVisible,
    overlayColor,
    storage
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
      <ToastContainer />
      <WaitingLoader />
    </AppContext.Provider>
  );
};

// Add PropTypes validation
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ContextProvider;
import React, { createContext, useState, useCallback } from "react";
import { showNotification } from "../utilities/Notification/Noty";

export const AppContext = createContext();

const ContextProvider = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [rating, setRating] = useState(0);
  const [availability, setAvailability] = useState(true);

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState("");

  const showOverlay = useCallback((color = "primary") => {
    setOverlayColor(color);
    setIsOverlayVisible(true);
  }, []);
  const hideOverlay = useCallback(() => setIsOverlayVisible(false), []);

  function formatNumberWithCommas(number) {
    console.log(typeof number)
    number = Number(number);
    var res = number.toLocaleString(undefined, { maximumFractionDigits: 0 });
    console.log("resulting number", res);
    return res
  }

  const capitalizeText = (text) => {
    // Insert a space before uppercase letters (to handle camelCase or PascalCase)
    const spacedText = text.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Capitalize the first letter of each word
    return spacedText
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    // Determine ordinal suffix
    const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
      (day % 10 === 2 && day !== 12) ? 'nd' :
        (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    return `${day}${suffix} ${month} ${year}`;
  }

  const formatAmount = (amt) =>
    amt
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");


  const contextValue = {
    showNotification,
    formatCurrency: (number) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(number),
    setSearchQuery,
    searchQuery,
    priceRange,
    setPriceRange,
    rating,
    setRating,
    availability,
    setAvailability,
    isOverlayVisible,
    overlayColor,
    showOverlay,
    hideOverlay,
    formatNumberWithCommas,
    capitalizeText,
    formatDate,
    formatAmount
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

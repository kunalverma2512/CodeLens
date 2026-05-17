import LoaderPrimary from "./LoaderPrimary";
import LoaderAlt from "./LoaderAlt";

// Centralized loader switching logic
// Change this boolean to switch loaders globally
const USE_ALT_LOADER = false; // Set to true to use the alternative loader

const LoaderSwitcher = () => {
  return USE_ALT_LOADER ? <LoaderAlt /> : <LoaderPrimary />;
};

export default LoaderSwitcher;
const isNode = typeof window === "undefined";

const memoryStorage = {
  getItem() {
    return null;
  },
  setItem() {},
  removeItem() {}
};

const storage = isNode ? memoryStorage : window.localStorage;

function toSnakeCase(value) {
  return value.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function getAppParamValue(
  paramName,
  { defaultValue = undefined, removeFromUrl = false } = {}
) {
  if (isNode) {
    return defaultValue;
  }

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${
      urlParams.toString() ? `?${urlParams}` : ""
    }${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  return storage.getItem(storageKey);
}

function getAppParams() {
  if (getAppParamValue("clear_access_token") === "true") {
    storage.removeItem("base44_access_token");
    storage.removeItem("token");
  }

  return {
    appId: getAppParamValue("app_id", {
      defaultValue: import.meta.env.VITE_BASE44_APP_ID
    }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: isNode
      ? ""
      : getAppParamValue("from_url", { defaultValue: window.location.href }),
    functionsVersion: getAppParamValue("functions_version", {
      defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION
    }),
    appBaseUrl: getAppParamValue("app_base_url", {
      defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL
    })
  };
}

export const appParams = {
  ...getAppParams()
};

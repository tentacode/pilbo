const { withEntitlementsPlist } = require("expo/config-plugins");

// expo-notifications always adds the push entitlement, which free Apple accounts cannot sign.
// Pilbo only uses local notifications, so it is safe to remove.
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (modConfig) => {
    delete modConfig.modResults["aps-environment"];
    return modConfig;
  });
};

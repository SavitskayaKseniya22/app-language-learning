export default {
    extends: ["stylelint-config-standard-scss", "stylelint-config-prettier-scss", "stylelint-config-recess-order"],
    ignoreFiles: ["node_modules/**/*.scss", "dist/**/*.scss", "coverage/**/*.scss"],
    rules: {
        "selector-class-pattern": "^[a-z][a-z0-9]*(?:__[a-z][a-z0-9-]*)?(?:--[a-z][a-z0-9-]*)?$",
    },
};

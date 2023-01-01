module.exports = {
  packagerConfig: {
    icon: "./src/assets/main-icon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl:
          "https://github.com/voanhhieu10250/RevisionApp/blob/master/src/renderer/assets/main-icon.png?raw=true",
        setupIcon: "./src/renderer/assets/main-icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        icon: "./src/renderer/assets/main-icon.png",
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "voanhhieu10250",
          name: "RevisionApp",
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};

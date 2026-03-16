const { sidebarTree } = require("../code/config");
const apiDocs = sidebarTree("API docs");
const gmpaVuePackage = require("../../../v2/package.json");

module.exports = {
  base: "/gmap-vue/",
  title: `Gmap-vue v${gmpaVuePackage.version}`,
  description: "Documentation for gmap-vue plugin",
  themeConfig: {
    sidebarDepth: 4,
    nav: [
      { text: "Plugin", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/code/" },
      { text: "Developers", link: "/developers/" },
      { text: "CHANGELOG", link: "/changelog/changelog" },
      { text: "GitHub", link: "https://github.com/diegoazh/gmap-vue" },
    ],
    sidebar: {
      "/code/": apiDocs["/code/"],
      "/guide/": [
        {
          title: "Guide",
          collapsable: false,
          children: [
            {
              title: "Concepts",
              collapsable: false,
              path: "/guide/",
            },
            {
              title: "Components",
              collapsable: false,
              path: "/guide/map",
              children: [
                ["map", "GmapMap"],
                ["autocomplete", "GmapAutocomplete"],
                ["circle", "GmapCircle"],
                ["cluster", "GmapCluster"],
                ["drawing-manager", "GmapDrawingManager"],
                ["heatmap-layer", "GmapHeatmapLayer"],
                ["info-window", "GmapInfoWindow"],
                ["kml-layer", "GmapKmlLayer"],
                ["marker", "GmapMarker"],
                ["place-input", "GmapPlaceInput"],
                ["polygon", "GmapPolygon"],
                ["polyline", "GmapPolyline"],
                ["rectangle", "GmapRectangle"],
                ["street-view-panorama", "GmapStreetViewPanorama"],
                ["extra-examples", "Extra examples"],
                ["cdn", "Using a CDN"],
              ],
            },
            {
              title: "Factories",
              collapsable: false,
              path: "/guide/map-element-factory",
              children: [
                ["map-element-factory", "mapElement factory"],
                ["promise-lazy-factory", "promiseLazy factory"],
              ],
            },
          ],
        },
      ],
      "/developers/": [
        {
          title: "Developers",
          collapsable: false,
          children: [
            {
              title: "Contribution guide",
              collapsable: false,
              path: "/developers/",
            },
            {
              title: "License",
              collapsable: false,
              path: "/developers/license",
              children: [["license", "License"]],
            },
          ],
        },
      ],
      "/changelog/": [
        {
          title: "CHANGELOG",
          collapsable: false,
          children: [
            {
              title: "CHANGELOG",
              collapsable: false,
              path: "/changelog/changelog",
            },
          ],
        },
      ],
      "/": [["", "Getting started"]],
    },
  },
};

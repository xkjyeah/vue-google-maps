<template>
  <div>
    <gmv-map
      :center="{ lat: 1.38, lng: 103.8 }"
      :zoom="12"
      style="width: 100%; height: 500px"
    >
      <gmv-polygon
        :editable="true"
        :paths="paths"
        @paths_changed="updateEdited($event)"
      />
    </gmv-map>

    <ul v-if="edited" @click="edited = null">
      <li v-for="(path, i) in edited" :key="i">
        <ol>
          <li v-for="(point, j) in path" :key="j">
            {{ point.lat }}, {{ point.lng }}
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      edited: null,
      paths: [
        [
          { lat: 1.38, lng: 103.8 },
          { lat: 1.38, lng: 103.81 },
          { lat: 1.39, lng: 103.81 },
          {
            lat: 1.39,
            lng: 103.8,
          },
        ],
        [
          { lat: 1.382, lng: 103.802 },
          { lat: 1.382, lng: 103.808 },
          { lat: 1.388, lng: 103.808 },
          {
            lat: 1.388,
            lng: 103.802,
          },
        ],
      ],
    };
  },
  methods: {
    updateEdited(mvcArray) {
      console.info('>>>>> the event was fired successfully');
      const paths = [];
      for (let i = 0; i < mvcArray.getLength(); i++) {
        const path = [];

        for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {
          const point = mvcArray.getAt(i).getAt(j);
          path.push({ lat: point.lat(), lng: point.lng() });
        }

        paths.push(path);
      }
      this.edited = paths;
    },
  },
};
</script>

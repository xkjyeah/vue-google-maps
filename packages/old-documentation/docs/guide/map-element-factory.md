# The mapElement factory

The current code of the `mapElement` factory function.

You can find the API documentation [here](/code/utils/factories/map-element.html).

```js
import MapElementMixin from '../../mixins/map-element';
import {
  bindEvents,
  bindProps,
  getPropsValues,
  mappedPropsToVueProps,
} from '../helpers';

function _assert(v, message) {
  if (!v) throw new Error(message);
}

function mapElement(providedOptions) {
  const {
    mappedProps,
    name,
    ctr,
    ctrArgs,
    events,
    beforeCreate,
    afterCreate,
    props,
    ...rest
  } = providedOptions;

  const promiseName = `$${name}Promise`;
  const instanceName = `$${name}Object`;

  _assert(!(props instanceof Array), '`props` should be an object, not Array');

  return {
    ...(typeof GENERATE_DOC !== 'undefined'
      ? { $vgmOptions: providedOptions }
      : {}),
    mixins: [MapElementMixin],
    props: {
      ...props,
      ...mappedPropsToVueProps(mappedProps),
    },
    render() {
      return '';
    },
    provide() {
      const promise = this.$mapPromise
        .then((map) => {
          // Infowindow needs this to be immediately available
          this.$map = map;

          // Initialize the maps with the given options
          const initialOptions = {
            ...this.options,
            map,
            ...getPropsValues(this, mappedProps),
          };
          // don't use delete keyword in order to create a more predictable code for the engine
          const { options: extraOptions, ...finalOptions } = initialOptions; // delete the extra options
          const options = finalOptions;

          if (beforeCreate) {
            const result = beforeCreate.bind(this)(options);

            if (result instanceof Promise) {
              return result.then(() => ({ options }));
            }
          }
          return { options };
        })
        .then(({ options }) => {
          const ConstructorObject = ctr();
          // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
          this[instanceName] = ctrArgs
            ? new (Function.prototype.bind.call(
                ConstructorObject,
                null,
                ...ctrArgs(options, getPropsValues(this, props || {}))
              ))()
            : new ConstructorObject(options);

          bindProps(this, this[instanceName], mappedProps);
          bindEvents(this, this[instanceName], events);

          if (afterCreate) {
            afterCreate.bind(this)(this[instanceName]);
          }
          return this[instanceName];
        });

      this[promiseName] = promise;
      return { [promiseName]: promise };
    },
    destroyed() {
      // Note: not all Google Maps components support maps
      if (this[instanceName] && this[instanceName].setMap) {
        this[instanceName].setMap(null);
      }
    },
    ...rest,
  };
}

export default mapElement;
```

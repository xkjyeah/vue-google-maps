/* vim: set softtabstop=2 shiftwidth=2 expandtab : */
import _ from 'lodash'
export default (props, twoWayList, exclusionList, trackProps) => {
  let bindProps = {};
  let excludedProps = _.omit(props, exclusionList);
  _.forEach(excludedProps, (prop, key)=>{
    let tempProp = _.clone(prop);
    if(_.includes(twoWayList, key)){
      tempProp.twoWay= true;
    }
    if(trackProps && trackProps[key]){
      tempProp.trackProperties = trackProps[key];
    }
    bindProps[key]=tempProp;
  });
  return bindProps;
}

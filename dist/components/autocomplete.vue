<template>   
    <input id="map" type="text" placeholder="" ref="input"/>
</template>

<script src="./autocompleteImpl.js">

</script>

<style scoped>
	#map {
	-webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;

	}

    #map:focus {
        outline: 0;
        border-color: #20a0ff;
    }

    #map:hover {
        border-color: #8391a5;
    }
</style>
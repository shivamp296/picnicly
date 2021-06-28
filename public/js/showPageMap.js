  // mapboxgl.accessToken = 'pk.eyJ1IjoicHNhYmVyMjkiLCJhIjoiY2txYjZwbHdoMTZ3bTJ3bXZkNG1uM3IwNSJ9.-T8xjDMgKMK6B6cEci8TcQ';
//   mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>';
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  // style: 'mapbox://styles/mapbox/light-v10',  //light color
  center: picnic_info.geometry.coordinates, // starting position [lng, lat]
  zoom: 7 // starting zoom
  });

  //setting marker
  new mapboxgl.Marker()
  .setLngLat(picnic_info.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
      .setHTML(
        `<h3>${picnic_info.title}</h3><p>${picnic_info.location}</p>`
      )
  )
  .addTo(map)


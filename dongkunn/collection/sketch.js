const mappa = new Mappa('Leaflet');
const sketch = (p) => {
  let mymap;
  let canvas;
  let options;
  let nowPosion_lat,nowPosion_lon;
  let my_lat,my_lon;
  let totalSeconds;

  p.preload = () => {//frameCount
    navigator.geolocation.getCurrentPosition(showPosition);
  };


  p.setup = () => {
    navigator.geolocation.getCurrentPosition(showPosition);
    
    totalSeconds = 0;
    countTimer();
    
    nowPosion_lat = 24.06396087676496;
    nowPosion_lon = 120.67980369215158;
    //nowPosion_lat = 21.993965;
    //nowPosion_lon = 120.790949;
    
    options = {
      lat: 23.6,
      lng: 121,
      zoom: 7.5,
      style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    };
    
    options.lat = (my_lat + nowPosion_lat)/2;
    options.lng = (my_lon + nowPosion_lon)/2;
    options.zoom = p.ceil(p.map(LatLonDistance(my_lat,my_lon,nowPosion_lat, nowPosion_lon),0,370,11,7.5,true),2);
    
    console.log(LatLonDistance(my_lat,my_lon,nowPosion_lat, nowPosion_lon));
    console.log(my_lat);
    console.log(options.zoom);
    
    //let p5map = select('#p5map');
    //p5map.html("123");

    canvas = p.createCanvas(700, 700);
    //canvas.parent("p5map");

    mymap = mappa.tileMap(options);  
    // 宣告 mappa 地圖
    mymap.overlay(canvas);           
    // 疊在 canvas 上
    //locations = now.records.location;

    p.textStyle(p.BOLD);
  };

  p.draw = () => {
    p.clear();
    
    if(p.floor(p.frameCount % 60) == 0){
      countTimer();
    }
    p.push();
      p.translate(latlotTOXY(my_lat,my_lon));
      p.fill(255,0,0);  
      p.noStroke();
      p.circle(0,0,10);
      p.fill(0); 
      p.stroke(255);
      let showt = "你的位置\n距離樹湳三官大帝廟 " + p.round(LatLonDistance(my_lat,my_lon,nowPosion_lat, nowPosion_lon),3) + "KM";
      //showt += "\n我的位置 Latitude: " + my_lat + " Longitude: " + my_lon;
      //showt += "\nLatitude: " + nowPosion_lat + " Longitude: " + nowPosion_lon;
      p.text(showt + "\n下次更新: " + totalSeconds + "秒後",10,0);
    p.pop();
    p.push();
      p.translate(latlotTOXY(nowPosion_lat, nowPosion_lon));
      p.fill(128,128,0);  
      p.noStroke();
      p.circle(0,0,15);
      p.fill(0); 
      p.stroke(255);
      p.textAlign(p.LEFT,p.CENTER)
      p.text("柳樹湳三官大帝廟",12,0);
    p.pop();
  };

  function latlotTOXY(lat,lon) {
    const pix = mymap.latLngToPixel(lat, lon);  
    // GPS 對應 畫面 x, y
    vec = p.createVector(pix.x, pix.y);
    return vec;
  }

  function showPosition(position) {
    my_lat = position.coords.latitude;
    my_lon = position.coords.longitude;
    //my_lat = 25.229747;
    //my_lon = 121.550172;
  }

  function countTimer() {
    if(totalSeconds<=0){
      navigator.geolocation.getCurrentPosition(showPosition);
      totalSeconds = 11;
    }
    --totalSeconds;
    //console.log("下次更新: " + seconds + "秒後");
  }

  function LatLonDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (p.PI/180)
  }
};

let sk = new p5(sketch, 'p5map');
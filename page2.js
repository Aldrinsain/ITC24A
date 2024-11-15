class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();

        this.attendanceCountSC = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountLab = 0;
        this.markerCounts = {};
        this.markers = [];
        this.loggedData = []; 

        this.btn = document.getElementById('btn');
        this.btn1 = document.getElementById('btn1');
        this.btn2 = document.getElementById('btn2');
        this.btnclear = document.getElementById('btnclear');
        this.logCountElement = document.getElementById('logCount');
        this.logCount1Element = document.getElementById('logCountBA');
        this.logCount2Element = document.getElementById('logCountCCS');
        this.idContainer = document.getElementById('logContainer');
        this.btn.addEventListener('click', () => this.dataSc());
        this.btn1.addEventListener('click', () => this.dataLab());
        this.btn2.addEventListener('click', () => this.dataBa());
        this.btnclear.addEventListener('click', () => this.clearLogs());
    }

    initTileLayer() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Sample for new corales BSIT student'
        }).addTo(this.map);
    }
      
    addMarker(lat, long, message){
        const marker = L.marker([lat, long]).addTo(this.map)
        this.markerCounts[message] = (this.markerCounts[message] || 0) + 1;
        this.updateMarkerPopup(marker, message);
        marker.on('click', () => {
            this.markerCounts[message]++;
            this.updateMarkerPopup(marker, message);
        });

        this.markers.push(marker);
    }

    updateMarkerPopup(marker, message) {
        const count = this.markerCounts[message];
        marker.bindPopup(`${message}<br>Attendance logs: ${count}`).openPopup();
    }

    loadMarkersFromJson(url) {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(marker => {
                this.addMarker(marker.latitude, marker.longitude, marker.message);
            });
        })
        .catch(error => console.error("Error Loading servers:", error));
    }

    clearLogs(){
        this.attendanceCountSC = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountLab = 0;

        this.loggedData = [];
        this.markerCounts = {}; 
        this.markers.forEach(marker => {
            const message = marker.getPopup().getContent().split('<br>')[0]; 
            this.markerCounts[message] = 0;
            this.updateMarkerPopup(marker, message); 
        });

        this.updateLogDisplay();
    }

    displayLogCount() {      
        this.logCountElement.innerHTML = `SC  GOAT: ${this.attendanceCountSC}`;
        this.logCount1Element.innerHTML = `BA  GOAT: ${this.attendanceCountBA}`;
        this.logCount2Element.innerHTML = `CCS GOAT: ${this.attendanceCountLab}`;
   }

    dataSc() {
        this.addMarker(8.360238, 124.867470, 'SC GOAT');
        this.attendanceCountSC++; 
        this.updateLogDisplay();
    }

    dataBa() {
        this.addMarker(8.359134, 124.868537, 'BA GOAT');
        this.attendanceCountBA++;
        this.updateLogDisplay();
    }
    
    dataLab() {
        this.addMarker(8.359639, 124.869179, 'CCS GOAT');
        this.attendanceCountLab++;
        this.updateLogDisplay();
    }

    updateLogDisplay() {
        this.idContainer.innerHTML = ''; 
        this.loggedData.forEach(data => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            this.idContainer.appendChild(logItem);
        });
        this.displayLogCount();
    }

}
const Mymap = new LeafletMap('map', [8.359735, 124.869206], 18);


Mymap.loadMarkersFromJson('page2.json');

document.addEventListener('DOMContentLoaded', () => {
    Mymap.displayLogCount();
    Mymap.loadMarkersFromJson('page2.json');
});